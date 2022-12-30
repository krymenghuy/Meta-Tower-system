<style>
 img.promo-img-preview{
    width:100%;
    height:100%;
    object-fit: contain;
 }
 img.promo-img{
    width:200px;
    height:200px;
    padding:3px;
    margin-right:25px;
 }
 .promo-title{
   font-weight:bold;
   font-size:0.9em;
   padding:5px;
 }
 .mobile-promo-delete{
   color:red;
 }
 .promo-des-text{
    font-size:0.9em;
 }

</style>
<div id="_main_promotionComponent" style="display:none;margin:auto;width;90%;background:#fff;">
  <div style="margin:auto;width:100%">
       <div style="border:1.2px solid #C9D3D6;padding:10px;border-radius:3px;margin:5px 10px 10px 10px"> 
                  <div class="row">
                     <div class="col-lg-12">
                       <div class="form-inline" style="margin-bottom:10px">
                           <select id="_mobile_promo_app" class="form-control">
                               <option value="admin">Student/Customer App</option>
                           </select>
                           &nbsp;
                           <button id="promo_btnNewPromo" type="button" class="btn btn-outline-primary"><i class="fa fa-plus"></i> New Promotion</button>
                           <div style="display:none">
                                 <input id="_mobile_promo_fileChooser" type="file"  accept="image/*" style="display:none"/>
                           </div>
                       </div>
                       <div id="promo_img_container" class="img-container">

                       </div>
                     </div> 
                  </div>                  
        </div>
  </div>
  
</div>

<!--begin::PromoDialog-->
<div class="modal fade" id="promo_dlgPromo" tabindex="-1" role="dialog" aria-labelledby="promo_dlgPromoTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="promo_dlgPromoTitle">Title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
       <div class="col-lg-12">
         <span id="promo_dlgPromo_error" class="error_text"></span>
       </div> 
       <div class="form-group col-lg-12">
           <span class="simple-label">Promotion Title</span>
           <div><input type="text" class="form-control" id="promo_title"></div>
        </div>

       <div style="display:none" class="form-group col-lg-12">
           <span class="simple-label">Category</span>
           <div>
               <select id="promo_category" type="text" class="form-control">
                  <option value="General">General</option>
               </select>
            </div>
        </div>
        
         <div class="form-group col-lg-12">
           <span class="simple-label">Description</span>
           <div><textarea style="resize:vertical" class="form-control" id="promo_des" cols="6"></textarea></div>
        </div>

        <div class="form-group col-lg-12">
           <span class="simple-label">Days to expire</span>
            <div><input type="number" class="form-control" id="promo_days_to_expire" value="30"></div>
        </div>

        <div class="form-group col-lg-6">
            <button id="promo_btnSetImage" class="btn btn-sm btn-outline-primary">Set Image</button>
         </div>
           <div class="form-group col-lg-6">
              <div style="max-width:80px;max-height:80px;background:orange">
                 <a href="javascript:;" id="lnk-img-preview"><img id="promo_img_preview" src="" class="promo-img-preview"></img></a>
              </div>
           </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="promo_dlgPromo_btnOK">Save</button>
      </div>
    </div>
  </div>
</div>

<!-- the following one close </DIV> is added to fixed (because the following component will become Child element of promo_dlgPromo) => This need to be checked again -->
<!--end::PromoDialog-->
</div>
<script async src="{{ asset('js/PromotionComponent.js') }}"></script>