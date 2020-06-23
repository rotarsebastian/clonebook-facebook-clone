<script>
  export let close;
  export let top;
  export let right;
</script>

<!-- ######################################## -->

<button style={`top: ${top}rem;right: ${right}rem;`} on:click={close} class="close"></button>

<!-- ######################################## -->
<style>
  .close {
    display: block;
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    color: black;
    border-radius: 1.5rem;
    cursor: pointer;
    box-shadow: none;
    background: white;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    -webkit-appearance: none;
  }

  .close:before, .close:after {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    width: 1rem;
    height: 1px;
    background: black;
    transform-origin: center;
    transition: height 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .close:before {
    -webkit-transform: translate(0, -50%) rotate(45deg);
    -moz-transform: translate(0, -50%) rotate(45deg);
    transform: translate(0, -50%) rotate(45deg);
    left: 0.25rem;
  }

  .close:after {
    -webkit-transform: translate(0, -50%) rotate(-45deg);
    -moz-transform: translate(0, -50%) rotate(-45deg);
    transform: translate(0, -50%) rotate(-45deg);
    left: 0.25rem;
  }

  .close:hover {
    background: rgb(24, 119, 242);
  }

  .close:hover:before, .close:hover:after {
    height: 2px;
    background: white;
  }

  .close:active {
    transform: scale(0.9);
  }

  .close:hover, .close:focus, .close:active {
    outline: none;
  }
</style>