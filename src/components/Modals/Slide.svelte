<script>
  export let slide;
</script>

<style>
  .slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity .4s ease-in-out;
  }

  .slide.current {
    opacity: 1;
  }
</style>

<div class="slide"
  class:current={slide.selected}
  style="background: url('./assets/imgs/{slide.url}.jpeg') no-repeat center top/cover;">
</div>
