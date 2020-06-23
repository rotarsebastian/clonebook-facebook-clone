<script>
    import moment from 'moment';
    import { store } from './../../stores/store';
	import { showNotification } from './../../helpers/actionNotifications';
    import { sendFriendRequest } from './../../helpers/notifications';
    import { deleteFriend } from './../../helpers/user';
    import { goto } from '@sveltech/routify';
	
	// ====================== PROPS ======================
    export let user_profile;
	
	// ====================== SEND FRIEND REQUEST ======================
    const handleFriendRequest = async() => {
		const response = await sendFriendRequest(user_profile._id, $store.accessToken);

		if(response.status !== 1) console.log(response);
		else {
			$store.notifications = [ ...$store.notifications, { to: user_profile._id, type: 'sentreq' } ];
			showNotification('success', 'Friend request sent!');
		}
	}	

	// ====================== UNFRIEND REQUEST ======================
	const handleUnfriend = async() => {
		const res = await deleteFriend(user_profile._id, $store.accessToken);

		if(res.status === 1) {
			$store.user.friends = $store.user.friends.filter(friend => friend.friend_id !== user_profile._id);

			if($store.chatUserStore !== null && $store.chatUserStore.friend_id === user_profile._id) $store.chatUserStore = null;
			showNotification('success', 'Friend removed successfully!');
		} else console.log(res);
	}

</script>

<!-- ######################################## -->

<div class="introSection">

	<!-- INTRO - USER DETAILS -->
    <div class="aboutSection">
        <div class="aboutTitle">Intro</div>

		<!-- GENDER -->
        <div class="userGender">
            <img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/rodGQv9jZg5.png" alt="" height="20" width="20">
            <span>{user_profile.gender}</span>	
        </div>

		<!-- BIRTHDATE -->
        <div class="userBirthdate">
        	<img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/ODICuZSjkMe.png" alt="" height="20" width="20">
            <span>Birthdate</span> 
            {moment(user_profile.date).format('D MMMM YYYY')}
        </div>

		<!-- JOIN TIME -->
        <div class="userJoinTime">
            <img class="icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/CZzXbYX7tI2.png" alt="" height="20" width="20">
            <span>Joined on</span>
            {moment(user_profile.date).format('MMMM YYYY')}
        </div>
    </div>

	<div class="friendSection">

		{#if $store.user.friends.findIndex(friend => friend.friend_id === user_profile._id) !== -1}

			<!-- ALREADY A FRIEND -->
			<button class="friendRequestButton" on:click={handleUnfriend}>
				Unfriend
			</button>

			<!-- YOUR PROFILE -->
			{:else if $store.user._id === user_profile._id}
				<button class="friendRequestButton" on:click={() => $goto('editProfile')}>
					Edit profile
				</button>

			<!-- FRIEND REQUEST SENT -->
			{:else if $store.notifications.findIndex(notif => notif.type === 'sentreq' && notif.to === user_profile._id) > -1}
				<button class:disabled={true} disabled={true} class="friendRequestButton" on:click={handleFriendRequest}>
					<img class="white" src="https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/gXDMGXp9zDk.png" alt="" height="16" width="16">
					Request sent
				</button>
			{:else}

			<!-- ADD AS FRIEND -->
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