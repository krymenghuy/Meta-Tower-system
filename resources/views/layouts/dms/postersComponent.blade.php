<style>
    .salesapp-poster-wrapper{
        min-width:250px;
        min-height:250px;
        border-radius:3px;
        display: flex;
        flex-direction: column;
        border:1px solid #B9BDBA;
        border-radius:3px;
        overflow:hidden;
    }
    .poster-box {
      width: calc(33.33% - 20px); /* Adjust spacing as needed */
      margin: 10px; /* Adjust spacing as needed */
      border: 1px solid #000; /* Just for visualization */
      box-sizing: border-box; /* Ensure border is included in width calculation */
      border-radius:3px;
  }
</style>
<div id="_main_postersComponent" class="m-3" style="display:none;">
    <div class="d-flex flex-row gap-2">
        <button id="_dpl_btnNewPoster" class="btn btn-sm btn-info"> <i class="fa fa-image"></i> <span class="trans-text" data-langprop="titles.Add Poster"></span></button> 
    </div>
    <div id="_poster_list" class="w-100 bg-white rounded-3 mt-2 p-1">
    </div>
</div>

<div class="modal fade" id="dlgPoster" tabindex="-1" role="dialog" aria-labelledby="dlgPoster_title" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="dlgPoster_title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
             <div class="img-poster-container"></div>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" class="description form-control data-input" data-field="description" placeholder="">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" id="dlgPoster_btnSave" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>