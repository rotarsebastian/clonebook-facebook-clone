<script>
    export let showDialog;
</script>

<!-- ######################################## -->

<div class="dropdown" on:click={e => e.stopPropagation()}>
    <div on:click={() => showDialog('edit')}>Edit</div>
    <div on:click={() => showDialog('delete')}>Delete</div>
</div>

<!-- ######################################## -->

<style>
    .dropdown {
        background-color: #fff;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
        width: 10rem;
        border-radius: 8px;
        overflow: hidden;
    }

    .dropdown div {
        padding: 12px 8px;
        font-size: 12px;
    }

    .dropdown div:hover {
        cursor: pointer;
        background: rgb(240, 242, 245);
    }
</style>