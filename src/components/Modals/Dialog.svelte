<script>
    import { getContext } from 'svelte';
    import { onMount } from 'svelte';
    import AddImages from './../MiniComponents/AddImages.svelte';

    export let message;
    export let text = null;
    export let elem;
    export let hasForm = false;
	export let onOkay = () => {};
    export let value = '';

    const { close } = getContext('simple-modal');

    let form;
    onMount(() => { if(form) form.focus() });

    let files = [];

    const setNewFiles = newFiles => {
        files = [ ...newFiles ];
    }
    
    const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
	
	let onChange = () => {};
	
	const _onCancel = () => close();
	
	const _onOkay = () => {
        if(value.length > 0 && message === 'edit') onOkay(value);
        else if(message === 'delete') onOkay();
        else if(message === 'create' && elem === 'post') onOkay(value, files);
		close();
    }
	
	$: onChange(value)
</script>

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

<div class="title">{capitalize(message)} {elem}</div>

{#if text}
    <div class="question">{text}</div>
{/if}

{#if hasForm}
	<textarea
        type="text"
        bind:value
        on:keydown={e => e.which === 13 && _onOkay()} 
        placeholder="Your new {elem}"
        bind:this={form}
    ></textarea>
{/if}

{#if message === 'create' && elem === 'post'}
    <div class="addImageTitle">Add images to your post</div>
    <AddImages files={files} setNewFiles={setNewFiles} />
{/if}


<div class="buttons">
	<button class="cancel" on:click={_onCancel}>
		Cancel
	</button>
	<button class="confirm" on:click={_onOkay}>
		{message}
	</button>
</div>