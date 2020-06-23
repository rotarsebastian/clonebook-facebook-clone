<script>
    import { getContext } from 'svelte';
    import { onMount } from 'svelte';
    import AddImages from './../MiniComponents/AddImages.svelte';

    const { close } = getContext('simple-modal');

    // ====================== PROPS ======================
    export let message;
    export let text = null;
    export let elem;
    export let hasForm = false;
	export let onOkay = () => {};
    export let value = '';

    // ====================== LIFECYCLE METHODS ======================
    onMount(() => { if(form) form.focus() });
    
    // ====================== DYNAMIC VARIABLES ======================
    let form, files = [];

    // ====================== ADD SELECTED IMAGES ======================
    const setNewFiles = newFiles => files = [ ...newFiles ];
    
    // ====================== CAPITALIZE TEXT ======================
    const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
        
    // ====================== CLOSE MODAL ======================
	const _onCancel = () => close();
    
    // ====================== CHECK WHAT IS THE MODAL FOR ======================
	const _onOkay = () => {
        if(value.length > 0 && message === 'edit') onOkay(value);
        else if(message === 'delete') onOkay();
        else if(message === 'create' && elem === 'post') onOkay(value, files);
		close();
    }
	
</script>

<!-- ######################################## -->

<!-- MODAL NAME -->
<div class="title">{capitalize(message)} {elem}</div>

<!-- MODAL QUESTION -->
{#if text}
    <div class="question">{text}</div>
{/if}

<!-- IF IT HAS FORM - ADD IT -->
{#if hasForm}
	<textarea
        type="text"
        bind:value
        on:keydown={e => e.which === 13 && _onOkay()} 
        placeholder="Your new {elem}"
        bind:this={form}
    ></textarea>
{/if}

<!-- IF CREATE POST - ADD DRAG & DROP -->
{#if message === 'create' && elem === 'post'}
    <div class="addImageTitle">Add images to your post</div>
    <AddImages files={files} setNewFiles={setNewFiles} />
{/if}

<!-- ACTION BUTTONS -->
<div class="buttons">
	<button class="cancel" on:click={_onCancel}>
		Cancel
	</button>
	<button class="confirm" on:click={_onOkay}>
		{message}
	</button>
</div>

<!-- ######################################## -->
<style>
    .title {
        border-bottom: 1px solid var(--thin-border);
        padding: 1rem;
        font-weight: 300;
        color: var(--blue);
        font-size: 1rem;
    }

    .addImageTitle {
        padding: .8rem;
        font-size: .85rem;
        color: var(--grey);
        font-weight: 200;
        text-align: center;
    }

    .question {
        padding: 1rem;
        padding-bottom: 0;
        font-size: 1rem;
        color: var(--grey);
    }

    textarea {
        margin-top: 1.25rem;
		border: 1px solid var(--thin-border);
        margin-left: 1rem;
        padding: .5rem;
        width: 95%;
        border-radius: 8px;
        resize: none;
        height: 5rem;
        outline: none;
        font-size: .85rem;
        font-family: system-ui, -apple-system, system-ui, ".SFNSText-Regular", sans-serif;
    }

    textarea::placeholder {
        font-weight: 200;
    }
	
	.buttons {
		display: flex;
        justify-content: flex-end;
        padding: 1rem;
        transition: .3s;
    }

    .buttons button {
        padding: 10px 14px;
        border: none;
        outline: none; 
        cursor: pointer;
        font-size: 14px;
        border-radius: 6px;
    }
    
    .buttons .confirm {
        text-transform: capitalize;
        background-color: var(--blue);
        color: #fff;
    }

    .buttons .cancel {
        color: var(--blue);
        margin-right: .5rem;
        background-color: #fff;
    }

    .buttons .cancel:hover {
        background-color: var(--thin-border);
    }
</style>