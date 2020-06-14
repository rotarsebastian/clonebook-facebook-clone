<script>    
    import IconUser from '../MiniComponents/IconUser.svelte';
    import { store } from '../../stores/store.js';

    let contacts = [
        {id: 1, firstName: 'Sebi', surname: 'Andrew'}, 
        {id: 2, firstName: 'Sebi2', surname: 'Mike', signOutTime: '35min' }, 
        {id: 3, firstName: 'Sebi3', surname: 'Thomas'}, 
        {id: 4, firstName: 'Sebi4', surname: 'Andrew', signOutTime: '1h' }, 
        {id: 5, firstName: 'Sebi5', surname: 'Andrew'}
    ];
    
</script>

<!-- ######################################## -->

<div id="activeChatList">
    <div id="title">Contacts</div>
    {#each contacts as contact}
        <div class="activeUser" on:click={() => $store.chatUserStore = contact} >
            <IconUser user={contact} />
            {#if contact.hasOwnProperty('signOutTime')}
                <span class="signOutTime">{contact.signOutTime}</span>
            {/if}
        </div>
    {/each}
</div>

<!-- ######################################## -->

<style>
    #activeChatList {
        width: 20rem;
        margin: .1rem;
        height: calc(100% - 3.75rem - 0.2rem);
    }

    #activeChatList #title {
        color: rgb(101, 103, 107);
        font-weight: 600;
        font-size: 14px;
        padding: 1rem .7rem;
        padding-bottom: .5rem;
    }

    #activeChatList .activeUser {
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

    #activeChatList .activeUser:hover {
        background: rgb(218, 218, 218);
    }

    #activeChatList .activeUser .signOutTime {
        position: absolute;
        right: .75rem;
        font-size: 13px;
    }
       
</style>