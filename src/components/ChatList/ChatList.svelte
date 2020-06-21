<script>    
    import IconUser from '../MiniComponents/IconUser.svelte';
    import { store } from '../../stores/store.js';
    import { parseDate } from './../../helpers/dateParser';
    import { onDestroy } from 'svelte';

	onDestroy(() => {
        if(eventSource) eventSource.close();
    });

    const changeChatContainer = contact => {
        $store.chatUserStore = null;
        setTimeout(() => $store.chatUserStore = contact, 100);
    }

    let eventSource;

    // ====================== SUBSCRIBE TO NOTIFICATIONS ======================
    const subscribeStatuses = async() => {
        eventSource = new EventSource('http://localhost:9999/api/statuses/subscribe');
        
		eventSource.addEventListener('message', e => {
			try {
                const statuses = JSON.parse(e.data.split('||')[0]);
                const disconnectedUsersTimes = JSON.parse(e.data.split('||')[1]);

                let disconectedUsers = [];

                $store.user.friends.map(friend => {
                    const disconUser = disconnectedUsersTimes.find(disconUser => disconUser.id === friend.friend_id);
                    if(disconUser) disconectedUsers.push(disconUser);
                });

                $store.disconnectedUsersTimes = disconectedUsers;

                $store.onlineFriends = $store.user.friends.filter(friend => 
                    statuses.findIndex(friendId => friend.friend_id === friendId) > -1).map(el => el.friend_id);

			} catch (err) {
				if(err) return console.log('ERROR', err);
			}
		});
    }
    
    subscribeStatuses();
     
</script>

<!-- ######################################## -->
{#if $store.user.hasOwnProperty('friends') && $store.user.friends.length >= 0}
    <div id="activeChatList">
        <div id="title">Contacts</div>
        {#each $store.user.friends as contact}
            <div class="activeUser" on:click={() => changeChatContainer(contact)} >
                <IconUser user={contact} />
                {#if $store.onlineFriends.findIndex(user => user === contact.friend_id) > -1}
                    <span class="online"></span>
                    {:else if $store.disconnectedUsersTimes.findIndex(user => user.id === contact.friend_id) > -1}
                    <span class="signOutTime">{parseDate($store.disconnectedUsersTimes.find(user => user.id === contact.friend_id).time, 'chat')}</span>
                {/if}
            </div>
        {/each}
    </div>
{/if}

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
    #activeChatList .activeUser .online {
        position: absolute;
        right: .75rem;
        font-size: 13px;
        width: 9px;
        height: 9px;
        background-color: #31A24C;
        border-radius: 50%;
    }
       
</style>