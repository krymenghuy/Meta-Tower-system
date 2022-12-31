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
<div id="_main_mobileBrandImagesComponent" style="display:none;margin:auto;width;100%;background:#fff;">
    <div style="margin:auto;width:100%;">
        <div style="width:100%;border:1.2px solid #C9D3D6;padding:10px;border-radius:3px;margin:5px 10px 10px 10px">
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-inline" style="margin-bottom:10px">
                        <select id="_mobile_brand_app" class="form-control">
                            <option value="borrower">Student/Customer App</option>
                            <option value="admin">Executive App</option>
                        </select>
                        &nbsp;
                        <button id="_mobile_brand_btnAddImage" type="button" class="btn btn-outline-success"><i
                                class="fa fa-plus"></i> Add Image</button>
                        <div style="display:none">
                            <input id="_mobile_brand_fileChooser" type="file" accept="image/*" style="display:none" />
                        </div>
                    </div>
                    <div id="bi_img_container" class="img-container">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
