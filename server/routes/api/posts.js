// ====================== IMPORTS ======================
const router = require('express').Router();
const { isAuthenticated } = require(__dirname + '/../../helpers/auth');
const { handleInitialFormCheck } = require(__dirname + '/../../helpers/requestCheck');
const moment = require('moment');
const User = require(__dirname + '/../../models/User');
const Post = require(__dirname + '/../../models/Post');
const { upload, removeImages } = require(__dirname + '/../../helpers/handleImages');
const { isJSON } = require(__dirname + '/../../helpers/validation');
const ObjectId = require('mongoose').Types.ObjectId;

const multipleUpload = upload.array('image', 10); // MAXIMUM 10 IMAGES AT ONCE

global.globalPosts = 0;
global.touchedPost = null;

// ====================== WATCH USER POSTS ======================
router.get('/subscribe', async(req, res) => {
    try {
        let localPosts = 0;
        res.set('Content-Type', 'text/event-stream');
        res.set('Connection', 'Keep-alive');
        res.set('Cache-Control', 'no-cache');

        setInterval(async() => {
            if(localPosts === globalPosts) return res.status(200).write('data: 0' + '\n\n');
            else if(localPosts < globalPosts) {
                let changedPost = null;

                changedPost = touchedPost;  

                localPosts = globalPosts;
                return res.status(200).write(`data: ${JSON.stringify(changedPost)}`  + '\n\n');
            }
        }, 1000);
 
    } catch (err) {
        return res.json({ status: 0, message: 'Error getting posts!'});
    }
});

// ====================== GET USER POSTS ======================
router.get('/:id', isAuthenticated, async(req, res) => {
    const posts = await Post.find({}).sort('-date');
    return res.send(posts);
});

// ====================== CREATE POST ======================
router.post('/', isAuthenticated, (req, res) => {
    try {
        // ====================== UPLOAD IMGS TO S3 ======================
        multipleUpload(req, res, async(err) => {
            if(err) return res.status(422).json({ errors: [{ title: 'Image Upload Error', detail: err.message }]});

            // ====================== IMAGES REMOVE IN CASE OF ERROR ======================
            const errorRemoveImgs = [];
            if(req.files.length > 0) req.files.forEach(img => errorRemoveImgs.push(img.location.slice(-41)));

            if(typeof req.body.data !== 'string' || !isJSON(req.body.data)) {
                if(errorRemoveImgs.length > 0) removeImages(errorRemoveImgs);
                return res.json({ status: 0, message: 'Invalid request!', code: 404 });
            }

            //  ====================== HANDLE INITIAL CHECK FOR STRING DATA ======================
            const initialCheckRes = handleInitialFormCheck(JSON.parse(req.body.data), 'addPost', 2);
            if(initialCheckRes.status !== 1) {
                if(errorRemoveImgs.length > 0) removeImages(errorRemoveImgs);
                return res.json(initialCheckRes);
            }

            // ====================== CREATE NEW POST ======================
            let newPost = {};
            const data = JSON.parse(req.body.data);

            data.map(e => newPost[e.type] = e.val);
            
            // ====================== CREATE A NEW ARRAY FOR IMAGES PATHS ======================
            const imgs = [];
            req.files.map(img => imgs.push(img.location.slice(-41)));
            newPost.imgs = imgs; // ADD IMAGES

            // ====================== ADD THE USER WHICH CREATED THE POST ======================
            newPost.authorId = req.user._id;

            // ====================== INSERT THE NEW POST TO THE DB ======================
            const createdPost = await Post.create(newPost);
            if(!createdPost) return res.json({ status: 0, message: 'Error while inserting post!', code: 404 });

            touchedPost = { ...newPost, _id: createdPost._id, isNew: true };
            globalPosts++;
            
            return res.json({ status: 1, property: newPost });
        });
    } catch(e) {
        return res.json({ status: 0, message: 'Error creating new post!'});
    }
});

// ====================== DELETE A POST ======================
router.delete('/:id', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST ID ======================
        const { id } = req.params;
        if(!id) return res.json({ status: 0, message: 'Missing id!', code: 404 });

        // ====================== GET THE POST IMGS ======================
        const post = await Post.findById({ _id: id }).select('imgs authorId');
        if(!post) return res.json({ status: 0, message: 'Post does not exists!', code: 404 });

        // ====================== CHECK IF IT IS THE RIGHT USER ======================
        if(post._doc.authorId !== req.user._id) return res.json({ status: 0, message: 'Unauthorized!', code: 404 });

        // ====================== DELETE IMAGES FROM AWS ======================
        const awsRes = await removeImages(post._doc.imgs);
        if(awsRes.status === 0) return awsRes;

        // ====================== DELETE POST ======================
        const dbRes = await Post.findOneAndRemove({ _id: id }, { useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Post does not exist!'});

        touchedPost = { deletedPostId: id };
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Post deleted successfully!'});

    } catch (err) {
        return res.json({ status: 0, message: 'Error deleting post!'});
    }
});

// ====================== LIKE A POST ======================
router.patch('/:id/:type/like', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST ID AND USER ID ======================
        const { id, type } = req.params;
        const { _id: user_id } = req.user;
        if(!id || !user_id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== LIKE POST ======================
        const dbRes = type == 1 ? await Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: user_id  } }, { upsert: true, useFindAndModify: false })
        : await Post.findOneAndUpdate({ _id: id }, { $pull: { likes: { $gte: user_id } } }, { upsert: true, useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Post does not exist!'});

        const filteredLikes = dbRes._doc.likes.filter(like => like !== user_id);

        touchedPost = type == 1 ? { ...dbRes._doc, likes: [ ...dbRes._doc.likes, user_id ] } : { ...dbRes._doc, likes: filteredLikes };
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Like added successfully!'});

    } catch (err) {
        return res.json({ status: 0, message: 'Error liking post!'});
    }
});

