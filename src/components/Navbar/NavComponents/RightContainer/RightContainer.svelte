<script>
    import ProfileImg from './../../../MiniComponents/ProfileImage.svelte';
    import IconUser from '../../../MiniComponents/IconUser.svelte';
    import { store } from './../../../../stores/store.js';
    import { goto } from '@sveltech/routify';
    import ArrowDrop from './ArrowDrop.svelte';
    import MessagesDrop from './MessagesDrop.svelte';
    import NotificationsDrop from './NotificationsDrop.svelte';
    import { getUserNotifications } from './../../../../helpers/notifications.js';

    const iconsContainer = ['create minimize', 'messages', 'notifications', 'dropdown minimize'];

    let dropdowns = { showArrowDrop: false, showMessagesDrop: false, showNotifDrop: false, showCreateDrop: false };

	const getUserNotif = () => {
        setTimeout(async() => {
            const result = await getUserNotifications($store.accessToken, 0);
            $store.notifications = result.data.requests;
    
            subscribeNotif();
        }, 200);
    }
    
    const subscribeNotif = async() => {
		const eventSource = new EventSource('http://localhost:9999/api/notifications/subscribe');
		eventSource.addEventListener('message', e => {
			try {
				if(e.data !== '0') { 
                    const updatedNotif = JSON.parse(e.data);
                    if(updatedNotif.type === 'sentreq') return;
                    // ====================== CHECK IF REQUEST MATCHES THE FOR ======================
                    if(updatedNotif.to === $store.user._id) { 
                        if(updatedNotif.hasOwnProperty('isNew')) {
                            delete updatedNotif.isNew;
                            if($store.notifications.findIndex(notif => notif._id === updatedNotif._id) === -1) {
                                $store.notifications = [ updatedNotif, ...$store.notifications ];
                                if(updatedNotif.type === 'accept') {
                                    const newFriend = { 
                                        first_name: updatedNotif.first_name,  
                                        last_name: updatedNotif.last_name,  
                                        images: updatedNotif.images,  
                                        friend_id: updatedNotif.from
                                    };
                                    $store.user.friends = [ ...$store.user.friends, newFriend ]
                                }
                            } 
                        } 
                    } else if(updatedNotif.hasOwnProperty('deletedNotifId')) {
                        const filteredNotif = $store.notifications.filter(notif => notif._id !== updatedNotif.deletedNotifId);
                        $store.notifications = filteredNotif;
                        if(updatedNotif.hasOwnProperty('from')) {
                            const foundSentReq = $store.notifications.find(notif => notif.to === updatedNotif.from && notif.type === 'sentreq');
                            const filteredNotifs = $store.notifications.filter(notif => notif !== foundSentReq);
                            $store.notifications = filteredNotifs;
                        }
                    }
				}
			} catch (err) {
				if(err) return console.log('ERROR', err);
			}
		});
	}

    getUserNotif();


    const handleOpenMenu = (e, menu) => {
        e.stopPropagation();

        if(menu === 'dropdown minimize') {
            dropdowns.showArrowDrop = !dropdowns.showArrowDrop;
            closeOtherDropdowns('showArrowDrop');
        }
        else if(menu === 'messages') {
            dropdowns.showMessagesDrop = !dropdowns.showMessagesDrop;
            closeOtherDropdowns('showMessagesDrop');
        }
        else if(menu === 'notifications') {
            dropdowns.showNotifDrop = !dropdowns.showNotifDrop;
            closeOtherDropdowns('showNotifDrop');
        }
        else if(menu === 'create minimize') {
            dropdowns.showCreateDrop = !dropdowns.showCreateDrop;
            closeOtherDropdowns('showCreateDrop');
        }
    }

    const closeOtherDropdowns = exception => {
        for (let dropdown in dropdowns) {
            if (Object.prototype.hasOwnProperty.call(dropdowns, dropdown)) {
                if(dropdown !== exception) dropdowns[dropdown] = false;
            }
        }
    }

    window.addEventListener('click', () => {
        if(dropdowns.showArrowDrop === true) dropdowns.showArrowDrop = false;
        else if(dropdowns.showMessagesDrop === true) dropdowns.showMessagesDrop = false;
        else if(dropdowns.showNotifDrop === true) dropdowns.showNotifDrop = false;
        else if(dropdowns.showCreateDrop === true) dropdowns.showCreateDrop = false;
    });
