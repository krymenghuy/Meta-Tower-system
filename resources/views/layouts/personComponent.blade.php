<style>
    #_main_personComponent .alert{
       padding:4px;
       font-size:0.9em;
       font-weight:bold;
    }
    #_main_personComponent .alert i{
        margin-top:3px;
        margin-right:5px;
        margin-left:5px;
    }
    .person-no-docs{
        padding:3px;
        color:grey;
        font-size:0.9em;
    }
</style>
<div id="_main_personComponent" style="display:none;">
            <div class="border-style1" style="width:100%; padding:15px;">
                  <div class="alert alert-info"><i class="fa fa-list-alt"></i> PERSONAL INFORMATION</div>  
                  <div id="_person_personal_data_view" style="width:100%">
                            <div class="row">
                                <div class="col-lg-10 col-md-10">
                                            <div class="row">
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">National ID</span>
                                                        <div><input id="_person_nid" type="text" data-field="n_id" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name</span>
                                                        <div><input type="text" data-field="first_name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name</span>
                                                        <div><input type="text" data-field="last_name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name (kh)</span>
                                                        <div><input type="text" data-field="first_name_kh" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name (kh)</span>
                                                        <div><input type="text" data-field="last_name_kh" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Sex</span>
                                                        <div><select type="text" data-field="sex" data-datatype="sex" data-required="1" class="form-control data-input person-data">
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Date of Birth</span>
                                                        <div><input type="text" data-field="date_of_birth" data-datatype="dob" data-required="1" class="form-control data-input person-data" data-select="datepicker"></div>
                                                    </div>
                                    
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Phone Number 1</span>
                                                        <div><input type="text" data-field="phone_number" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Phone Number 2</span>
                                                        <div><input type="text" data-field="phone_number1" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Address</span>
                                                        <div><input type="text" data-field="address" data-datatype="address" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Email</span>
                                                        <div><input type="text" data-field="email" data-datatype="email" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Occupation&nbsp;<a id="_person_lnkNewOccupation" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                        <div><select id="_person_occupation" data-field="occupation_id" data-datatype="string" data-required="1" class="modal-select2 data-input person-data"></select></div>
                                                    </div>
            

                                    </div>

                                </div>

                                    <div class="col-lg-2 col-md-2">
                                                <div class="profile-photo-frame">
                                                    <img id="_person_profile_img" src="" alt="" style="width:100%"></img>
                                                </div>
                                                
                                                <div class="photo-buttons">
                                                    &nbsp;<a href="#" id="_person_lnkChoosePhoto" class="btn btn-sm btn-outline-success">Choose</a>
                                                    &nbsp;&nbsp;<a href="#" id="_person_lnkDeletePhoto" class="btn btn-sm btn-outline-danger">Delete</a>
                                                    <input type="file" id="_person_fileChooser" style="display:none"/>    
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
                                                            <div><input type="text" data-field="adr_house" class="form-control data-input person-data"></div>
                                                        </div> 
                                                        <div class="form-group col-lg-1">
                                                            <span class="simple-label">Street</span>
                                                            <div><input type="text" data-field="adr_street" class="form-control data-input person-data"></div>
                                                        </div>
                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">City</span>
                                                            <div><select id="_person_adr_city" data-field="adr_city_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">District</span>
                                                            <div><select id="_person_adr_district" data-field="adr_district_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">Commune</span>
                                                            <div><select id="_person_adr_commune" data-field="adr_commune_id" class="data-input modal-select2 person-data"></select></div>
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
                                                <div><input type="text" data-field="cp_relationship" class="form-control data-input person-data"></div>
                                            </div> 
                                            <div class="form-group col-lg-6">
                                                <span class="simple-label">Contact person phone</span>
                                                <div><input type="text" data-field="cp_phone_number" class="form-control data-input person-data"></div>
                                            </div> 

                            </div>
                  </div>
                       
                  <div style="width:100%;margin-top:10px">
                            <div id="_person_employment_view" style="width:100%;">
                                            <div class="alert alert-warning" style="background-color:#80DFE0;border:none;"><i class="fas fa-user-graduate"></i> EMPLOYMENT INFORMATION &nbsp;<a href="javascript:void(0)" data-toggle="tooltip" data-tooltip="Employment History" data-placement="top"><i class="fa fa-list-alt"></i></a></div>
                                            <div id="_person_view" class="flat-box" style="margin-top:-20px;">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-3">
                                                                            <span class="simple-label">Start date</a> </span>
                                                                            <div><input  data-ffield="Employment Start Date" type="text" data-required="1"  data-field="emp_start_date" class="form-control data-input person-data" data-select="datepicker"></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-5">
                                                                            <span class="simple-label">Employment Organization &nbsp;<a id="_person_lnkNewOrg" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select id="_person_emp_org"  data-ffield="Employer organization" data-field="emp_org_id" class="modal-select2 data-input person-data"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-4">
                                                                            <span class="simple-label">Position Title</span>
                                                                            <div><input  data-ffield="Position title" type="text" id="_person_emp_position" data-field="emp_position" class="form-control data-input person-data"></div>
                                                                    </div>
                                                                   
                                                            </div>
                                            </div>
                            </div>
                    </div>


                    <div style="width:100%;margin-top:10px">
                            <div id="_person_academic_view" style="width:100%;">
                                            <div class="alert alert-warning"><i class="fas fa-user-graduate"></i> ACADEMIC INFORMATION</div>
                                            <div id="_person_view" class="flat-box" style="margin-top:-20px;">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-3">
                                                                            <span class="simple-label">Student ID</a> </span>
                                                                            <div><input type="text" data-required="1"  data-field="student_code" class="form-control data-input"></div>
                                                                    </div>
                                                                    <div class="form-group col-lg-6">
                                                                            <span class="simple-label">Program of study &nbsp;<a id="_person_lnkNewProgram" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select id="_person_program" data-field="program_id" class="form-control data-input modal-select2"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-2">
                                                                            <span class="simple-label">Cumulative GPA</span>
                                                                            <div><input type="number" id="_person_gpa" data-field="cgpa" class="form-control data-input"></div>
                                                                    </div>
                                                            </div>
                                            </div>
                            </div>
   
                           <div id="_person_documents_view" style="width:100%;display:none">
                                    <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-receipt"></i> SUPPORT DOCUMENTS &nbsp; <a id="_person_lnkAddDocument" href="#"> <i class="fa fa-plus"></i></a></div>
                                        <div id="_person_docs" class="flat-box" style="margin-top:-20px">
                                            <input type="file" id="_person_docs_input" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none"> 
                                            <table id="_person_tblDocs" class="vs-docs-table">
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Salary statment</td>
                                                        <td><div class="width:80">
                                                        <a class="person-btn-delete-doc" href="#"><i class="fa fa-times" style="color:red"></i></a>&nbsp;
                                                        <a class="person-btn-download-doc" href="#"><i class="fa fa-download" style="color:green"></i></a>&nbsp;
                                                        <a class="person-btn-open-doc" href="#"><i class="fas fa-file" style="color:grey"></i></a>
                                                        </div></td>
                                                    </tr>
                                                </tbody> 
                                            </table>         
                                        </div>
                           </div>
                   </div>

                   <div style="width:100%;position:fixed;bottom:15px;">
                            <div class="form-inline" style="float:left;margin-left:7vw">
                                <button id="_person_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id="_person_btnModify" type="button" class="vs-btn-lg vs-btn-primary" style="min-width:100px"><i class="fa fa-times"></i> Modify</button>&nbsp;
                                <button id ="_person_btnSave" type="button" class="vs-btn-lg  vs-btn-success" style="display:none;min-width:100px"><i class="fa fa-save"></i> Save</button>
                            </div>
                 </div>

            </div>
 
           
</div> 
<script  src="{{ asset('js/PersonComponent.js') }}"></script>