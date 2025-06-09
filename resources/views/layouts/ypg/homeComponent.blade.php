<div id="_main_home_component" class="mt-2" style="display:none;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-3 mt-3" style="background-color:#63777c;" id="_divFilter_home">
    </div>

    <div id="_home_list" class="p-3">
        <div class="container">
    <div class="row">
      <!-- Slide Navigation -->
      <div class="col-md-12 mb-3">
        <h5>Slide Navigation</h5>
        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
            <div class="swiper-slide">Slide 4</div>
          </div>

          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>

      <div class="col-md-12 mb-3">
        <h5>Grave Yard Map</h5>
        <img src="{{ asset('assets/images/yavpheng/GraveYard_map.jpg') }}" usemap="#image-map" class="img-fluid" alt="Map Example" />

        <map name="image-map">
          <area shape="rect" coords="50,50,200,200" href="#" alt="Zone A" title="Zone A">
          <area shape="rect" coords="250,50,400,200" href="#" alt="Zone B" title="Zone B">
        </map>
      </div>
    </div>
  </div>

  <!-- Swiper JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  <script>
    const swiper = new Swiper(".mySwiper", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  </script>

    </div>
</div>
