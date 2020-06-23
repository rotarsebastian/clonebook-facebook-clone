<script>
    import LeftContainer from './NavComponents/LeftContainer.svelte';
    import RightContainer from './NavComponents/RightContainer/RightContainer.svelte';
    import MainContainer from './NavComponents/MainContainer.svelte'  
</script>

<!-- ######################################## -->

<nav>
    <LeftContainer />
    <MainContainer />
    <RightContainer />
</nav>

<!-- ######################################## -->
<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 3.75rem;
        padding: 0 1vw; 
        background: #fff;
        color: #000;
        box-shadow: 0 0 10px 0 #dcdcdc;
        z-index: 1;
    }
</style>