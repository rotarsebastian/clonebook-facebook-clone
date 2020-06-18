<script>
    export let user;
    import ProfileImg from './ProfileImage.svelte';

</script>

<!-- ######################################## -->

<ProfileImg size={2} img={user.image} slideShowImgs={[ user.image ]} />
<div class="profileName">{user.name}</div>

<!-- ######################################## -->

<style>
    .profileName {
        margin-left: .5rem;
        font-size: 15px;
        font-weight: 500;
        color: rgb(5, 5, 5);
    }
</style>