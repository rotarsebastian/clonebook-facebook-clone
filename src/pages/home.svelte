<script>
	import Posts from './../components/Posts/Posts.svelte';
	import ChatList from './../components/ChatList/ChatList.svelte';
	import { store } from './../stores/store';
	import { getAccessToken, endpoint } from './../helpers/user';
	import { getFeedPosts } from './../helpers/posts';
	import { onDestroy } from 'svelte';

	// ====================== DYNAMIC VARIABLES ======================
	let eventSource, dataLoaded;

	// ====================== LIFECYCLE METHODS ======================
	onDestroy(() => { if(eventSource) eventSource.close() });

	// ====================== GET INITIAL POSTS ======================
	const getPosts = async() => {
		const posts = await getFeedPosts(0, $store.accessToken);

		// ====================== CHECK IF TOKEN EXPIRED ======================
		if(posts.hasOwnProperty('msg')) {
			const token = localStorage.getItem('refreshToken');
			const { accessToken, user } = await getAccessToken(token);
			if(accessToken) {
				$store.isAuthenticated = true;
				$store.accessToken = accessToken;

				const postsNewToken = await getFeedPosts(0, accessToken);
				$store.posts = postsNewToken;
				subscribePosts();
			} 
		} else {
			$store.posts = posts;
			subscribePosts();
		}
	}
	
	// ====================== WATCH POSTS FOR CHANGES ======================
	const subscribePosts = async() => {
		eventSource = new EventSource(`${endpoint}/posts/subscribe`);

		eventSource.addEventListener('message', e => {
			try {
				if(e.data !== '0') { 
					const updatedPost = JSON.parse(e.data);

					// ====================== NEW POST ======================
					if(updatedPost.hasOwnProperty('isNew')) {
						delete updatedPost.isNew;
						if($store.posts.findIndex(post => post._id === updatedPost._id) === -1) $store.posts = [ updatedPost, ...$store.posts ];
					} 

					// ====================== DELETED POST ======================
					else if(updatedPost.hasOwnProperty('deletedPostId')) {
						const filteredPosts = $store.posts.filter(post => post._id !== updatedPost.deletedPostId);
        				$store.posts = filteredPosts;
					}

					// ====================== EDITED POST ======================
					else {
						const updatedPostIndex = $store.posts.findIndex(post => post._id === updatedPost._id);
						$store.posts[updatedPostIndex] = updatedPost; 
					}
				}
			} catch (err) {
				return console.log('ERROR', err);
			}
		});
	}
	
	if($store.isAuthenticated) dataLoaded = getPosts();
	
</script>

<!-- ######################################## -->

{#await $store.isAuthenticated && $store.posts}
	<p>...waiting</p>
{:then data}
	<main>
		<div class="contentContainer">

			<!-- GROUPS  - LEFT CONTAINER -->
			<div class="groupsContainer">
				<div class="hidden"></div>
				<div class="groups"></div>
			</div>

			<!-- POSTS - MIDDLE CONTAINER -->
			<div class="postsContainer">
				<Posts />
			</div>

			<!-- CHAT LIST - RIGHT CONTAINER -->
			<div class="chatlistContainer">
				<div class="hidden"></div>
				<div class="chatList"><ChatList /></div>
			</div>

		</div>
	</main>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<!-- ######################################## -->

<style>
	.contentContainer {
		display: flex;
		justify-content: space-between;
		margin-top: 3.75rem;
		position: relative;
	}

	.chatlistContainer .hidden {
		width: 20rem;
	}

	.groupsContainer .hidden {
		width: calc(1vw + 20rem);
	}

	.groupsContainer .groups {
		position: fixed;
	}

	.chatlistContainer .chatList {
		position: fixed;
		right: 0;
	}

	.postsContainer {
		width: 50%;
	}

	@media only screen and (max-width: 1200px) {
        .groupsContainer {
			display: none;
		}

		.postsContainer {
			width: calc(100% - 20rem);
		}
    }
</style>