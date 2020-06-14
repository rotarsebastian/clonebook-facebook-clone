<script>
    import ProfileImg from './../MiniComponents/ProfileImage.svelte';
    import EditDelete from './../MiniComponents/EditDelete.svelte';
    import { getContext } from 'svelte';
    import Dialog from './../Modals/Dialog.svelte';
    import { like } from '../../helpers/icons.js';
    import { goto } from '@sveltech/routify';
    import moment from 'moment';
    import { store } from './../../stores/store.js';
    import { editComment } from './../../helpers/posts.js';
    import { getNotificationsContext } from 'svelte-notifications';
    import { validateForm } from './../../helpers/validation';

    const { addNotification } = getNotificationsContext();

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
    }

    export let comment;
    export let onDelete;

    const { open } = getContext('simple-modal');

    let liked = false, showEditDelete = false, showDropdown = false, editDelete;
    let likes = comment.likes.length;

    const handleLike = () => {
        liked = !liked;
        liked ? likes++ : likes--;
    }

    window.addEventListener('click', e => {
        if(e.target === editDelete) showDropdown = !showDropdown;
        else if(showDropdown === true) showDropdown = false;
    });
	
	const onOkay = async(text) => {
        if(text) {
            // ====================== VALIDATION ======================
            const editCommentData = [ { type: 'text', val: text } ];

            const isFormValid = validateForm(editCommentData);
            if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

            const postId = $store.posts.find(post => post.comments.findIndex(comm => comm._id === comment._id) > -1)._id;

            const result = await editComment(postId, text, comment._id, $store.accessToken);
            console.log(result);

            if(result.status === 1) {
                return showNotification('success', 'Comment edited successfully!');
            } 
        }
        else onDelete(comment._id);
	}

    const showDialog = dialogFor => {
        showDropdown = false;
        const dialogObj = dialogFor === 'delete' ? 
            {
                message: 'delete',
                elem: 'comment',
                hasForm: false,
                text: 'Are you sure you want to delete this comment?',
				onOkay
            } 
            : 
            {
                value: comment.text,
                elem: 'comment',
                message: 'edit',
                hasForm: true,
				onOkay
			};
		open(
			Dialog,
			dialogObj,
			{
				closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
			}
	  );
	};
    
</script>

<!-- ######################################## -->
    <div class="commentContainer" on:mouseleave={() => showEditDelete = false} on:mouseenter={() => showEditDelete = true}>
        <div class="profile"><ProfileImg size={2} /></div>
        <div>
            <div class="commLike">
                <div class="comment">
                    <div class="name" on:click={() => $goto('../profile', { id: comment.authorId })}>{comment.author}</div>
                    <div class="comm">{comment.text}</div>
                </div>
                
                {#if likes > 0}
                    <span class="likeIconbox">
                        <span class="likesList">
                            <img height="18" src={like} width="17" alt="like-img" />
                            <span>{likes}</span>
                        </span>
                    </span>
                {/if}

                {#if showEditDelete && comment.authorId === $store.user._id}
                    <img 
                        bind:this={editDelete} 
                        class:space={likes > 0} 
                        class="editDelete" 
                        src="https://static.xx.fbcdn.net/rsrc.php/v3/yn/r/oVV-iPd4q_P.png" 
                        alt="action" 
                        height="16" 
                        width="16"
                    />
                {/if}

                {#if showDropdown}
                    <div class="editPosition">
                        <EditDelete showDialog={showDialog} />
                    </div>
                {/if}
            </div>

            <div class="actions">
                <div class="like" on:click={handleLike} class:liked={liked === true}>Like</div>
                <span>&nbsp;·&nbsp;</span>
                <div class="timePassed">{moment(comment.date).format('HH:mm A')}</div>
                {#if comment.edited === 1}
                    <span>&nbsp;·&nbsp;</span>
                    <div class="timePassed">Edited</div>
                {/if}
            </div>

        </div>
    </div>

<!-- ######################################## -->

<style>
    .editPosition {
        position: absolute;
        bottom: -4.75rem;
        z-index:10;
        left: .5rem;
    }

    .editDelete {
        margin: auto;
        margin-left: .75rem;
        cursor: pointer;
    }

    .editDelete.space {
        margin-left: 2.75rem;
    }

    .commLike {
        display: flex;
        position: relative;
    }

    .likeIconbox {
        position: relative;
        bottom: 0;
    }

    .profile {
        display: flex;
        margin-top: 8px;
    }

    .commentContainer {
        display: flex;
        margin: .5rem .9rem;
        margin-top: 0;
    }

    .comment {
        margin-left: .5rem;
        background-color: rgb(240, 242, 245);
        border-radius: 18px;
        padding: 8px 12px;
        font-size: 13px;
    }

    .commentContainer .comment .name {
        color: rgb(5, 5, 5);
        cursor: pointer;
        font-weight: 600;
        overflow-wrap: break-word;
        word-break: break-word;
        transition: .3s;
    }

    .commentContainer .comment .name:hover {
        text-decoration: underline;
    }

    .commentContainer .comment .comm {
        font-size: 15px;
        color:rgb(5, 5, 5);
        direction: ltr;
        line-height: 19.9995px;
        overflow-wrap: break-word;
        text-align: start;
        unicode-bidi: isolate;
        white-space: normal;
        word-break: break-word;
        padding-top: .15rem;
    }

    .actions {
        display: flex;
        color: #65676B;
        font-size: 12px;
        margin: .2rem 0;
        margin-left: .5rem;
        padding: 0 12px;
    }

    .actions .like {
        font-weight: 600;
        cursor: pointer;
        user-select: none;
    }

    .actions .like:hover {
        text-decoration: underline;
    }

    .like.liked {
        color: #2078f4;
    }

    .likesList {
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 20px;
        position: absolute;
        bottom: .4rem;
        left: -.6rem;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px;
        padding: .15rem;
    }

    .likesList span {
        color: #65676b;
        font-size: 13px;
        margin-left: .25rem;
    }

</style>