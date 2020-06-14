<script>
    export let files;
    export let setNewFiles;

    import CloseButton from './CloseButton.svelte';

    const addImages = e => {
        const inputImages = Array.from(e.target.files);

        const newImages = inputImages.filter(file => { 
        if(files.findIndex(propFile => propFile.name === file.name) === -1) 
            return Object.assign(file, { preview: URL.createObjectURL(file) } )
        });

        let updateImages = [ ...files, ...newImages ];

        if(updateImages.length > 5) updateImages = updateImages.filter((img, index) => index < 5);

        setNewFiles(updateImages);
    }

    const removeImage = index => {
        const newFiles = [ ...files ];
        newFiles.splice(index, 1);
        setNewFiles(newFiles);
    }
</script>

<!-- ######################################## -->

<span class="thumbsContainer">

    {#each files as file, index}
        <div class="thumb">
            <CloseButton top={0.5} right={0.5} close={() => removeImage(index)} />
            <div class="thumbInner">
                <img src={file.preview} alt={'thumb-img'} />
            </div>
        </div>
    {/each}

    {#if files.length < 5}
        <span class="addMoreContainer">
            <input 
                class="hiddenInputFile"
                type='file' 
                multiple='multiple' 
                accept='image/*'
                on:change={e => addImages(e)} 
            />
        </span> 
    {/if}

</span>
<!-- ######################################## -->

<style>
    .hiddenInputFile {
        opacity: 0;
        -moz-opacity: 0;
        filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .addMoreContainer {
        display: inline-flex;
        margin: 8px;
        width: 150px;
        height: 150px;
        position: relative;
        background-image: url("data:image/svg+xml,%3Csvg height='90pt' viewBox='0 0 448 448' width='448pt' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0'/%3E%3C/svg%3E");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        filter: invert(72%) sepia(8%) saturate(7%) hue-rotate(358deg) brightness(85%) contrast(77%);
        border: 1px dashed black;
        border-radius: 10px;
    }

    .thumbsContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

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
</style>