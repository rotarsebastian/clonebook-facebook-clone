<script>
	import { Router } from '@sveltech/routify';
	import { routes } from '@sveltech/routify/tmp/routes';
	import Notifications from 'svelte-notifications';
	import { goto } from '@sveltech/routify';
	import { store } from './stores/store.js';
	import { getAccessToken, getLoggedUserData } from './helpers/auth';

	const checkAuth = async() => {
		const token = localStorage.getItem('refreshToken');
		const { accessToken, user } = await getAccessToken(token);
		if(accessToken) {
			$store.isAuthenticated = true;
			$store.accessToken = accessToken;
			const loggedUserData = await getLoggedUserData(accessToken);
			// console.log(loggedUserData.data);
			$store.user = loggedUserData.data;
		} 
	}
    
	const isLoggedIn = checkAuth();
</script>

{#await isLoggedIn}
	<p>...waiting</p>
{:then data}
	<Notifications>
		<Router {routes} />
	</Notifications>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}


