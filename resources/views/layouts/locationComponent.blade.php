<div id="_sttn_locationsComponent" style="width:auto;display:none;margin:15px 15px 15px">
    <div class="row">
        <div class="col-lg-6">
            <div id="_sttn_loc_countryListpanel" class="border-style1"
                style="margin-top:40px;background-color:#F6FAFA;padding:10px;height:40vw">
                <span class="py-2 trans-text" style="font-size:15px;font-weight:bold;color:green"
                    data-langprop="titles.Contries"></span>
                <a id="_sttn_loc_lnkNewCountry" href="javascript:void(0)">
                    (<i class="fa fa-plus-circle" style="color:green"></i>)
                </a>
                <table id="_sttn_loc_tblCountries" class="table fixed-body-table">
                    <thead>
                        <tr>
                            <th>Flag</th>
                            <th>Country</th>
                            <th>Nationality</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="_sttn_loc_tblCountries_body" style="max-height:350px">
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="tab-view" id="_sttn_loc_subLocationTabView">
                <div class="tab-header py-2">
                    <a href="javascript:void(0)" class="tab-button text-dark" data-viewname="cities"
                        data-target="_sttn_tabpanel_cities">
                        <span class="trans-text text-uppercase" data-langprop="titles.Cities (province)"></span>
                    </a>
                    <a href="javascript:void(0)" class="tab-button text-dark" data-viewname="districts"
                        data-target="_sttn_tabpanel_districts">
                        <span class="trans-text text-uppercase" data-langprop="titles.Districts (khan)"></span>
                    </a>
                    <a href="javascript:void(0)" class="tab-button text-dark" data-viewname="communes"
                        data-target="_sttn_tabpanel_communes">
                        <span class="trans-text text-uppercase" data-langprop="titles.Communes (sangkat)"></span>
                    </a>
                </div>
                <!--begin::tab-body-->
                <div class="tab-body bg-white">
                    <div class="tab-panel border-style1" id="_sttn_tabpanel_cities" style="height:40vw;padding:10px"
                        data-viewname="cities">
                        <a id="_sttn_loc_lnkNewCity" href="javascript:void(0)"
                            class="btn btn-outline-success btn-hover">
                            <span class="trans-text" data-langprop="titles.Add City"></span>
                        </a>
                        <table id="_sttn_loc_tblCities" class="table fixed-body-table">
                            <thead></thead>
                            <tbody id="_sttn_loc_tblCities_body" style="height:430px"></tbody>
                        </table>
                    </div>

                    <div class="tab-panel border-style1" id="_sttn_tabpanel_districts" style="height:40vw;padding:10px"
                        data-viewname="districts">
                        <div class="row">
                            <div class="col-8">
                                <select class="select2" style="width:300px; min-width:300px"
                                    id="_sttn_loc_filter_city"></select>
                            </div>
                            <div class="col-4">
                                <a id="_sttn_loc_lnkNewDistrict" class="btn btn-outline-success btn-hover"
                                    href="javascript:void(0)">
                                    <span class="text-no-wrap trans-text" data-langprop="titles.Add district"></span>
                                </a>
                            </div>
                        </div>
                        <table id="_sttn_loc_tblDistricts" class="table fixed-body-table">
                            <thead>
                                <tr>
                                    <th>District</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="_sttn_loc_tblDistricts_body" style="height:430px"></tbody>
                        </table>
                    </div>

                    <div class="tab-panel border-style1" id="_sttn_tabpanel_communes" style="height:40vw;padding:10px"
                        data-viewname="communes">
                        <div class="row">
                            <div class="form-group col-lg-4">
                                <select class="modal-select2" id="_sttn_loc_filter_city_district"></select>
                            </div>
                            <div class="form-group col-lg-4">
                                <select class="modal-select2" id="_sttn_loc_filter_district"></select>
                            </div>
                            <div class="form-group col-lg-4">
                                <a id="_sttn_loc_lnkNewCommune" href="javascript:void(0)"
                                    class="btn btn-outline-success font-weight-bolder">
                                    <span class="trans-text" data-langprop="titles.Add commune"></span>
                                </a>
                            </div>
                        </div>
                        <table id="_sttn_loc_tblCommunes" class="table fixed-body-table">
                            <thead>
                                <tr>
                                    <th>Commune (Sangkat)</th>
                                    <th>District (Khan)</th>
                                    <th>City (Province)</th>
                                </tr>
                            </thead>
                            <tbody id="_sttn_loc_tblCommunes_body" style="height:395px"></tbody>
                        </table>
                    </div>
                </div>
                <!--end::div.tab-body-->
            </div>
        </div>
    </div>
</div>

<!--CountryDialog-->
<div id="_loc_dlgCountry" class="modal fade" tabindex="-1" aria-labelledby="_loc_dlgCountry_title" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title trans-text" data-langprop="titles.New Country"></h4>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-4">
                        <div class="border rounded-3 h-100 h--frame--img" style="max-height:173px">
                            <div id="_loc_img_flag" data-field="flag" class="data-input h-100 h--frame--img--dlg"></div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="country-info">
                            <div class="country-info-item">
                                <label for="" class="simple-label">Country Name:</label>
                                <input type="text" class="form-control data-input" data-field="name"
                                    data-ffield="Country name" />
                            </div>
                            <div class="country-info-item">
                                <label for="" class="simple-label">Nationality:</label>
                                <input type="text" class="form-control data-input" data-field="nationality"
                                    data-ffield="Nationality" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="country-info-item">
                            <label for="" class="simple-label">Capital City:</label>
                            <input type="text" class="form-control data-input" data-field="capital_city"
                                data-ffield="Capital city name" />
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="country-info-item">
                            <label for="" class="simple-label">Official Language:</label>
                            <input type="text" class="form-control data-input" data-field="lang_code"
                                data-ffield="Language" />
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="country-info-item">
                            <label for="" class="simple-label">Currency Code:</label>
                            <input type="text" class="form-control data-input" data-field="currency_code"
                                data-ffield="Currency code" />
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="country-info-item">
                            <label for="" class="simple-label">Region:</label>
                            <select class="form-select data-input" data-field="region" data-ffield="Region">
                                <option value="">Select region</option>
                                <option value="Asia Pacific">Asia Pacific</option>
                                <option value="Europe">Europe</option>
                                <option value="North America">Middle East</option>
                                <option value="North America">North America</option>
                                <!-- Add more options as needed -->
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    Cancel
                </button>
                <button class="btn btn-primary btn-save-country" type="button">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>