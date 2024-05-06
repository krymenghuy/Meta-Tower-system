<style>
    td.col-brand-image {
        padding: 15px;
    }

    img.brand-img {
        width: 350px;
        height: 250px;
        margin-right: 25px;
    }

    a.mobile_brand_image-delete {
        color: red;
        margin: auto;
    }

    .img-container>div.caption {
        margin-bottom: 25px;
    }

    .img-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-grow: 1;
    }
</style>

<div id="_main_mobileBrandImagesComponent" style="display:none; padding:15px">
    <div class="w-100 border p-3 rounded-3 me-3 bg-white">
        <div class="row">
            <div class="col-lg-12">
                <div class="d-flex gap-2">
                    <div class="min-width-select">
                        <select id="_mobile_brand_app" class="modal-select2">
                            <option value="merchant">Merchant App</option>
                            <option value="driver">Driver App</option>
                            <option value="sales_agent">Sales App</option>
                        </select>
                    </div>
                    <button id="_mobile_brand_btnAddImage" type="button" class="btn btn-sm btn-outline-success">
                        <i class="fa fa-plus fs-5"></i>
                        <span>Add Image</span>
                    </button>
                </div>
                <div id="bi_img_container" class="img-container mt-3"></div>
            </div>
        </div>
    </div>
</div>