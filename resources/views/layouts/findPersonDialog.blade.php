<!--begin::FindPersonDialog-->
<div class="modal fade" id="dg_dlgFindPerson" tabindex="-1" role="dialog" aria-labelledby="dg_dlgFindPersonTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="dg_dlgFindPersonTitle">Find Person</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-lg-6">
                        <input class="form-control" type="text" id="dg_person_search"
                            placeholder="id, name, phone number">
                    </div>
                    <div class="col-lg-6">
                        <button type="button" id="dg_btnFindPerson" class="btn btn-primary"><i
                                class="fa fa-search"></i></button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div style="height:15px"></div>
                        <span style="font-weight:bold;font-size:1.3em">Looking for someone?</span>
                        <div class="div-line" style="width:50%;border-color:green"></div>
                        <div id="dg_tblPersons_wrapper">
                            <table id="dg_tblPersons" class="table fixed-body-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody id="dg_tblPersons_body" style="height:250px"></tbody>
                            </table>
                        </div>
                        <div><span style="font-size:1.3em;color:green;font-weight:bold" id="dg_lblInfo">No Person
                                Found!</span></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    id="dg_findperson_btnClose">Cancel</button>
                <button type="button" class="btn btn-primary" id="dg_btnChoosePerson">OK</button>
            </div>
        </div>
    </div>
</div>
<!--end::FindPersonDialog-->
