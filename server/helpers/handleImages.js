const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { uuid } = require('uuidv4');

// ====================== CONFIG AWS ======================
aws.config.update({
    secretAccessKey: process.env.SECRET_AWS,
    accessKeyId: process.env.ACCESS_AWS,
    region: 'eu-north-1'
});

const s3 = new aws.S3();

// ====================== FILTER IMAGE TYPES ======================
const fileFilter = (req, file, cb) => {
    if (file.mimetype.toLowerCase() === 'image/jpeg' || 
        file.mimetype.toLowerCase() === 'image/png' || 
        file.mimetype.toLowerCase() === 'image/svg+xml' || 
        file.mimetype.toLowerCase() === 'image/jpg') {
        return cb(null, true);
    } else {
        return cb(new Error('Invalid file type, only JPEG, JPG and PNG is allowed!'), false);
    }
}
 
// ====================== UPLOAD POSTS IMAGES ======================
const upload = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'clonebook',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_METADATA' });
        },
        key: function (req, file, cb) {
            cb(null, `posts/${uuid()}.jpeg`)
        }
    })
});

// ====================== UPLOAD PROFILE IMAGES ======================
const uploadProfile = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'clonebook',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_METADATA' });
        },
        key: function (req, file, cb) {
            cb(null, `profiles/${uuid()}.jpeg`)
        }
    })
});

// ====================== REMOVE S3 IMAGES ======================
const removeImages = async(removedImages, from) => {
    if(removedImages && removedImages.length === 0) return { status: 1, message: 'No images to remove!' };
    
    try {
        const imgsToRemove = [];
        
        removedImages.forEach(img => imgsToRemove.push({ Key: `${from}/${img.slice(-41)}` }));
    
        const s3Res = await s3.deleteObjects({
            Bucket: 'clonebook',
            Delete: {
                Objects: imgsToRemove
            }
        }).promise();

        if(s3Res && s3Res.Deleted && s3Res.Deleted.length > 0) return { status: 1, message: 'Images removed successfully!', deleted: s3Res.Deleted };
    } catch (error) {
        return { status: 0, message: 'S3 Error deleting images', error, code: 404 };
    }
} 

module.exports = { upload, uploadProfile, removeImages };