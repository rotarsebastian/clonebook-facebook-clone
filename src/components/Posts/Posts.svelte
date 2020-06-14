<script>
    import CreatePost from './CreatePost.svelte';
    import Post from './Post.svelte';
    import { store } from './../../stores/store.js';
    import { addPost, removePost } from './../../helpers/posts.js';
    import { validateForm } from './../../helpers/validation';
    import { getNotificationsContext } from 'svelte-notifications';

    const { addNotification } = getNotificationsContext();

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
    }
    
    const deletePost = async(id) => {
        const result = await removePost(id, $store.accessToken);
        if(result.status === 1) {
            return showNotification('success', 'Post deleted successfully!');
        } 
    }

    const createPost = async(text, files) => {

        // ====================== VALIDATION ======================
        const newPostData = [ 
            { type: 'author', val: `${$store.user.first_name} ${$store.user.last_name}` }, 
            { type: 'text', val: text }
        ];

        const isFormValid = validateForm(newPostData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        const requestData = new FormData();

        requestData.append('data', JSON.stringify(newPostData));

        files.map(file => requestData.append('image', file, file.name));

        const res = await addPost(requestData, $store.accessToken);

        // ====================== RESPONSE ======================
        if(res.status === 1) {
            // $store.posts = [ res.property, ...$store.posts ];
            return showNotification('success', 'Post created successfully!');
        } 
    }

</script>

<!-- ######################################## -->

{#if $store.posts.length === 0}
    <div>waiting...</div>
{/if}

{#if $store.posts.length > 0}
    <div class="postsContainer">
        <CreatePost createPost={createPost} />
        <div class="posts">
            {#each $store.posts as post}
                <Post onDelete={deletePost} id={post._id} />
            {/each}
        </div>
    </div>
{/if}

<!-- ######################################## -->

<style>
    .postsContainer {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 50rem;
        padding: 0 1.5rem;
    }

    .posts {
        margin-top: 1.5rem;
    }
</style>