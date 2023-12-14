<style>
    img.promo-img-preview {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    img.promo-img {
        width: 200px;
        height: 200px;
        padding: 3px;
        margin-right: 25px;
    }

    .promo-title {
        font-size: 1rem;
        padding: 10px 0 15px 0;
        font-family: 'Moul';
        letter-spacing: 1px;
        line-height: 28px;
        display:block;
    }

    .mobile-promo-delete {
        color: red;
    }

    .promo-des-text {
        font-size: 1rem;
        text-indent: 15px;
        text-align: justify;
        font-family: 'Khmer OS Battambang';
        line-height: 25px;
    }
</style>

<div id="_main_promotionComponent" style="display:none;padding:15px">
    <div class="border p-3 rounded-3 bg-white">
        <div class="row">
            <div class="col-lg-12">
                <div class="d-flex gap-2">
                    <div class="min-width-select">
                        <select id="_mobile_promo_app" class="modal-select2">
                            <option value="merchant">Merchant Mobile App</option>
                        </select>
                    </div>
                    <button id="promo_btnNewPromo" type="button" class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-plus fs-5"></i>
                        <span class="text-nowrap">New Promotion</span>
                    </button>
                    <div style="display:none">
                        <input id="_mobile_promo_fileChooser" type="file" accept="image/*" style="display:none" />
                    </div>
                </div>
                <div id="promo_img_container" class="img-container gap-3 mt-3"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="promo_dlgPromo" tabindex="-1" role="dialog" aria-labelledby="promo_dlgPromoTitle" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="promo_dlgPromoTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                
                <div class="form-group col-lg-12">
                    <span class="simple-label">Promotion Title</span>
                    <input type="text" class="form-control" id="promo_title">
                </div>
                <div style="display:none" class="form-group col-lg-12">
                    <span class="simple-label">Category</span>
                    <div class="min-width-select max-width-select">
                        <select id="promo_category" type="text" class="modal-select2">
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>
                <div class="form-group col-lg-12">
                    <span class="simple-label">Description</span>
                    <textarea style="resize:vertical;height:200px"  class="form-control" id="promo_des"></textarea>
                </div>
                <div class="form-group col-lg-6">
                    <span class="simple-label">Days to Expire</span>
                    <div class="d-flex gap-2">
                       <input type="number" class="form-control" id="promo_days_to_expire">
                       <span class="fw-semibold text-center p-1">days</span>
                    </div>
                </div>
                
                <div class="form-group col-lg-6">
                    <button id="promo_btnSetImage" class="btn btn-sm btn-outline-primary">Set Image</button>
                    <div class="bg-warning" style="max-width:80px;max-height:80px;">
                        <a href="javascript:void(0)" id="lnk-img-preview">
                            <img id="promo_img_preview" src="" class="promo-img-preview" />
                        </a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        <span>Cancel</span>
                    </button>
                    <button type="button" class="btn btn-primary" id="promo_dlgPromo_btnOK">
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>