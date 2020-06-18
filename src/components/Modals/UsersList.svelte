<script>  
    import { getContext } from 'svelte';
    import IconUser from './../MiniComponents/IconUser.svelte';
    import { goto } from '@sveltech/routify';

    const { close } = getContext('simple-modal');
		
	const _onCancel = () => close();

    export let users;

</script>

<!-- ######################################## -->

<div id="likesList">
    <div id="title">Likes</div>
    {#each users as user}
        <div class="userItem" on:click={() => $goto(`/profile?id=${user._id}`)}>
            <IconUser user={{ name: `${user.first_name} ${user.last_name}`, image: user.images[0] }} />
        </div>
    {/each}
</div>

<!-- ######################################## -->

<style>
    #likesList {
        margin: .5rem;
        height: calc(100% - 3.75rem - 0.2rem);
    }

    #likesList #title {
        color: rgb(101, 103, 107);
        font-weight: 600;
        font-size: 14px;
        padding: 1rem .7rem;
    }

    #likesList .userItem {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 2rem;
        transition: .3s;
        border-radius: 10px;
        padding: 1.5rem .5rem;
        cursor: pointer;
        position: relative;
    }

    #likesList .userItem:hover {
        background: rgb(218, 218, 218);
    }

       
</style>