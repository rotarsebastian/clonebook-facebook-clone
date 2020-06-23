<script>
    export let user;
    export let click = undefined;
    import ProfileImg from './ProfileImage.svelte';
    import { goto } from '@sveltech/routify';
    
    const handleClick = () => {
        if(click) $goto(`profile?id=${user.friend_id}`);
    }

</script>

<!-- ######################################## -->

<ProfileImg size={2} img={user.image} slideShowImgs={[ user.image ]} />
<div class="profileName" class:hoverable={click} on:click={handleClick}>{user.name}</div>

<!-- ######################################## -->

<style>
    .profileName {
        margin-left: .5rem;
        font-size: 15px;
        font-weight: 500;
        color: rgb(5, 5, 5);
        transition: .3s;
    }

    .profileName.hoverable:hover {
        text-decoration: underline;
    }
</style>