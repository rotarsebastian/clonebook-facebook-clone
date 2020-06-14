<script>
    import ProfileImg from './../../../MiniComponents/ProfileImage.svelte';
    import { store } from './../../../../stores/store.js';
    import { goto } from '@sveltech/routify';

    const openChat = friend => {
        console.log('openChat');
    }

</script>

<!-- ######################################## -->

<div id="messagesDrop" class="animated fast fadeIn" on:click={e => e.stopPropagation()}>
    <div class="itemsContainer">
        <div class="items">

            <div class="item" on:click={() => openChat('friend')}>
                <ProfileImg size={2} />
                <div class="profile">
                    <div class="name">{$store.user.first_name}</div>
                    <!-- Cut message before -->
                    <div class="info">Hello! Can I...</div> 
                </div>
            </div>

            <div class="item" on:click={() => openChat('friend')}>
                <ProfileImg size={2} />
                <div class="profile">
                    <div class="name">{$store.user.first_name}</div>
                    <!-- Cut message before -->
                    <div class="info">Hello! Can I...</div> 
                </div>
            </div>

        </div>
    </div>
</div>

<!-- ######################################## -->

<style>
    #messagesDrop .itemsContainer .profile {
        display: flex;
        flex-direction: column;
        padding-left: .5rem;
        line-height: 20px;
    }

    #messagesDrop .itemsContainer .profile {
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

    #messagesDrop .itemsContainer .profile .info {
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

    #messagesDrop .itemsContainer .items .item:last-of-type {
        margin-bottom: 0;
    }

    #messagesDrop .itemsContainer .items .item:hover {
        background: #eee;
        cursor: pointer;
    } 
</style>