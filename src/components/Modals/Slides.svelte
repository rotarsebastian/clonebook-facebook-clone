<script>  
    import Slide from './Slide.svelte';
    import { getContext } from 'svelte';

    const { close } = getContext('simple-modal');

    // ====================== PROPS ======================
    export let images;
    export let page;
        
    // ====================== DYNAMIC VARIABLES ======================
    let current = 0;
    let slides = images.map(img => { return { url: img } });

    slides[current].selected = true;

    // ====================== CLOSE MODAL ======================
	const _onCancel = () => close();

    // ====================== GO TO NEXT IMAGE ======================
    const nextHandler = () => {
        slides[current].selected = false;
        if (current < slides.length - 1) current++;
        else current = 0;
        slides[current].selected = true;
    }

    // ====================== GO TO PREVIOUS IMAGE ======================
    const prevHandler = () => {
        slides[current].selected = false;
        if (current > 0) current--;
        else current = slides.length - 1;

        slides[current].selected = true;
    }
</script>

<!-- ######################################## -->

<!-- SLIDES LIST -->
<div class="slider">
  {#each slides as slide}
    <Slide slide={slide} page={page} />
  {/each}
</div>

<!-- ADD ARROWS FOR MULTIPLE IMAGES -->
{#if slides.length > 1}
    <div class="buttons">
    <button id="prev" on:click={prevHandler}></button>
    <button id="next" on:click={nextHandler}></button>
    </div>
{/if}

<!-- ######################################## -->
<style>
    .slider {
        overflow: hidden;
        height: calc(100vh - 4rem);
        width: 100%;
    }

    .buttons button#next {
        position: absolute;
        top: 50%;
        right: 1rem;
        width: 37px;
        height: 37px;
        filter: invert(99%) sepia(47%) saturate(0%) hue-rotate(17deg) brightness(111%) contrast(100%);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 490.8 490.8' style='enable-background:new 0 0 490.8 490.8;' xml:space='preserve'%3E%3Cpath style='fill:%23F44336;' d='M135.685,3.128c-4.237-4.093-10.99-3.975-15.083,0.262c-3.992,4.134-3.992,10.687,0,14.82 l227.115,227.136L120.581,472.461c-4.237,4.093-4.354,10.845-0.262,15.083c4.093,4.237,10.845,4.354,15.083,0.262 c0.089-0.086,0.176-0.173,0.262-0.262l234.667-234.667c4.164-4.165,4.164-10.917,0-15.083L135.685,3.128z'/%3E%3Cpath d='M128.133,490.68c-5.891,0.011-10.675-4.757-10.686-10.648c-0.005-2.84,1.123-5.565,3.134-7.571l227.136-227.115 L120.581,18.232c-4.171-4.171-4.171-10.933,0-15.104c4.171-4.171,10.933-4.171,15.104,0l234.667,234.667 c4.164,4.165,4.164,10.917,0,15.083L135.685,487.544C133.685,489.551,130.967,490.68,128.133,490.68z'/%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }
	
    .buttons button#prev {
        position: absolute;
        top: 50%;
        left: 1rem;
        width: 37px;
        height: 37px;
        filter: invert(99%) sepia(47%) saturate(0%) hue-rotate(17deg) brightness(111%) contrast(100%);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 490.787 490.787' style='enable-background:new 0 0 490.787 490.787;' xml:space='preserve'%3E%3Cpath style='fill:%23F44336;' d='M362.671,490.787c-2.831,0.005-5.548-1.115-7.552-3.115L120.452,253.006 c-4.164-4.165-4.164-10.917,0-15.083L355.119,3.256c4.093-4.237,10.845-4.354,15.083-0.262c4.237,4.093,4.354,10.845,0.262,15.083 c-0.086,0.089-0.173,0.176-0.262,0.262L143.087,245.454l227.136,227.115c4.171,4.16,4.179,10.914,0.019,15.085 C368.236,489.664,365.511,490.792,362.671,490.787z'/%3E%3Cpath d='M362.671,490.787c-2.831,0.005-5.548-1.115-7.552-3.115L120.452,253.006c-4.164-4.165-4.164-10.917,0-15.083L355.119,3.256 c4.093-4.237,10.845-4.354,15.083-0.262c4.237,4.093,4.354,10.845,0.262,15.083c-0.086,0.089-0.173,0.176-0.262,0.262 L143.087,245.454l227.136,227.115c4.171,4.16,4.179,10.914,0.019,15.085C368.236,489.664,365.511,490.792,362.671,490.787z'/%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }
	
    .buttons button {
        background-color: transparent;
        color: #fff;
        cursor: pointer;
        outline: none;
        border: none;
        font-size: 1.25rem;
        transition: .3s;
    }

    .buttons button:hover {
        transform: scale(1.1);
    }
</style>
