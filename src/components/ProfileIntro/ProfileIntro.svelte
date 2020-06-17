<script>
    import moment from 'moment';
    import { store } from './../../stores/store.js';
    import { getNotificationsContext } from 'svelte-notifications';
    import { sendFriendRequest } from './../../helpers/notifications';
    import { deleteFriend } from './../../helpers/auth';
    import { goto } from '@sveltech/routify';
    
    export let user_profile;
	
    const { addNotification } = getNotificationsContext();

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
    }

    const handleFriendRequest = async() => {
		const response = await sendFriendRequest(user_profile._id, $store.accessToken);
		if(response.status !== 1) console.log(response);
		else {
			$store.notifications = [ ...$store.notifications, { to: user_profile._id, type: 'sentreq' } ];
			showNotification('success', 'Friend request sent!');
		}
	}	

	const handleUnfriend = async() => {
		const res = await deleteFriend(user_profile._id, $store.accessToken);
		const filteredFriends = $store.user.friends.filter(friend => friend.friend_id !== user_profile._id);
		$store.user.friends = filteredFriends;
        showNotification('success', 'Friend removed successfully!');
	}

</script>

<!-- ######################################## -->

<div class="introSection">
    <div class="aboutSection">
        <div class="aboutTitle">Intro</div>
        <div class="userGender">
            <img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/rodGQv9jZg5.png" alt="" height="20" width="20">
            <span>{user_profile.gender}</span>	
        </div>
        <div class="userBirthdate">
        <img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/ODICuZSjkMe.png" alt="" height="20" width="20">
            <span>Birthdate</span> 
            {moment(user_profile.date).format('D MMMM YYYY')}
        </div>
        <div class="userJoinTime">
            <img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/CZzXbYX7tI2.png" alt="" height="20" width="20">
            <span>Joined on</span>
            {moment(user_profile.date).format('MMMM YYYY')}
        </div>
    </div>

	<div class="friendSection">
		{#if $store.user.friends.findIndex(friend => friend.friend_id === user_profile._id) !== -1}
			<button class="friendRequestButton" on:click={handleUnfriend}>
				Unfriend
			</button>
			{:else if $store.user._id === user_profile._id}
				<button class="friendRequestButton" on:click={() => $goto('editProfile')}>
					Edit profile
				</button>
			{:else if $store.notifications.findIndex(notif => notif.type === 'sentreq' && notif.to === user_profile._id) > -1}
				<button class:disabled={true} disabled={true} class="friendRequestButton" on:click={handleFriendRequest}>
					<img class="white" src="https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/gXDMGXp9zDk.png" alt="" height="16" width="16">
					Request sent
				</button>
			{:else}
			<button class="friendRequestButton" on:click={handleFriendRequest}>
				<img src="https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/j7eGuw2gtsv.png" width="16" height="16" alt="">
				Add friend
			</button>
		{/if}
	</div>
</div>

<!-- ######################################## -->

<style>
	.friendRequestButton {
		background-color: rgb(24, 119, 242);
		border-radius: 8px;
		border: none;
		color: #fff;
		cursor: pointer;
		font-size: 15px;
		line-height: 16.08px;
		padding: .55rem 1.25rem;
		user-select: none;
		outline: none;
		display: flex;
		align-items: center;
	}

	.friendRequestButton.disabled {
		opacity: .5;
	}

	.friendRequestButton img {
		margin-right: .35rem;
	}

	.friendRequestButton img.white {
		filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(11deg) brightness(104%) contrast(97%);
	}

	.introSection {
		width: calc(100% - 2rem);
		padding: 1.1rem;
		margin: 0 1rem;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
		max-width: 47rem;
	}

	.aboutTitle {
		font-weight: bold;
		margin-bottom: 1.55rem;
	}

	.userGender, .userJoinTime, .userBirthdate {
		font-size: 1rem;
		margin-bottom: .95rem;
		display: flex;
		align-items: center;
		font-weight: 400;
	}

	.userGender span, .userJoinTime span, .userBirthdate span {
		color: var(--grey);
		margin-right: .35rem;
		font-weight: 300;
	}

	.userGender img, .userJoinTime img, .userBirthdate img {
		margin-right: .65rem;
		filter: invert(45%) sepia(6%) saturate(263%) hue-rotate(182deg) brightness(86%) contrast(88%);
	}

	.userJoinTime {
		margin-bottom: 0;
	}
</style>