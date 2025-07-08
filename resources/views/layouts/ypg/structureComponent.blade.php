<style>
/* .structure-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
} */
 .structure-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgb(39 68 74), rgb(228 228 228)),
              url('{{ asset('assets/images/yavpheng/bg_structure.jpg') }}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.structure-frame {
  position: relative;
  width: 460px;
  border: 1px solid #ddd;
  background-color:#27444a;
}

.structure-front-image {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-structure {
  max-width: 100%;
  height: 630px;
}

</style>

<div id="_main_structure_component" style="display: none;">
  <div class="structure-container" id="structureContainer">
    <!-- <div class="structure-frame">
      <div class="structure-front-image">
        <img class="img-structure" src="{{ asset('assets/images/yavpheng/Structure_ypg.jpg') }}"/>
      </div>
    </div> -->
  </div>
</div>
