<style>
    .nav-tabs .nav-item .nav-link.active {
        color: white;
        background-color: #eb0909;
    }

    .nav-tabs .nav-item .nav-link {
        color: #595d6e
    }

    table.affiliate {
        border-collapse: separate;
        border-spacing: 0 1em;
    }
</style>
<div id="_main_salesAffiliatesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between shadow rounded-3 p-3 mt-3 bg-white">
        <div class=" d-flex gap-2">
            <div class="card-header border border-1 rounded-5 p-1  bg-light-gray">
                <ul class="nav nav-tabs border border-0 m-0 vs-tab-header" id="custom-tabs-one-tab" role="tablist">
                    <li class="nav-item">
                        <a class="tab-button view_sales_agent nav-link pt-2 pb-2 border border-0 rounded-5 active"
                            data-view="view_sales_agent" id="custom-tabs-one-tab" data-toggle="pill"
                            href="#custom-tabs-one-sales-agent" role="tab" aria-controls="custom-tabs-one-sales-agent"
                            aria-selected="false">
                            <span class="trans-text" data-langprop="buttons.Sales Agents"></span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="tab-button view_contact_person nav-link pt-2 pb-2 border border-0 rounded-5"
                            data-view="view_contact_person" id="custom-tabs-one-tab" data-toggle="pill"
                            href="#custom-tabs-one-contact-person" role="tab"
                            aria-controls="custom-tabs-one-contact-person" aria-selected="true">
                            <span class="trans-text" data-langprop="buttons.Contact Persens"></span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="d-flex  gap-1 ">
            <input type="text" class="form-control " id="_sale_agent_search" placeholder="Search ">
            <button id="_sale_agent_btnSearch" class="btn btn-warning text-white mx-3" type="button">
                <i class="fa fa-search"></i>
            </button>
        </div>
    </div>
    <div class="shadow rounded-3 mt-2">
        <div class="tab-content bg-grey" id="custom-tabs-one-tabContent">
            <div class="tab-pane fade show bg-grey active" id="custom-tabs-one-sales-agent" role="tabpanel"
                aria-labelledby="custom-tabs-one-sales-agent">
                <div class="d-flex justify-content-between shadow rounded-3 p-3 mt-3 mb-3 bg-white ">
                    <div class="d-flex gap-2 ">
                        <div class="d-flex flex-row ml-3 gap-2">
                            <button id="_sale_agent_btnNew" class="btn btn-primary " type="button">
                                <i class="fa fa-user-plus"></i>
                                <span class="trans-text" data-langprop="buttons.New SaleAgent"></span>
                            </button>
                        </div>

                    </div>
                    <div class="d-flex gap-2" id="_sdl_filter_fields_view_sales_agent">
                        <div class="d-flex flex-row gap2 ml-3">
                            <select id="_sale_agent_filter_type" class="modal-select2 filter-field"
                                data-field="type_from_affilliate_type">
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <select id="_sale_agent_filter_status" class="modal-select2 filter-field"
                                data-field="status_code">
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <button id="_sale_agent_btnPrint" class="btn btn-primary" type="button">
                                <i class="fa fa-print"></i>
                                <span class="trans-text" data-langprop="buttons.Print"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="_sale_agent_list" class="mt-3"></div>
            </div>
            <div class="tab-pane fade show bg-grey active " id="custom-tabs-one-contact-person" role="tabpanel"
                aria-labelledby="custom-tabs-one-tab">
                <div class="d-flex justify-content-between shadow rounded-3 p-3 mt-3 mb-3 bg-white ">
                    <div class="d-flex gap-2 ">
                        <div class="d-flex flex-row ml-3 gap2">
                            <button id="_contact_person_btnNew" class="btn btn-primary" type="button">
                                <i class="fa fa-user-plus"></i>
                                <span class="trans-text" data-langprop="buttons.New Contact Person"></span>
                            </button>
                        </div>
                    </div>
                    <div class="d-flex gap-2" id="_sdl_filter_fields_view_contact_person">
                        <div class="d-flex flex-row gap2 ml-3">
                            <select id="_contact_persen_filter_type" class="modal-select2 filter-field"
                                data-field="type_from_affilliate_type">
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <select id="_contact_person_filter_status" class="modal-select2 filter-field"
                                data-field="status_code">
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <button id="_sale_agent_btnPrint" class="btn btn-primary" type="button">
                                <i class="fa fa-print"></i>
                                <span class="trans-text" data-langprop="buttons.Print"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="_contact_person_list" class="mt-3"></div>
            </div>

        </div>
    </div>

</div>

<div class="modal fade" id="_sale_agent_dlg" tabindex="-1" role="dialog" aria-labelledby="_sale_agent_dlgTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_sale_agent_dlgTitle">Sales Agents</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" >
                <div class="row" id="_sale_agent_dlg_body">
                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="titles.ID"></label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO"
                            readonly />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name">
                    </div>


                </div>
                <div class="row">
                    <div class="form-group col-lg-3">
                        <label for="sex" class="form-label trans-text" data-langprop="titles.Sex"></label>
                        <span class="text-danger">*</span>
                        <div class="min-width-select">
                            <select class="modal-select2 data-input" data-field="sex">
                                <option value="">(Gender)</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-lg-3" id="el_agent_type">
                        <label for="agent_type" class="form-label trans-text" data-langprop="titles.SalesAgent Type"> Type</label>
                        <select class="modal-select2 data-input" data-field="agent_type">
                            <option>(Select SalesAgent Type)</option>
                            <option value="client_affiliate">client-affiliate</option>
                            <option value="freelancer">freelancer</option>
                            <option value="full_time">full-time</option>
                        </select>
                    </div>

                    <div class="form-group col-lg-3" id="el_cp_type">
                        <label for="contact_person" class="form-label trans-text" data-langprop="titles.ContactPerson Type"> </label>
                        <select class="modal-select2 data-input" data-field="cp_type">
                            <option>(Select ContactPerson Type)</option>
                            <option value="primary">primary</option>
                            <option value="secondary">secondary</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="phone_number" class="form-label trans-text"
                            data-langprop="titles.Phone Number"></label>
                        <span class="text-danger">*</span>
                        <div><input class="form-control text-primary data-input" type="number" placeholder=""
                                data-required="1" data-field="phone_number" /></div>

                    </div>

                    <div class="form-group col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                        <input type="email" class="form-control data-input" placeholder="example@gmail.com"
                            data-field="email" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="text" class="form-label trans-text" data-langprop="titles.Position" ></label>
                        <input type="position" class="form-control data-input" data-field="position_title">
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-md-12 col-lg-3">
                        <div class="d-flex align-items-center">
                            <div id="_saleAffiliate_profile_photo" style="height:165px" class="mt-2"></div>
                        </div>
                    </div>
                    <div class="form-group col-lg-9 mt-4">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <span id="_sal_agent_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-bs-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_sale_agent_dlg_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>