// ====================== EDIT A POST ======================
router.patch('/:id', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST ID ======================
        const { id } = req.params;
        if(!id) return res.json({ status: 0, message: 'Missing id!', code: 404 });

        // ====================== GET THE POST AUTHOR ID ======================
        const post = await Post.findById({ _id: id }).select('authorId');
        if(!post) return res.json({ status: 0, message: 'Post does not exists!', code: 404 });

        // ====================== CHECK IF IT IS THE RIGHT USER ======================
        if(post._doc.authorId !== req.user._id) return res.json({ status: 0, message: 'Unauthorized!', code: 404 });

        // ====================== EDIT POST ======================
        const dbRes = await Post.findOneAndUpdate({ _id: id }, { text: req.body.text }, { upsert: true, useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Post does not exist!'});

        touchedPost = { ...dbRes._doc, text: req.body.text };
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Post edited successfully!'});

    } catch (err) {
        return res.json({ status: 0, message: 'Error editing post!'});
    }
});

// ====================== ADD COMMENT TO A POST ======================
router.patch('/:id/comment', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST ID AND USER ID ======================
        const { id } = req.params;
        const { _id: user_id } = req.user;
        if(!id || !user_id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== HANDLE INITIAL CHECK ======================
        const initialCheckRes = handleInitialFormCheck(req.body, 'addPost', 2);
        if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

        // ====================== EXTRACT FORM ELEMENTS ======================
        const [ { val: author }, { val: text } ] = [ ...req.body ];

        const newComment = { _id: new ObjectId(), author, text, authorId: user_id, edited: false, date: new Date(), likes: [] };

        // ====================== COMMENT POST ======================
        const dbRes = await Post.findOneAndUpdate({ _id: id }, { $addToSet: { comments: newComment } }, { upsert: true, useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Post does not exist!'});

        touchedPost = { ...dbRes._doc, comments: [ ...dbRes._doc.comments, newComment ] };
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Like added successfully!'});

    } catch (err) {
        console.log(err);
        return res.json({ status: 0, message: 'Error commenting post!'});
    }
});

// ====================== EDIT A COMMENT ======================
router.patch('/:id/comment/:comment_id', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST AND COMMENT ID ======================
        const { id, comment_id } = req.params;
        if(!id || !comment_id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== GET THE COMMENT AUTHOR ID ======================
        const commDB = await Post.findOne({ _id: id }).select({ comments: { $elemMatch: { _id: ObjectId(comment_id) } }});
        if(!commDB) return res.json({ status: 0, message: 'Post does not exists!', code: 404 });

        // ====================== CHECK IF IT IS THE RIGHT USER ======================
        if(commDB.comments[0].authorId !== req.user._id) return res.json({ status: 0, message: 'Unauthorized!', code: 404 });

        // ====================== EDIT COMMENT ======================
        const dbRes = await Post.findOneAndUpdate({ _id: id, comments: { $elemMatch: { _id: ObjectId(comment_id) }}},
            { $set: { 'comments.$.text': req.body.text } }, 
            { upsert: true, useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Comment does not exist!'});

        const updatedPost = { ...dbRes._doc };
        const updatedComm = updatedPost.comments.findIndex(comm => comm._id.toString() === comment_id.toString());
        updatedPost.comments[updatedComm].text = req.body.text;

        touchedPost = updatedPost;
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Comment edited successfully!'});

    } catch (err) {
        return res.json({ status: 0, message: 'Error editing comment!'});
    }
});

// ====================== DELETE A COMMENT ======================
router.patch('/:id/comment/:comment_id/delete', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE POST AND COMMENT ID ======================
        const { id, comment_id } = req.params;
        if(!id || !comment_id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== GET THE COMMENT AUTHOR ID ======================
        const commDB = await Post.findOne({ _id: id }).select({ comments: { $elemMatch: { _id: ObjectId(comment_id) } }});
        if(!commDB) return res.json({ status: 0, message: 'Post does not exists!', code: 404 });

        // ====================== CHECK IF IT IS THE RIGHT USER ======================
        if(commDB.comments[0].authorId !== req.user._id) return res.json({ status: 0, message: 'Unauthorized!', code: 404 });

        // ====================== DELETE COMMENT ======================
        const dbRes = await Post.findOneAndUpdate({ _id: id, comments: { $elemMatch: { _id: ObjectId(comment_id) }}},
            { $pull: { comments: { _id: ObjectId(comment_id) } } }, 
            { upsert: true, useFindAndModify: false });
        if(!dbRes) return res.json({ status: 0, message: 'Comment does not exist!'});

        const updatedPost = { ...dbRes._doc };
        const updatedComm = updatedPost.comments.findIndex(comm => comm._id.toString() === comment_id.toString());
        updatedPost.comments.splice(updatedComm, 1);

        touchedPost = updatedPost;
        globalPosts++;

        // ====================== SUCCESS ======================
        return res.json({ status: 1, message: 'Comment deleted successfully!'});

    } catch (err) {
        // console.log(err);
        return res.json({ status: 0, message: 'Error deleting comment!'});
    }
});

module.exports = router;
