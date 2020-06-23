<script>
    import Comment from './Comment.svelte';
    import EditDelete from './../MiniComponents/EditDelete.svelte';
    import ProfileImg from './../MiniComponents/ProfileImage.svelte';
    import { like } from '../../helpers/icons';
    import { getUsersByIDs } from '../../helpers/user';
    import Dialog from './../Modals/Dialog.svelte';
    import UsersList from './../Modals/UsersList.svelte';
    import { getContext } from 'svelte';
    import Slides from './../Modals/Slides.svelte';
    import { store } from './../../stores/store';
    import { goto } from '@sveltech/routify';
    import { editPost, likePost, addCommentToPost, removeComment } from './../../helpers/posts';
    import { validateForm } from './../../helpers/validation';
    import { showNotification } from './../../helpers/actionNotifications';
    import { parseDate } from './../../helpers/dateParser';

    const { open } = getContext('simple-modal');

    // ====================== PROPS ======================
    export let id;
    export let onDelete;
    export let propsPost = undefined;

    // ====================== DYNAMIC VARIABLES ======================
    let seeComments, commInput, showDropdown = false, editDelete;

    // ====================== REACTIVE ELEMENTS ======================
    $: post = propsPost ? propsPost : $store.posts.find(post => post._id === id);

    // ====================== LIKE A POST ======================
    const handleLike = async() => {
        // ====================== CHECK IF IT IS LIKE OR UNLIKE ======================
        const likeType = post.likes.indexOf($store.user._id) === -1 ? 1 : 0;

        likeType === 1 ? await likePost(post._id, 1, $store.accessToken) : await likePost(post._id, 0, $store.accessToken);
    }

    // ====================== ADD COMMENT TO A POST ======================
    const addComment = async(e) => {

        // ====================== VALIDATION ======================
        const commentData = [ 
            { type: 'author', val: `${$store.user.first_name} ${$store.user.last_name}` }, 
            { type: 'authorImg', val: $store.user.images.length > 0 ? $store.user.images[0] : null }, 
            { type: 'text', val: e.target.value }
        ];

        const isFormValid = validateForm(commentData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        // ====================== REQUEST ======================
        const result = await addCommentToPost(post._id, commentData, $store.accessToken);

        // ====================== RESPONSE ======================
        if(result.status === 1) {
            e.target.value = '';
            seeComments = true;
        }
    }

    // ====================== DELETE A COMMENT ======================
    const deleteComment = async(id) => {
        const result = await removeComment(post._id, id, $store.accessToken);

        if(result.status === 1) {
            return showNotification('success', 'Comment deleted successfully!');
        } else return showNotification('danger', 'Comment cannot be deleted!');
    }

    // ====================== EDIT POST ======================
    const onOkay = async(text) => {
        if(text) {

            // ====================== VALIDATION ======================
            const editPostData = [ { type: 'text', val: text } ];

            const isFormValid = validateForm(editPostData);
            if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

            // ====================== REQUEST ======================
            const result = await editPost(post._id, text, $store.accessToken);
            console.log(result);

            // ====================== RESPONSE ======================
            if(result.status === 1) return showNotification('success', 'Post edited successfully!');
            else return showNotification('danger', 'Post cannot be edited!');
        }

        // ====================== REDIRECT TO DELETE POST ======================
        else onDelete(post._id);
	}

    // ====================== SHOW EDIT / DELETE MODAL ======================
    const showDialog = dialogFor => {
        showDropdown = false;

        // ====================== CHECK IF IT IS DELETE OR EDIT POST ======================
        const dialogObj = dialogFor === 'delete' ? 
            {
                message: 'delete',
                elem: 'post',
                hasForm: false,
                text: 'Are you sure you want to delete this post?',
				onOkay,
            } 
            : 
            {
                value: post.text,
                elem: 'post',
                message: 'edit',
                hasForm: true,
				onOkay
            };
            
        // ====================== OPEN MODAL ======================
		open( Dialog, dialogObj,
			{
				closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
			}
	    );
    }
    
    // ====================== SHOW IMAGES FULL-SCREEN ======================
    const showFullscreenImgs = images => {
        open(
			Slides,
			{ images, page: 'posts' },
			{
				closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
                styleWindow: {
                    width: '90%'
                },
                styleBg: {
                    background: 'rgba(0, 0, 0, 0.7)',
                    top: 0,
                    left: 0
                }
			}
	    );
    }

    // ====================== OPEN MODAL WITH LIKES USER LIST ======================
    const getUsersWhichLiked = async() => {
        const result = await getUsersByIDs(post.likes, $store.accessToken);

        if(result.status === 1) {
            open(
                UsersList,
                { users: result.data },
                {
                    closeButton: true,
                    closeOnEsc: true,
                    closeOnOuterClick: true,
                }
            );
        }
    }

    // ====================== ADD NEW COMMENT ======================
    const handleClickComment = () => {
        seeComments = true;
        setTimeout(() => commInput.focus(), 100);
    }

    // ====================== HANDLE CLICK OUTSIDE ======================
    window.addEventListener('click', e => {
        if(e.target === editDelete) showDropdown = !showDropdown;
        else if(showDropdown === true) showDropdown = false;
    });

</script>

<!-- ######################################## -->
<div class="postContainer">

    <div class="topContainer">

        <!-- PROFILE IMAGE & NAME & POST DATE -->
        <ProfileImg size={2} img={post.authorImg} slideShowImgs={[ post.authorImg ]} />
        <div class="nameContainer">
            <div class="name" on:click={() => $goto('profile', { id: post.authorId })}>{post.author}</div>
            <div class="time">{parseDate(post.date)}</div>
        </div>

        <!-- EDIT / DELETE BUTTON -->
        {#if post.authorId === $store.user._id}
            <div>
                <img bind:this={editDelete} class="editDelete" src="https://static.xx.fbcdn.net/rsrc.php/v3/yn/r/oVV-iPd4q_P.png" alt="" height="16" width="16" />
            </div>
        {/if}

        <!-- EDIT / DELETE DROPDOWN -->
        {#if showDropdown}
            <div class="editPosition">
                <EditDelete showDialog={showDialog} />
            </div>
        {/if}
    </div>

    <!-- POST TEXT -->
    <div class="textContainer">
        {post.text}
    </div>

    <!-- POST IMAGES -->
    {#if post.hasOwnProperty('imgs')}
        <div class="postImgContainer">
            {#each post.imgs as img, index}
                {#if index < 2}
                    <div class:unique={index === 0 && !post.imgs[1]} class="postImg">
                        <img src={`https://clonebook.s3.eu-north-1.amazonaws.com/posts/${img}`} alt={'postImg'} on:click={() => showFullscreenImgs(post.imgs)} />
                        {#if index === 1 && post.imgs.length > 2}
                            <div class="moreImgs" on:click={() => showFullscreenImgs(post.imgs)}>+{post.imgs.length - 2}</div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}

    <!-- POST LIKES -->
    {#if post.likes && post.likes.length > 0}
        <div class="likes" on:click={getUsersWhichLiked}>
            <img height="18" src={like} width="18" alt="like-img" />
            <span class="likesNumber">{post.likes.length}</span>
        </div>
    {/if}

    <!-- POST LIKE & COMMENTS BUTTONS -->
    <div class="buttonsContainer">
        <div class="button" class:liked={post.likes && post.likes.indexOf($store.user._id) > -1 ? true : false} on:click={handleLike}>
            <img draggable="false" height="18" width="18" alt="likeIcon" src="https://static.xx.fbcdn.net/rsrc.php/v3/ym/r/HayyIjBF1VN.png" />
            Like
        </div>
        <div class="button comm" on:click={handleClickComment}>
            Comment
        </div>
    </div>

    <!-- VIEW / HIDE COMMENTS BUTTON -->
    {#if post.comments && post.comments.length > 0}
        <div class="viewComments" on:click={() => seeComments = !seeComments}>{seeComments ? 'Hide' : 'View'} comments</div>
    {/if}

    <!-- COMMENTS LIST -->
    {#if seeComments}
        {#each post.comments as comment}
            <Comment onDelete={deleteComment} comment={comment} postId={id} />
        {/each}
    {/if}

    <!-- ADD NEW COMMENT INPUT -->
    <div class="bottomContainer">
        <ProfileImg size={2} img={$store.user.images[0]} />
        <input 
            class="inputAddComment" 
            type="text" 
            placeholder="Write a comment..." 
            bind:this={commInput} 
            on:keyup={e => e.key === "Enter" ? addComment(e) : undefined } 
        />
    </div>

</div>
<!-- ######################################## -->

<style>
    .postImgContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: .65rem;
    }

    .postImg {
        display: inline-flex;
        width: calc(50% - 1px);
        position: relative;
    }

    .postImg.unique {
        display: inline-flex;
        width: 100%;
        position: relative;
    }

    .postImg:not(.unique):first-of-type {
        margin-right: 2px;
    }

    .postImg img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .postImg .moreImgs {
        cursor: pointer;
        user-select: none;
        color: #fff;
        font-size: 1.85rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

    }

    .editPosition {
        position: absolute;
        right: 0;
        top: 1.5rem;
        z-index: 10;
    }

    .postContainer {
        background: #fff;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 0 10px 0 #dcdcdc;
    }

    .topContainer {
        display: flex;
        padding: 0.9rem 0.4rem;
        margin: 0 .5rem;
        position: relative;
    }

    .nameContainer {
        margin-left: .5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .nameContainer .name {
        color: rgb(5, 5, 5);
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        overflow-wrap: break-word;
        word-break: break-word;
        transition: .3s;
    }

    .nameContainer .name:hover {
        text-decoration: underline;
    }

    .nameContainer .time {
        color: rgb(101, 103, 107);
        font-size: 13px;
        font-weight: 400;
    }

    .textContainer {
        padding: .5rem .4rem;
        margin: 0 .5rem;
        color: rgb(5, 5, 5);
        font-size: 15px;
    }

    .editDelete {
        cursor: pointer;
        position: absolute;
        right: .25rem;
        filter: invert(40%) sepia(44%) saturate(65%) hue-rotate(182deg) brightness(89%) contrast(87%);
    }

    .likes {
        padding: .5rem 0;
        margin: 0 .9rem;
        padding-bottom: 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        width: fit-content;
    }

    .likesNumber {
        color: rgb(101, 103, 107);
        font-size: 15px;
        cursor: pointer;
        margin-left: .2rem;
        user-select: none;
    }

    .buttonsContainer {
        display: flex;
        justify-content: space-between;
        padding: .25rem 0;
        margin: 0 .9rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .button {
        border-radius: 4px;
        transition: .3s;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 2rem;
        color: rgb(101, 103, 107);
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        user-select: none;
    }

    .button.liked img {
        filter: invert(38%) sepia(39%) saturate(6421%) hue-rotate(205deg) brightness(100%) contrast(92%);
    }

    .button:hover {
        background-color: rgb(240, 242, 245);
    }

    .button img {
        margin-right: 6px;
    }

    .button.comm::before {
        content: '';
        display: inline-block;
        height: 18px;
        margin: 0 6px -3px 0;
        min-width: 18px;
        position: relative;
        top: -2px;
        width: 18px;
        background-image: url("https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/cOvW0EWujLu.png");
        background-repeat: no-repeat;
        background-size: 708px 1818px;
        background-position: -323px -1369px;
    }

    .viewComments {
        color: rgb(101, 103, 107);
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        margin: .66rem .9rem;
    }

    .bottomContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .25rem 0;
        padding-bottom: .65rem;
        margin: 0 .9rem;
        margin-bottom: 0;
        margin-top: .4rem;
    }

    .inputAddComment {
        background-color: rgb(240, 242, 245);
        color: rgb(28, 30, 33);
        padding: 0.5rem .75rem;
        outline: none;
        border: none;
        font-size: 0.925rem;
        margin-left: .5rem;
    }
</style>