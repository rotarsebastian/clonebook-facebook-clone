<script>
    export let size;
    export let img = undefined;
    export let slideShowImgs = undefined;
    import { store } from './../../stores/store.js';
    import { getContext } from 'svelte';
    import Slides from './../Modals/Slides.svelte';

    const { open } = getContext('simple-modal');

    // ====================== SHOW IMAGES FULLSCREEN ======================
    const showFullscreenImgs = () => {
        open(
			Slides,
			{ images: slideShowImgs ? slideShowImgs : $store.user.images, page: 'profiles' },
			{
				closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
                styleWindow: {
                    width: '90%'
                },
                styleBg: {
                    background: 'rgba(0, 0, 0, 0.7)',
                    top: 0,
                    left: 0
                }
			}
	    );
    }
</script>

<!-- ######################################## -->

{#if img}
    <img on:click={showFullscreenImgs} class="profileImg" style="width: {size}rem; height: {size}rem;" src={`https://clonebook.s3.eu-north-1.amazonaws.com/profiles/${img}`} alt="profileImg" />
    {:else}
    <span class="profileImgDefault" style="width: {size}rem; height: {size}rem;"></span>
{/if}

<!-- ######################################## -->
<style>
    .profileImgDefault {
        width: 2rem;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M256,0C114.844,0,0,114.844,0,256s114.844,256,256,256s256-114.844,256-256S397.156,0,256,0z M256,74.667 c67.635,0,122.667,55.031,122.667,122.667S323.635,320,256,320s-122.667-55.031-122.667-122.667S188.365,74.667,256,74.667z M256,469.333c-69.707,0-131.52-33.755-170.473-85.615c42.676-20.534,103.621-42.385,170.473-42.385 c66.857,0,127.807,21.854,170.474,42.383C387.521,435.577,325.708,469.333,256,469.333z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }
    .profileImg {
        width: 2rem;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
    }
</style>