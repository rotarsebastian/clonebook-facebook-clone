<script>
	import { Router } from '@sveltech/routify';
	import { routes } from '@sveltech/routify/tmp/routes';
	import Notifications from 'svelte-notifications';
	import { store } from './stores/store.js';
	import { getAccessToken, getLoggedUserData } from './helpers/user';
	import Modal from './components/Modals/Modal.svelte';
	
	// ====================== CHECK IF USER IS LOGGED IN ======================
	const checkAuth = async() => {
		const token = localStorage.getItem('refreshToken');
		const { accessToken, user } = await getAccessToken(token);
		if(accessToken) {
			$store.isAuthenticated = true;
			$store.accessToken = accessToken;
			const loggedUserData = await getLoggedUserData(accessToken);
			$store.user = loggedUserData.data;
		}
	}

	const isLoggedIn = checkAuth();
</script>

{#await isLoggedIn}
	<p>...waiting</p>
{:then data}
	<Notifications>
		<Modal>
			<Router {routes} />
		</Modal>
	</Notifications>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}


