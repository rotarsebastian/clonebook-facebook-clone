
<script>
	import { store } from './../stores/store.js';
    import { getAccessToken, getSpecificUser } from './../helpers/auth';
	import { params } from '@sveltech/routify';
	import { getNotificationsContext } from 'svelte-notifications';
	import ProfileImage from './../components/MiniComponents/ProfileImage.svelte';
	import ProfileIntro from './../components/ProfileIntro/ProfileIntro.svelte';
	import Posts from './../components/Posts/Posts.svelte';
	import { getUserPosts } from './../helpers/posts';
	import Modal from './../components/Modals/Modal.svelte';
	import { onDestroy } from 'svelte';

	let eventSource;

	onDestroy(() => {
		if(eventSource) eventSource.close();
	});

	let user_profile, user_posts, subscribed = false;
	$: user_posts;

	const getPosts = async(id) => {
		const posts = await getUserPosts(id, 0, $store.accessToken);

		// ====================== CHECK IF TOKEN EXPIRED ======================
		if(posts.hasOwnProperty('msg')) {
			const token = localStorage.getItem('refreshToken');
			const { accessToken, user } = await getAccessToken(token);
			if(accessToken) {
				$store.isAuthenticated = true;
				$store.user = user;
				$store.accessToken = accessToken;

				const postsNewToken = await getUserPosts(id, 0, accessToken);
				return postsNewToken;
			} 
		} else return posts;
	}
	
	const subscribePosts = async() => {
		eventSource = new EventSource('http://localhost:9999/api/posts/subscribe');
		eventSource.addEventListener('message', e => {
			try {
				if(e.data !== '0') { 
					const updatedPost = JSON.parse(e.data);
					if(updatedPost.authorId === $params.id) {
						if(updatedPost.hasOwnProperty('isNew')) {
							delete updatedPost.isNew;
							if(user_posts.findIndex(post => post._id === updatedPost._id) === -1) user_posts = [ updatedPost, ...user_posts ];
						} 
	
						else if(updatedPost.hasOwnProperty('deletedPostId')) {
							const filteredPosts = user_posts.filter(post => post._id !== updatedPost.deletedPostId);
							user_posts = filteredPosts;
						}
	
						else {
							const updatedPostIndex = user_posts.findIndex(post => post._id === updatedPost._id);
							user_posts[updatedPostIndex] = updatedPost; 
						}
					}
				}
			} catch (err) {
				if(err) return console.log('ERROR', err);
			}
		});
	}
	    	
	const getUserData = async(id) => {
        const result = await getSpecificUser(id, $store.accessToken);
		user_profile = result.data;
		const postsData = await getPosts(id);
		user_posts = postsData;
		if(!subscribed) {
			subscribePosts();
			subscribed = true;
		}
		
		// ====================== CHECK IF TOKEN EXPIRED ======================
		if(user_profile.hasOwnProperty('msg')) {
			const token = localStorage.getItem('refreshToken');
			const { accessToken, user } = await getAccessToken(token);
			if(accessToken) {
				$store.isAuthenticated = true;
				$store.accessToken = accessToken;

				const result_new_token = await getSpecificUser(id, accessToken);
				user_profile = result_new_token.data;
				
				const postsData = await getPosts(id);
				user_posts = postsData;
				if(!subscribed) {
					subscribePosts();
					subscribed = true;
				}
			} 
		}
	}

	$: userData = getUserData($params.id);
	
</script>

{#await userData}
	<p>...waiting</p>
{:then data}
	<Modal>
		<div class="contentContainer">
			<ProfileImage 
				size={15} 
				slideShowImgs={user_profile.images && user_profile.images.length > 0 ? user_profile.images : undefined} 
				img={user_profile.images && user_profile.images.length > 0 ? user_profile.images[0] : undefined} 
			/>
			<div class="userFullName">{user_profile.first_name} {user_profile.last_name}</div>
			<ProfileIntro {user_profile} />
			{#if user_posts.length > 0}
				<p class="postsTitle">{user_profile._id === $store.user._id ? 'Your posts' : `${user_profile.first_name}'s posts`}</p>
				{:else}
				<p class="postsTitle">No posts yet</p>
			{/if}
			<Posts propsPosts={user_posts} />
		</div>
	</Modal>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
	.contentContainer {
		display: flex;
        align-items: center;
        flex-direction: column;
		margin-top: 5.5rem;
	}

	.userFullName {
		color: var(--black);
		font-weight: bold;
		font-size: 1.7rem;
		margin: 2rem 0;
	}

	.postsTitle {
		color: var(--grey);
		margin-top: 2.75rem;
		font-size: 1.35rem;
	}
</style>