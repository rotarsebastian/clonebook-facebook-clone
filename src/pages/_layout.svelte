<script>
    import Nav from './../components/Navbar/Nav.svelte';
    import { route, goto, params, page } from '@sveltech/routify';
    import { store } from './../stores/store.js';
    import ChatContainer from './../components/ChatContainer/ChatContainer.svelte';

    const excludedPaths = [ '/login' ],
        notAuthPage = excludedPaths.indexOf($route.path) > -1 || $route.leftover.length > 0 || $route.path === '/_fallback' ? true : false;

    // ====================== IF LOGIN HAS QUERY STRINGS ADD IT TO THE LINK ======================
    let queryString = '', firstString = true;

    for(let prop in $params) {
        if ($params.hasOwnProperty(prop)) {
            if(firstString) {
                queryString += `?${prop}=${$params[prop]}`;
                firstString = false;
            }
            else queryString += `&${prop}=${$params[prop]}`;
        }
    }

    // ====================== REDIRECT USER TO HOME IF LOGGED - OR TO LOGIN IF NOT ======================
    if(!$store.isAuthenticated) $goto(`login${queryString}`);
    else if($store.isAuthenticated && notAuthPage) $goto('home');

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
