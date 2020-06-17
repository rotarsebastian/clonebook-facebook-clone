<script>
    import CloseButton from './CloseButton.svelte';
    import { store } from './../../stores/store';
    
    export let oldImage = undefined;
    export let preview = undefined;
    export let index;
    export let removeImage;

    const changeProfileImage = () => {
        $store.selectedProfileImage = preview ? preview : oldImage;
    }
</script>

<!-- ######################################## -->

<div class="thumb">
    <CloseButton top={0.5} right={0.5} close={() => removeImage(index)} />
    <div class="thumbInner" on:click={changeProfileImage}>
        <img 
            src={oldImage ? `https://clonebook.s3.eu-north-1.amazonaws.com/profiles/${oldImage}` : preview} alt={'thumb-img'}
            class:profileImage={$store.selectedProfileImage === preview || $store.selectedProfileImage === oldImage}    
        />
    </div>
</div>

<!-- ######################################## -->

<style>
    .thumb {
        display: inline-flex;
        margin: 8px;
        width: auto;
        height: 150px;
        position: relative;
    }

    .thumbInner {
        width: 13rem;
    }

    .thumbInner img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    .thumbInner img.profileImage {
        box-shadow: 0 0 13px 0 var(--blue);
    }
</style>