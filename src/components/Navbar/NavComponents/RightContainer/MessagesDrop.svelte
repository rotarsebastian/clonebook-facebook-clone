<script>
    import ProfileImg from './../../../MiniComponents/ProfileImage.svelte';
    import { store } from './../../../../stores/store.js';
    import { goto } from '@sveltech/routify';

    // ====================== PROPS ======================
    export let hideDrop = undefined;

    // ====================== OPEN USER CHAT ======================
    const openChat = id => {
        const friend = $store.user.friends.find(friend => friend.friend_id === id);
        if(friend) {
            $store.chatUserStore = null;
            setTimeout(() => $store.chatUserStore = friend, 100);
            hideDrop('messagesDrop');
        }
    }

</script>

<!-- ######################################## -->
<div id="messagesDrop" class="animated fast fadeIn" on:click={e => e.stopPropagation()}>
    <div class="itemsContainer">
        <div class="items">

            {#if $store.user.messages.length === 0}
                <div>No new messages</div>
                
                {:else}
                    {#each $store.user.messages as message}
                        <div class="item" on:click={() => openChat(message.from)} class:notSeen={!message.seen}>
                            <ProfileImg size={2.25} img={message.from_user_image} slideShowImgs={[ message.from_user_image ]} />

                            <!-- USER NAME AND LAST MESSAGE -->
                            <div class="profile">
                                <div class="data">
                                    <div class="name">{message.from_user_first_name}</div>
                                    <div class="text">{message.text.length > 20 ? `${message.text.slice(0, 20)}...` : message.text}</div> 
                                </div>
                                {#if !message.seen}
                                    <span></span>
                                {/if}
                            </div>

                        </div>
                    {/each}
            {/if}

        </div>
    </div>
</div>

<!-- ######################################## -->
<style>
    #messagesDrop .itemsContainer .profile .data {
        display: flex;
        flex-direction: column;
    }
    #messagesDrop .itemsContainer .profile span {
        background-color: var(--blue);
        width: 9px;
        height: 9px;
        border-radius: 50%;
    }
    #messagesDrop .itemsContainer .profile {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        padding-left: .5rem;
        line-height: 20px;
        font-size: 15px;
        font-weight: 400;
    }

    #messagesDrop {
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

    #messagesDrop .itemsContainer .profile .name {
        font-weight: 500;
        font-size: 17px;
    }

    #messagesDrop .itemsContainer .profile .text {
        color: var(--grey);
        font-size: 15px;
    }

    #messagesDrop .itemsContainer .items {
        padding: .5rem;
    }

    #messagesDrop .itemsContainer .items .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transition: .3s;
        border-radius: 8px;
        padding: .5rem;
        position: relative;
        margin-bottom: .5rem;
    }

    #messagesDrop .itemsContainer .items .item.notSeen .profile .text {
        color: var(--blue);
    }

    #messagesDrop .itemsContainer .items .item:last-of-type {
        margin-bottom: 0;
    }

    #messagesDrop .itemsContainer .items .item:hover {
        background: #eee;
        cursor: pointer;
    } 
</style>