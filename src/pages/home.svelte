<script>
	import Posts from './../components/Posts/Posts.svelte';
	import ChatList from './../components/ChatList/ChatList.svelte';
	import ChatContainer from './../components/ChatContainer/ChatContainer.svelte';
	import Modal from './../components/Modals/Modal.svelte';
	import { store } from './../stores/store.js';
	import { getAccessToken } from './../helpers/auth';
	import { getFeedPosts } from './../helpers/posts';

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
	
	const subscribePosts = async() => {
		const eventSource = new EventSource('http://localhost:9999/api/posts/subscribe');
		eventSource.addEventListener('message', e => {
			try {
				if(e.data !== '0') { 
					const updatedPost = JSON.parse(e.data);

					if(updatedPost.hasOwnProperty('isNew')) {
						delete updatedPost.isNew;
						if($store.posts.findIndex(post => post._id === updatedPost._id) === -1) $store.posts = [ updatedPost, ...$store.posts ];
					} 

					else if(updatedPost.hasOwnProperty('deletedPostId')) {
						const filteredPosts = $store.posts.filter(post => post._id !== updatedPost.deletedPostId);
        				$store.posts = filteredPosts;
					}

					else {
						const updatedPostIndex = $store.posts.findIndex(post => post._id === updatedPost._id);
						$store.posts[updatedPostIndex] = updatedPost; 
					}
				}
			} catch (err) {
				if(err) return console.log('ERROR', err);
			}
		});
	}
	
	let dataLoaded;
	if($store.isAuthenticated) dataLoaded = getPosts();
	
</script>

<!-- ######################################## -->

{#await dataLoaded}
	<p>...waiting</p>
{:then data}
	<Modal>
		<main>
			<div class="contentContainer">
				<div class="groupsContainer">
					<div class="hidden"></div>
					<div class="groups">Groups</div>
				</div>
				<div class="postsContainer">
					<Posts />
				</div>
				<div class="chatlistContainer">
					<div class="hidden"></div>
					<div class="chatList"><ChatList /></div>
				</div>
			</div>
			<ChatContainer />
		</main>
	</Modal>
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