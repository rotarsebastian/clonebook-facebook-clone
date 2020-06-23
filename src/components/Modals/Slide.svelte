<script>
  // ====================== PROPS ======================
  export let slide;
  export let page;

  // ====================== IMAGE URL ======================
  const url = slide.url.includes('blob') ? slide.url : `https://clonebook.s3.eu-north-1.amazonaws.com/${page}/${slide.url}`;
</script>

<!-- ######################################## -->
<div class="slide"
  class:current={slide.selected}
  style="background: url('{url}') no-repeat center top/cover;">
</div>

<!-- ######################################## -->
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
