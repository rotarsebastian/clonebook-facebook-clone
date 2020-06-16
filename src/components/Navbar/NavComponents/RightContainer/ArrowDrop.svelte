<script>
    import ProfileImg from './../../../MiniComponents/ProfileImage.svelte';
    import { store } from './../../../../stores/store.js';
    import { goto } from '@sveltech/routify';
    import { logout } from './../../../../helpers/auth.js';

    const handleLogout = async() => {
        const response = await logout(localStorage.getItem('refreshToken'));
        if(response.status === 1) {
            localStorage.removeItem('refreshToken');
            $store = {
                chatUserStore: null,
                posts: [],
                isAuthenticated: false,
                user: {
                    friends: []
                }
            }
            $goto('../login');
        }
    }

</script>

<!-- ######################################## -->

<div id="dropdownCaret" class="animated fast fadeIn" on:click={e => e.stopPropagation()}>
    <div class="itemsContainer">
        <div class="items">
            <div class="item">
                <ProfileImg size={3.25} />
                <div class="profile">
                    <div class="name">{$store.user.first_name}</div>
                    <div class="info">See your profile</div>
                </div>
            </div>

            <div class="item" on:click={handleLogout}>
                <span class="icon"></span>
                <div class="logout">Log Out</div>
            </div>
        </div>
    </div>
</div>

<!-- ######################################## -->

<style>
    #dropdownCaret {
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

    #dropdownCaret .itemsContainer .item .icon {
        background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/Kll1Z6_BV-c.png');
        background-size: 21px 579px;
        background-repeat: no-repeat;
        display: inline-block;
        width: 20px;
        height: 20px;
        background-position: 0 -168px;
    }

    #dropdownCaret .itemsContainer .profile, .logout {
        display: flex;
        flex-direction: column;
        padding-left: .5rem;
        line-height: 20px;
    }

    #dropdownCaret .itemsContainer .profile, .logout {
        font-size: 15px;
        font-weight: 400;
    }

    #dropdownCaret .itemsContainer .profile .name {
        font-weight: 500;
        font-size: 17px;
    }

    #dropdownCaret .itemsContainer .profile .info {
        color: var(--grey);
        font-size: 15px;
    }


    #dropdownCaret .itemsContainer .items {
        padding: .5rem;
    }

    #dropdownCaret .itemsContainer .items .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transition: .3s;
        border-radius: 8px;
        padding: .5rem;
        position: relative;
        margin-bottom: .5rem;
    }

    #dropdownCaret .itemsContainer .items .item:last-of-type {
        padding: .5rem .75rem;
        margin-bottom: 0;
    }

    #dropdownCaret .itemsContainer .items .item:hover {
        background: #eee;
        cursor: pointer;
    } 
</style>