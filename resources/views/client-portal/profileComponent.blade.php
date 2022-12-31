<style>
    .vs-docs-table td {
        padding: 5px;
    }

    .profile-photo-frame {
        border-radius: 3px;
        border: 1px solid grey;
        height: 80%;
        padding: 5px;
        margin-left: 5px;
    }

    .photo-buttons {
        margin-top: 10px;
        height: 20%;
    }

    #_bor_profileComponent .simple-label {
        font-size: 0.8em;
        text-transform: uppercase;
    }

    .address-box {
        display: block;
        width: 100%;
        padding: 10px;
        border-radius: 3px;
        background: #DFF4F7;
    }

    #_bor_profileComponent .alert {
        padding: 4px;
        font-size: 0.9em;
        font-weight: bold;
    }

    #_main_loanAppComponent .alert i {
        margin-top: 3px;
        margin-right: 5px;
        margin-left: 5px;
    }

    .vs-current-address-title {
        color: grey;
        display: inline-block;
        padding: 3px;
    }

    .loanapp-no-docs {
        padding: 3px;
        color: grey;
        font-size: 0.9em;
    }

</style>
<div id="_bor_profileComponent" style="display:none;">
    <div class="container pt-3" style="overflow:hidden">
        <div class="alert alert-info"><i class="fa fa-list-alt"></i> &nbsp;PERSONAL INFORMATION</div>
        <div id="_profile_personal_data_view" style="width:100%">
            <div class="row">
                <div class="col-lg-10 col-md-10">
                    <div class="row">
                        <div class="form-group col-lg-3">
                            <span class="simple-label">National ID</span>
                            <div><input id="_profile_nid" type="text" data-field="n_id" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>
                        <div class="form-group col-lg-3">
                            <span class="simple-label">First Name</span>
                            <div><input type="text" data-field="first_name" data-datatype="firstname" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Last Name</span>
                            <div><input type="text" data-field="last_name" data-datatype="lastname" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">First Name (kh)</span>
                            <div><input type="text" data-field="first_name_kh" data-datatype="firstname"
                                    data-required="1" class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Last Name (kh)</span>
                            <div><input type="text" data-field="last_name_kh" data-datatype="lastname" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Sex</span>
                            <div><select type="text" data-field="sex" data-datatype="sex" data-required="1"
                                    class="form-control data-input person-data">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Date of Birth</span>
                            <div><input type="text" data-field="date_of_birth" data-datatype="dob" data-required="1"
                                    class="form-control data-input person-data" data-select="datepicker"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Phone Number 1</span>
                            <div><input type="text" data-field="phone_number" data-datatype="phone" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Phone Number 2</span>
                            <div><input type="text" data-field="phone_number1" data-datatype="phone" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Address</span>
                            <div><input type="text" data-field="address" data-datatype="address" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Email</span>
                            <div><input type="text" data-field="email" data-datatype="email" data-required="1"
                                    class="form-control data-input person-data"></div>
                        </div>

                        <div class="form-group col-lg-3">
                            <span class="simple-label">Occupation&nbsp;<a id="_profile_lnkNewOccupation"
                                    href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                            <div><select id="_profile_occupation" data-field="occupation_id" data-datatype="string"
                                    data-required="1" class="modal-select2 data-input person-data"></select></div>
                        </div>


                    </div>

                </div>

                <div class="col-lg-2 col-md-2">
                    <div class="profile-photo-frame">
                        <img id="_profile_profile_img" src="" alt="" style="width:100%"></img>
                    </div>

                    <div class="photo-buttons" style="display:none">
                        &nbsp;<a href="#" id="_profile_lnkChoosePhoto" class="btn btn-sm btn-outline-success">Choose</a>
                        &nbsp;&nbsp;<a href="#" id="_profile_lnkDeletePhoto"
                            class="btn btn-sm btn-outline-danger">Delete</a>
                        <input type="file" id="_profile_fileChooser" style="display:none" />
                    </div>

                </div>

            </div>

            <div class="address-box">
                <div style="margin-top:-10px">
                    <span class="vs-current-address-title">Current address</span>
                </div>
                <div class="row">
                    <div class="form-group col-lg-1">
                        <span class="simple-label">House#</span>
                        <div><input type="text" data-field="adr_house" class="form-control data-input person-data">
                        </div>
                    </div>
                    <div class="form-group col-lg-1">
                        <span class="simple-label">Street</span>
                        <div><input type="text" data-field="adr_street" class="form-control data-input person-data">
                        </div>
                    </div>
                    <div class="form-group col-lg-2">
                        <span class="simple-label">City</span>
                        <div><select id="_profile_adr_city" data-field="adr_city_id"
                                class="data-input modal-select2 person-data"></select></div>
                    </div>

                    <div class="form-group col-lg-2">
                        <span class="simple-label">District</span>
                        <div><select id="_profile_adr_district" data-field="adr_district_id"
                                class="data-input modal-select2 person-data"></select></div>
                    </div>

                    <div class="form-group col-lg-2">
                        <span class="simple-label">Commune</span>
                        <div><select id="_profile_adr_commune" data-field="adr_commune_id"
                                class="data-input modal-select2 person-data"></select></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-lg-3">
                    <span class="simple-label">Contact person name</span>
                    <div><input type="text" data-field="cp_name" class="form-control data-input person-data"></div>
                </div>

                <div class="form-group col-lg-3">
                    <span class="simple-label">Relationship</span>
                    <div><input type="text" data-field="cp_relationship" class="form-control data-input person-data">
                    </div>
                </div>
                <div class="form-group col-lg-6">
                    <span class="simple-label">Contact person phone</span>
                    <div><input type="text" data-field="cp_phone_number" class="form-control data-input person-data">
                    </div>
                </div>

            </div>
        </div>

        <div style="width:100%;margin-top:10px">
            <div id="_profile_academic_view" style="width:100%;">
                <div class="alert alert-warning"><i class="fas fa-user-graduate"></i> &nbsp; ACADEMIC INFORMATION</div>
                <div id="_profile_view" class="flat-box" style="margin-top:-20px;">
                    <div class="row">
                        <div class="form-group col-lg-3">
                            <span class="simple-label">Student ID</a> </span>
                            <div><input type="text" data-required="1" data-field="student_code"
                                    class="form-control data-input"></div>
                        </div>
                        <div class="form-group col-lg-6">
                            <span class="simple-label">Program of study &nbsp;<a id="_profile_lnkNewProgram"
                                    href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                            <div><select id="_profile_program" data-field="program_id"
                                    class="form-control data-input modal-select2"></select></div>
                        </div>

                        <div class="form-group col-lg-2">
                            <span class="simple-label">Cumulative GPA</span>
                            <div><input type="number" id="_profile_gpa" data-field="cgpa"
                                    class="form-control data-input"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="_profile_documents_view" style="width:100%;display:none">
                <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-receipt"></i> SUPPORT DOCUMENTS
                    &nbsp; <a id="_profile_lnkAddDocument" href="#"> <i class="fa fa-plus"></i></a></div>
                <div id="_profile_docs" class="flat-box" style="margin-top:-20px">
                    <input type="file" id="_profile_docs_input"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style="display:none">
                    <table id="_profile_tblDocs" class="vs-docs-table">
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Salary statment</td>
                                <td>
                                    <div class="width:80">
                                        <a class="person-btn-delete-doc" href="#"><i class="fa fa-times"
                                                style="color:red"></i></a>&nbsp;
                                        <a class="person-btn-download-doc" href="#"><i class="fa fa-download"
                                                style="color:green"></i></a>&nbsp;
                                        <a class="person-btn-open-doc" href="#"><i class="fas fa-file"
                                                style="color:grey"></i></a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div style="width:100%;position:fixed;right:15;bottom:15px;display:none;">
            <div class="form-inline" style="float:right;margin-right:13vw">
                <button id="_profile_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i
                        class="fa fa-times"></i> Close</button>&nbsp;
                <button id="_profile_btnSave" type="button" class="vs-btn-lg  vs-btn-primary" style="min-width:100px"><i
                        class="fa fa-save"></i> Save</button>
            </div>
        </div>

    </div>


</div>
<script src="{{ asset('js/borrower/ProfileComponent.js') }}"></script>
