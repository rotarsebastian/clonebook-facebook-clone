<script>
    import ProfileImg from './../MiniComponents/ProfileImage.svelte';
    import Dialog from './../Modals/Dialog.svelte';
    import { getContext } from 'svelte';
    import { store } from './../../stores/store.js';

    const { open } = getContext('simple-modal');

    // ====================== PROPS ======================
    export let createPost;

    // ====================== REDIRECT TO CREATE POST ======================
    const onOkay = (text, files) => createPost(text, files);

    // ====================== OPEN CREATE POST MODAL ======================
    const showDialog = () => {
		open(
			Dialog,
			{
                elem: 'post',
                message: 'create',
                hasForm: true,
                onOkay
            },
			{
				closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
			}
        );
	};
</script>

<!-- ######################################## -->
<div class="createPost">

    <!-- PROFILE IMAGE & INPUT -->
    <div class="topContainer">
        <ProfileImg size={2.5} img={$store.user.images[0]}  />
        <input 
            class="inputNewPost" 
            type="text" 
            placeholder="What's on your mind, {$store.user.first_name}?"
            on:click={showDialog}
        />
    </div>

    <!-- BOTTOM CONTAINER - PHOTO - TAG - FEELING -->
    <div class="bottomContainer">

        <div class="photo button">
            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/7v6BHTdGI6G.png" alt="photoimg" height="20" width="20" />
            Photo/Video
        </div>

        <div class="tag button">
            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/cb8bAKR-VRO.png" alt="phototag" height="20" width="20">
            Tag Friends
        </div>

        <div class="feeling button">
            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/33sb32JAgNq.png" alt="photolucky" height="20" width="20">
            Feeling/Activity
        </div>
        
    </div>

</div>

<!-- ######################################## -->
<style>
    .createPost {
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 0 10px 0 #dcdcdc;
    }

    .topContainer {
        border-bottom: 1px solid var(--thin-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .7rem 0;
        margin: 0 .7rem;
    }

    .inputNewPost {
        background-color: var(--light-grey);
        padding: 0 1rem;
        padding-top: .4rem;
        padding-bottom: .5rem;
        height: 2.5rem;
        outline: none;
        border: none;
        font-size: 0.925rem;
        margin-left: .5rem;
        cursor: pointer;
    }

    .bottomContainer {
        display: flex;
        justify-content: space-evenly;
        padding: 0 .7rem;
        margin: .55rem 0;
    }

    .button {
        border-radius: 8px;
        transition: .3s;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 33%;
        height: 2.5rem;
        color: var(--grey);
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
    }

    .button img {
        margin-right: .4rem;
    }

    .button:hover {
        background-color: var(--light-grey);
    }
</style>