<script>
    import IconUser from '../MiniComponents/IconUser.svelte';
    import { store } from '../../stores/store.js';    
</script>

<!-- ######################################## -->

{#if $store.chatUserStore !== null}
	<div class="chatContainer">
        <div class="topBar">
            <IconUser user={$store.chatUserStore} />
            <div class="closeChatContainer" on:click={() => $store.chatUserStore = null}>
                <span class="closeChatButton"></span>
            </div>
        </div>
    </div>
{/if}

<!-- ######################################## -->

<style>
    .chatContainer {
        position: fixed;
        bottom: 2vh;
        right: 5vh;
        background: #fff;
        width: 328px;
        height: 455px;
        border-radius: 8px;
        box-shadow:rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
    }

    .chatContainer .topBar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 2rem;
        transition: .3s;
        border-radius: 10px;
        padding: 1.5rem .5rem;
        cursor: pointer;
        position: relative;
    }

    .chatContainer .topBar .closeChatContainer { 
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        border-radius: 50%;
        transition: .4s;
        cursor: pointer;
        padding: 9px;
    }

    .chatContainer .topBar .closeChatContainer:hover {
        background: rgb(218, 218, 218);
    }

    .chatContainer .topBar .closeChatButton {
        width: 9px;
        height: 9px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='357px' height='357px' viewBox='0 0 357 357' style='enable-background:new 0 0 357 357;' xml:space='preserve'%3E%3Cg%3E%3Cg id='close'%3E%3Cpolygon points='357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 '/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }   
</style>