</script>

<!-- ######################################## -->

<div class="rightContainer">
    <div class="profileContainer">
        <ProfileImg size={1.75} />
        <div class="profileName">Sebastian</div>
    </div>
    <div class="iconsContainer">
        {#each iconsContainer as elem}
            {#if !elem.includes(' ')}
                <div class="iconWholeContainer" on:click={e => handleOpenMenu(e, elem)}>
                    <span class="iconAreaContainer">
                        <span class={"iconSVG " + elem}></span>
                        {#if $store.notifications && $store.notifications.filter(notif => notif.type !== 'sentreq').length > 0 && elem === 'notifications'}
                            <span class="notificationsCount">{$store.notifications.filter(notif => notif.type !== 'sentreq').length}</span>
                            {:else if $store.messages && $store.messages.length > 0 && elem === 'messages'}
                            <span class="notificationsCount">{$store.messages.length}</span>
                        {/if}
                    </span>
                </div>
                {:else}
                <div class="iconWholeContainer" on:click={e => handleOpenMenu(e, elem)}>
                    <span class={"iconSVG " + elem}></span>
                </div>
            {/if}
        {/each}

        {#if dropdowns.showArrowDrop}
            <ArrowDrop />
            {:else if dropdowns.showMessagesDrop}
            <MessagesDrop />
            {:else if dropdowns.showNotifDrop}
            <NotificationsDrop />
        {/if}
    </div>
</div>

<!-- ######################################## -->

<style>
    .iconAreaContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
    }

    .iconAreaContainer .notificationsCount {
        position: absolute;
        background: rgb(240, 40, 73);
        width: 19px;
        height: 19px;
        color: #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .8rem;
        top: -1rem;
        right: -1rem;
    }

    .rightContainer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 20rem;
    }

    .rightContainer .profileContainer {
        display: flex;
        height: 2rem;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 1.1rem .3rem;
        padding-right: .55rem;
        border-radius: 20px;
    }

    .rightContainer .profileContainer:hover {
        background: #eee;
    }

    .rightContainer .profileContainer .profileName {
        margin-left: .4rem;
        font-size: .95rem;
        color: rgb(5, 5, 5);
        direction: ltr;
        max-width: 100%;
        overflow-wrap: break-word;
        overflow-x: hidden;
        overflow-y: hidden;
        text-align: start;
        text-overflow: ellipsis;
        unicode-bidi: isolate;
        user-select: none;
        white-space: nowrap;
        word-break: break-word;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        font-weight: 600;
    }

    .rightContainer .iconsContainer {
        display: flex;
        margin-left: .5rem;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .rightContainer .iconsContainer .iconWholeContainer {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        background: #eee;
        margin-right: 10px;
        border-radius: 50%;
        transition: .4s;
    }

    .rightContainer .iconsContainer .iconWholeContainer:last-of-type {
        margin-right: 0;
    }

    .rightContainer .iconsContainer .iconWholeContainer:hover {
        background: #d2d2d2;
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG {
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG.minimize {
        width: 14px;
        height: 14px;
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG.create {
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216 v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG.messages {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28' alt='' class='a8c37x1j ms05siws hwsy1cff b7h9ocf4 fzdkajry' height='20' width='20'%3E%3Cpath d='M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z'%3E%3C/path%3E%3C/svg%3E");
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG.notifications {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28' alt='' class='a8c37x1j ms05siws hwsy1cff b7h9ocf4 fzdkajry' height='20' width='20'%3E%3Cpath d='M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z'%3E%3C/path%3E%3C/svg%3E");
    }

    .rightContainer .iconsContainer .iconWholeContainer .iconSVG.dropdown {
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='292.362px' height='292.362px' viewBox='0 0 292.362 292.362' style='enable-background:new 0 0 292.362 292.362;' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424 C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428 s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z'/%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");    
    }

    @media only screen and (max-width: 1260px) {
        .rightContainer .profileContainer {
            display: none;
        }
    }

</style>