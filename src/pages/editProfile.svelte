<script>
	import { store } from './../stores/store.js';
    import { getAccessToken, getSpecificUser, deleteFriend } from './../helpers/auth';
    import { sendFriendRequest } from './../helpers/notifications';
	import moment from 'moment';
	import { getNotificationsContext } from 'svelte-notifications';
	
    const { addNotification } = getNotificationsContext();

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
    }
    
	let user_profile, editButtonDisabled = true;
	
	const getUserData = async() => {
        const result = await getSpecificUser($store.user._id, $store.accessToken);
		user_profile = result.data;
		
		// ====================== CHECK IF TOKEN EXPIRED ======================
		if(user_profile.hasOwnProperty('msg')) {
			const token = localStorage.getItem('refreshToken');
			const { accessToken, user } = await getAccessToken(token);
			if(accessToken) {
				$store.isAuthenticated = true;
				$store.user = user;
				$store.accessToken = accessToken;

				const result_new_token = await getSpecificUser($store.user._id, accessToken);
				user_profile = result_new_token.data;
			} 
		}
	}
	
	const userData = getUserData();
	
</script>

{#await userData}
	<p>...waiting</p>
{:then data}
    <div class="contentContainer">
        <h1>Edit profile</h1>        
        <div>{user_profile.first_name} {user_profile.last_name}</div>
        <div>Gender: {user_profile.gender}</div>
        <div>Birthdate: {user_profile.birthdate}</div>
        <div>Joined on: {moment(user_profile.date).format('MMM YYYY')}</div>
        <button class="friendRequestButton" class:disabled={editButtonDisabled} disabled={editButtonDisabled}>
            Edit profile
        </button>
    </div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
	.contentContainer {
		display: flex;
        align-items: center;
        flex-direction: column;
		margin-top: 5rem;
    }

    .friendRequestButton {
		margin-top: 1rem;
		background-color: rgb(24, 119, 242);
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

	.friendRequestButton.disabled {
		opacity: .5;
	}
</style>