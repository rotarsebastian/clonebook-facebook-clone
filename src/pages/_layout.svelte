<script>
    import Nav from './../components/Navbar/Nav.svelte';
    import { route, goto } from '@sveltech/routify';
    import { store } from './../stores/store.js';
    import ChatContainer from './../components/ChatContainer/ChatContainer.svelte';

    const excludedPaths = [ '/login' ];

    if(!$store.isAuthenticated) $goto('login');
    else if($store.isAuthenticated)  $goto('home');

</script>

{#if $store.isAuthenticated }
    <Nav />
    {#if $store.chatUserStore}
        <ChatContainer />
    {/if}
    <slot />

    {:else}
    <slot />
{/if}
