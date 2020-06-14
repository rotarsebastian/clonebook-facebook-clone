<script>
    import Nav from './../components/Navbar/Nav.svelte';
    import { route, goto } from '@sveltech/routify';
    import { store } from './../stores/store.js';

    const excludedPaths = [
        '/login', '/register', '/forgotPassword', 'changePassword'
    ];

    const noNav = excludedPaths.indexOf($route.path) > -1 || $route.leftover.length > 0 ? true : false;

    if(!$store.isAuthenticated) $goto('./login', undefined, true);
    else if($store.isAuthenticated && noNav)  $goto('./home');

</script>

{#if $store.isAuthenticated }
    <Nav />
    <slot />

    {:else}
    <slot />
{/if}
