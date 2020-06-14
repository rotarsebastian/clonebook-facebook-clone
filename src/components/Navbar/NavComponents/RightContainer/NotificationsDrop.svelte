<script>
    import ProfileImg from './../../../MiniComponents/ProfileImage.svelte';
    import { store } from './../../../../stores/store.js';
    import { goto } from '@sveltech/routify';
    import { answerFriendReq, deleteNotification } from './../../../../helpers/notifications.js';

    const respondRequest = async(notification, answer) => {
        if(answer === 'yes') await answerFriendReq(notification, 1, $store.accessToken);
        else await answerFriendReq(notification, 0, $store.accessToken);
    }

    const handledeleteNotification = async(notification) => {
        const res = await deleteNotification(notification, $store.accessToken);
        console.log(res);
    }

    // console.log($store.notifications)
</script>

<!-- ######################################## -->

<div id="notifDrop" class="animated fast fadeIn" on:click={e => e.stopPropagation()}>
    <div class="itemsContainer">
        <div class="items">
            {#if $store.notifications.filter(notif => notif.type !== 'sentreq').length > 0}
                {#each $store.notifications as notification}
                    {#if notification.type !== 'sentreq'}
                        <div class="item">
                            {#if notification.type !== 'request'}
                                <span class="trash" on:click={() => handledeleteNotification(notification)}></span>
                            {/if}
                            <ProfileImg size={2} />
                            <div class="profile">
                                <div class="name">{notification.first_name} {notification.last_name}</div>
                                <div class="info">{notification.type === 'request' ? 'Friend request' : 'Accepted your friend request'}</div>
                                {#if notification.type === 'request'}
                                    <div class="buttons">
                                        <button on:click={() => respondRequest(notification, 'yes')}>Confirm</button>
                                        <button class="delete" on:click={() => respondRequest(notification, 'no')}>Delete</button>
                                    </div> 
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
                {:else}
                <div>No new notifications</div>
            {/if}

        </div>
    </div>
</div>

<!-- ######################################## -->

<style>
    .trash {
        position: absolute;
        top: .5rem;
        right: .5rem;
        width: 1.25rem;
        height: 1.25rem;
        transition: .3s;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml,%3Csvg height='427pt' viewBox='-40 0 427 427.00131' width='427pt' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0'/%3E%3Cpath d='m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0'/%3E%3Cpath d='m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0'/%3E%3Cpath d='m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0'/%3E%3C/svg%3E");
    }

    .trash:hover {
        filter: invert(33%) sepia(90%) saturate(3924%) hue-rotate(333deg) brightness(92%) contrast(104%);
    }

    #notifDrop .itemsContainer .profile {
        display: flex;
        flex-direction: column;
        padding-left: .5rem;
        line-height: 20px;
    }

    #notifDrop .itemsContainer .profile {
        font-size: 15px;
        font-weight: 400;
    }
    #notifDrop {
        opacity: 0;
        position: absolute;
        width: 130%;
        background: #fff;
        color: var(--black);
        top: 3.15rem;
        right: 0;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 12px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 0px inset;
        z-index: 2;
        border-radius: 8px;
        overflow: hidden;
    }

    #notifDrop .itemsContainer .profile .name {
        font-weight: 500;
        font-size: 18px;
    }

    #notifDrop .itemsContainer .profile .info {
        color: var(--grey);
        font-size: 14px;
        margin-top: .15rem;
    }

    #notifDrop .itemsContainer .items {
        padding: .5rem;
    }

    #notifDrop .itemsContainer .items .buttons {
        margin-top: .5rem;
    }

    #notifDrop .itemsContainer .items .buttons button.delete {
        background-color: rgb(228, 230, 235);
        color: var(--black);
        margin-left: .5rem;
    }

    #notifDrop .itemsContainer .items .buttons button:hover {
        filter: brightness(1.15);
    }

    #notifDrop .itemsContainer .items .buttons button.delete:hover {
        filter: brightness(.85);
    }

    #notifDrop .itemsContainer .items .buttons button {
        background-color:rgb(24, 119, 242);
        border-radius: 6px;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        line-height: 16.08px;
        padding: 6px 16px;
        user-select: none;
        outline: none;
    }

    #notifDrop .itemsContainer .items .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transition: .3s;
        border-radius: 8px;
        padding: .5rem;
        position: relative;
        margin-bottom: .5rem;
    }

    #notifDrop .itemsContainer .items .item:last-of-type {
        margin-bottom: 0;
    }

    #notifDrop .itemsContainer .items .item:hover {
        background: rgb(245, 245, 245);
        cursor: pointer;
    } 
</style>