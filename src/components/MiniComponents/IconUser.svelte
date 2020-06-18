<script>
    export let user;
    import ProfileImg from './ProfileImage.svelte';

    console.log(user);
</script>

<!-- ######################################## -->

<ProfileImg size={2}  />
<div class="profileName">{user.first_name} {user.last_name}</div>

<!-- ######################################## -->

<style>
    .profileName {
        margin-left: .5rem;
        font-size: 15px;
        font-weight: 500;
        color: rgb(5, 5, 5);
    }
</style>