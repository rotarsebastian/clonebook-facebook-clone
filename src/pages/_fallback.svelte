<script>
    import { route } from '@sveltech/routify';
</script>

<div class="contentContainer">
    <h1>404 Not Found</h1>
    <p>The page {$route.leftover} was not found!</p>
</div>

<style>
	.contentContainer {
		display: flex;
        align-items: center;
        flex-direction: column;
		margin-top: 1.75rem;
    }
    
    .contentContainer p {
        font-size: 1rem;
    }
</style>