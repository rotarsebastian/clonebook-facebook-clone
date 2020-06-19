import { writable } from 'svelte/store';

export let store = writable({
    chatUserStore: null,
    posts: [],
    isAuthenticated: false,
    user: {
        friends: [],
        images: []
    },
    notifications: [],
    messages: [],
    selectedProfileImage: null,
    temporaryImages: []
});