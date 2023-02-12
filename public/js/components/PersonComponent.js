//begin:: PersonComponent (New Applicant / Modify Applicant)
 let PersonComponent = new function(){
        let mThis = this;
        this.elScreenTitle = $('#screen_title');
        this.self = $('#_main_personComponent');
        this.base_url = $('#__base_url').val();
        this.btnSave = $('#_person_btnSave');
        this.btnModify = $('#_person_btnModify');

        //Hide Save button on first load
        mThis.btnSave.hide();

        this.btnClose = $('#_person_btnClose');
         
        this.elNID = $('#_person_nid');

        this.imgProfilePhoto = $('#_person_profile_img');
        this.fileChooser = $('#_person_fileChooser');
        this.btnChoosePhoto = $('#_person_lnkChoosePhoto');
        this.btnDeletePhoto = $('#_person_lnkDeletePhoto');
        
        this.fileInput_docs = $('#_person_docs_input');
        this.lnkAddDoc = $('#_person_lnkAddDocument');
        this.tblDocs = $('#_person_tblDocs');

        this.elCity = $('#_person_adr_city');
        this.elDistrict = $('#_person_adr_district');
        this.elCommune = $('#_person_adr_commune');
        
        this.elRequestType = $('#_person_request_type');
        this.elActiveLoan = $('#_person_active_loan');

        this.elLoanType = $('#_person_loan_type');
        this.elLoanPurpose = $('#_person_purpose');
        this.elPaybackOption = $('#_person_payback_option');
        this.elOccupation = $('#_person_occupation');
        this.lnkNewOccupation = $('#_person_lnkNewOccupation');
        this.lnkNewPurpose = $('#_person_lnkNewPurpose');
        //sub views such as Acadmeic view, Income View, Attachement or Documents view
        this.personal_data_view = $('#_person_personal_data_view');
        this.employment_info_view = $('#_person_employment_view');

        this.academic_view = $('#_person_academic_view');
        this.documents_view = $('#_person_documents_view');
        this.income_view = $('#_person_income_view');
        this.request_view = $('#_person_reqiest_view');

        //elements on Academic view
        this.lnkNewProgram = $('#_person_lnkNewProgram');
        this.elProgram = $('#_person_program');
        this.lnkNewOrg = $('#_person_lnkNewOrg');
        //this.elGPA = $('#_person_gpa');
     
        this.elOrg = $('#_person_emp_org');

        //elments on Request View
        this.elRequestAmount = $('#_person_request_amount');
        this.elApprovedAmount = $('#_person_approved_amount');
        this.elEstimatedMonthlyIncome = $('#_person_estimated_monthly_income');
        this.elRemarks= $('#_person_remarks');
         
        this.loadDistricts =(city_id,id=null)=>{
             
                    let p = {'city_id':city_id};
                    post_ajax(`${mThis.base_url}/api/location/districts`,p,(items)=>{
                        if(items){
                            CommonLib.setComboItems(mThis.elDistrict,items,'id','name',id);
                            mThis.elDistrict.val(id).trigger('change');
                        }
                    });
        }

        this.loadCommunes =(district_id,id)=>{
            let p = {'district_id':district_id};
                    post_ajax(`${mThis.base_url}/api/location/communes`,p,(items)=>{
                        if(items){
                            CommonLib.setComboItems(mThis.elCommune,items,'id','name',id);
                            mThis.elCommune.val(id).trigger('change');
                        }
                    });
        }

        this.getForm_options = (def,onFinish)=>{
           if(!def) def ={};

                    post_ajax(`${mThis.base_url}/api/loan-application/form-options`,null,(d)=>{
                        if(d){
                            d.cities = StringSanitizer.sanitizeObject(d.cities);
                            d.programs= StringSanitizer.sanitizeObject(d.programs);
                            //d.gpa_options= StringSanitizer.sanitizeObject(d.gpa_options);
                            d.occupations= StringSanitizer.sanitizeObject(d.occupations);
                            d.purposes= StringSanitizer.sanitizeObject(d.purposes);

                               //employment related options
                               d.industries= StringSanitizer.sanitizeObject(d.industries);
                               d.organizations = StringSanitizer.sanitizeObject(d.organizations);
                               d.positions = StringSanitizer.sanitizeObject(d.positions); 


                            CommonLib.setComboItems(mThis.elCity,d.cities,'id','city_name',def.city_id);
                            CommonLib.setComboItems(mThis.elProgram,d.programs,'id','name',def.program_id);   
                            CommonLib.setComboItems(mThis.elOccupation,d.occupations,'id','occupation',def.occupation_id);
  
                             CommonLib.setComboItems(mThis.elOrg,d.organizations,'id','org_name',def.organization_id);

                            if(def.program_id>0) mThis.elProgram.trigger('change');
                            if(def.occupation_id>0) mThis.elOccupation.trigger('change');
                            if(def.city_id>0) mThis.elCity.trigger('change');

                            mThis.form_options = d;
                            onFinish();
                        }
                    });
               
        }
   
        this.loadOccupations = (def)=>{
            if(!def) def = {};
            post_ajax(`${mThis.base_url}/api/settings/occupations`,null,(items)=>{
                if(items){
                    items = StringSanitizer.sanitizeObject(items);  
                    CommonLib.setComboItems(mThis.elOccupation,items,'id','occupation',def.occupation_id);
                    if(def.occupation_id>0) mThis.elOccupation.trigger('change');
                }
            });
        }
 
        this.loadProgramOptions = (def)=>{
            if(!def) def = {};
            post_ajax(`${mThis.base_url}/api/settings/program-options`,null,(res)=>{
                if(res){
                    if(res.programs) res = res.programs; 
                    items = StringSanitizer.sanitizeObject(res);
                    CommonLib.setComboItems(mThis.elProgram,res,'id','program_name',def.program_id);
                    if(def.program_id>0) mThis.elProgram.val(def.program_id).trigger('change'); 
                }
            });
        }

        //d = {'personal_data':{} ,'academic_data':{} }
        this.setPersonalData =(d)=>{
           if (!d) return;
           if(!d.personal_data)
           {
                mThis.person_id = null;
                mThis.person_id = null;
                mThis.imgProfilePhoto.prop('src','');
                //mThis.displayDocuments([]);   
           } 
 
                    let personal_data = StringSanitizer.sanitizeObject(d.personal_data,null,['email','image_url']);
                    let academic_data = StringSanitizer.sanitizeObject(d.academic_data);
                    if(!personal_data) personal_data={};
                    if(!academic_data) academic_data={};
                     
                    mThis.personal_data_view.find('.data-input').each(function(){
                        let el = $(this);
                        let f = el.data('field');
                        if (f !='n_id') el.val(personal_data[f]);
                        //make sure sureu elCity's change event is triggered before district's change event is triggered
                        if(el.is('select')){
                            mThis.preset_district_id = personal_data.adr_district_id;
                            mThis.preset_commune_id = personal_data.adr_commune_id;
                            el.trigger('change'); 
                        } 
                    }); 

                    //display profile photo
                    mThis.imgProfilePhoto.prop('src',DUtil.escapeHtml(personal_data.image_url));
                    //Store person_id for the sake detecting person_id when uploading image (profile picture)
                    mThis.person_id = personal_data.id;

                    mThis.academic_view.find('.data-input').each(function(){
                        let el = $(this);
                        let f = el.data('field');
                        el.val(academic_data[f]); 
                        if(el.is('select')) el.trigger('change'); 
                    }); 
              
        }

        this.init = ()=>{
            if (!AuthManager.allowed(219,true)) {
               mThis.isReadOnly = true;
               mThis.btnModify.hide();
               mThis.btnSave.hide();
            }else {
                mThis.btnModify.show();
            }

            mThis.elNID.on('blur',(e)=>{
              let nid = mThis.elNID.val();
                    if(!mThis.elNID.prop('readonly')){
                            p = {'nid':nid};
                            post_ajax(`${mThis.base_url}/api/loan-application/person-info`,p,(d)=>{
                                if(d)
                                mThis.setPersonalData(d);
                            });
                    } 
            });

            //Close and back from "New Applicant" view to "Applicant List" view
            mThis.btnClose.on('click',(e)=>{
                e.preventDefault();
                mThis.back();
            });
 
            mThis.lnkNewOrg.on('click',function(e){
               e.preventDefault();
               let op = {'title':"New Organization","form_options":{'industries':mThis.form_options.industries}};

               NewOrgDialog.show(op,(p)=>{
                   if(p){
                      mThis.form_options.organizations.unshift({'id':p.org_id,'org_name':p.name});
                      mThis.refreshOrgList(mThis.form_options.organizations,p.org_id);       
                   }
               });

            });

            mThis.lnkNewProgram.on('click',(e)=>{
                e.preventDefault();
                let op = {'title':'New Study Program'};
                ProgramDialog.show(op,(p)=>{
                   if(p){
                       mThis.loadProgramOptions({'program_id':p.program_id});
                   }
                });   
            });

            mThis.lnkNewOccupation.on('click',(e)=>{
              e.preventDefault();
              let op = {'title':'New Occupation','default_value':null,'dataLabel':'Occupation name'};
              InputBox1.show(op,(d)=>{
                 if(d){
                     let p = {'name':d};
                     post_ajax(`${mThis.base_url}/api/settings/save-occupation`,p,(d)=>{
                         if(d.status=='OK'){
                             mThis.loadOccupations({'occupation_id':d.id});
                         }else cv_interact.alert(d.error_message,'','error');
                     });
                 }
              });
            });
  
            mThis.btnModify.on('click',function(e){
                e.preventDefault();
                 if (!AuthManager.allowed(219,true)) return;
                mThis.self.find('.data-input').each(function(){  
                   let el = $(this);
                   if(el.is('select'))
                     el.prop('disabled',false); 
                   else 
                     el.prop('readOnly',false); 
                });

                mThis.btnModify.hide();
                mThis.btnSave.show();
            });

            // //save Applicant info (either Create or Update)
            mThis.btnSave.on('click',(e)=>{
                e.preventDefault();
                let p = mThis.getData();
                
                if (!p || p.has_error) {
                    cv_interact.alert('Application data is not yet acceptable! Please fill in all required fields!','','warning');
                    return;
                }
                 
                post_ajax(`${mThis.base_url}/api/person/save`,p,(res)=>{
                    if(res.status =='OK'){
                        //show previous view
                        mThis.back();
                    }else cv_interact.alert(res.error_message);
                });
            });
 
            mThis.self.on('change','.person-data',function(e){
                e.preventDefault();
                if(mThis.form_ready){
                    mThis.personal_data_changed = true; 
                }
            });

            mThis.elCity.on('change',function(e){
                e.preventDefault();
                 /** mThis.preset_district_id is value of d.adr_district_id on mThis.setData() and mThis.setApplicantInfo  **/
                 let a = mThis.preset_district_id;
                 mThis.loadDistricts($(this).val(),a);
            });

            mThis.elDistrict.on('change',function(e){
                e.preventDefault();
                let a = mThis.preset_commune_id;
                mThis.loadCommunes($(this).val(),a);
            });

            //####begin:: Process document upload
               let doc_reader = new FileReader();
                mThis.lnkAddDoc.on('click',(e)=>{
                    e.preventDefault();
                    mThis.fileInput_docs.trigger('click');
                });

                mThis.tblDocs.on('click','.person-add-doc',function(e){
                    e.preventDefault();
                    mThis.fileInput_docs.trigger('click');
                });

                mThis.tblDocs.on('click','.person-btn-delete-doc',function(e){
                        e.preventDefault();
                        let tr = $(this).closest('tr');
                        let doc_id = tr.data('id');
                        if (mThis.person_id > 0) {
                                        let p ={'loan_app_id':mThis.person_id,'id':doc_id};
                                        cv_interact.confirm('Delete this document?','Delete Document',(e)=>{
                                            if(e){
                                                post_ajax(`${mThis.base_url}/api/loan-application/delete-document`,p,(res)=>{ 
                                                    if(res.status =='OK'){
                                                        
                                                    //begin:: remove document from array mThis.documents
                                                            let i=0,c;
                                                            let temp_id = tr.data('tempid');
                                                            let new_list =[];
                                                            if(temp_id>0){
                                                                do{
                                                                    c = mThis.documents[i];
                                                                    if(!c) break;
                                                                    if(c.temp_id != temp_id) new_list.push(c);
                                                                    i++;
                                                                }while(c);
                                                                mThis.documents = new_list;
                                                            }
                                                        
                                                    //end:: remove document from array mThis.documents
                                                    if(!tr.siblings[0]) mThis.displayDocuments();
                                                    else tr.remove();
                                                    }else cv_interact.alert(err,'','error');
                                                });
                                            }
                                        },'Delete',null,'delete');
                        } else {
                            //this case: mThis.person_id is NULL => this form is "New Application" mode
                         
                            tr.remove();
                            if (mThis.tblDocs.find('tr').length ==0) mThis.displayDocuments();
                            
                        } 
            
                    });
 
                    mThis.fileInput_docs.on('change',(e)=>{
                        //allow maximum 50 KB size of image
                        let _max_size = 5000; 
                        let files = mThis.fileInput_docs.prop('files');
                        
                        //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
                        let file = files[0];
                        //Store file for use in doc_reader.onload() event
                        mThis.selected_file =file;

                        if (file) {

                            //if (file.type.match(/^text\/.*/)) {  
                                let _size = file.size;
                                let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
                                let i=0;
                                while(_size>900){_size/=1024;i++;}
                                let sizeInfo = {'size':(Math.round(_size*100)/100),'unit':fSExt[i] };
                                
                                if (sizeInfo.size >_max_size && sizeInfo.unit =='KB') { 
                                    cv_interact.alert(`File is too large. Max size allowed is ${_max_size}`);
                                } else {
                                    doc_reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                                     
                                    mThis.fileInput_docs.val(null);
                                }
                                

                            // } else {
                            //     cv_interact.alert('The chosen image file is invalid!','','error');
                            // }

                        }              
                    });

                    doc_reader.onload = function (e) {
                        e.preventDefault();
                        if(!mThis.selected_file) mThis.selected_file ={};
                        if(!mThis.selected_file.name) mThis.selected_file.name = 'file name';

                        // console.log(e.total); // file size 
                        //Sanitize photo data or photo stream
                        //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
                        let file_content = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

                        /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
                        let base64result = file_content.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

                        /*Get file extention or fileType from the base64 String */
                        let file_type = file_content.split('/')[1].split(';')[0];
                        /* make file extension to 3 characters only */
                        if (file_type == 'jpeg') file_type = 'jpg'; 
                        /* Display the selected photo image */
                        //mThis.imgProfilePhoto.prop('src', photoData); // putting file in dom without server upload.

                        if (mThis.person_id >0){
                                let p = {
                                    'description':mThis.selected_file.name, 
                                    'file_content': base64result, /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                                    'file_type': file_type,
                                    'loan_app_id':mThis.person_id
                                };
                                
                                post_ajax(`${mThis.base_url}/api/loan-application/save-document`,p,function(result) {
                                    if (typeof result =='string') alert(result); 
                                    if (result.status =='OK')
                                    {
                                        let item = {'id':result.id,'description':mThis.selected_file.name};
                                        //Add newly uploaded file to attachment table| display newly uploaded document in the table
                                        mThis.addDocumentItem(item);
                                        cv_interact.alert('Document uploaded!');
                                    }
                                    else cv_interact.alert(result.error_message,'','error');
                                    //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                                    mThis.fileInput_docs.val(null);
                                });
                        }else{
                            
                            //Add newly uploaded file to attachment table| display newly uploaded document in the table
                                if (!mThis.document_count) mThis.document_count =0;
                                mThis.document_count++; //doc count is used as temp_id for deleting document from array mThis.documents
                                let item = {'id':null,'file_type':file_type,'description':mThis.selected_file.name,'temp_id': mThis.document_count,'file_content':base64result};
                                mThis.addDocumentItem(item);
                                if(!mThis.documents) mThis.documents=[];
                                mThis.documents.push(item);

                            //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                            mThis.fileInput_docs.val(null);
                        }   
                    };
            //###end:: process document upload
             


           //##begin:: PROCESS PHOTO UPLOAD
                    //image file reader image_reader  
                    let reader = new FileReader();
                    mThis.btnChoosePhoto.on('click',(e)=>{
                        e.preventDefault();
                        mThis.fileChooser.trigger('click');
                    });

                    mThis.btnDeletePhoto.on('click',(e)=>{
                        e.preventDefault();
                        let p ={'person_id':mThis.person_id};
                        cv_interact.confirm('Delete this photo?','Delete Photo',(e)=>{
                            if(e){
                                post_ajax(`${mThis.base_url}/api/loan-application/delete-profile-picture`,p,(err)=>{
                                    if(!err){
                                        mThis.imgProfilePhoto.prop('src',null);
                                    }else cv_interact.alert(err,'','error');
                                 });
                            }
                        },'Delete',null,'delete');
                       
                    });
        
                    mThis.fileChooser.on('change',(e)=>{
                        //allow maximum 50 KB size of image
                        let _max_size = 3000; 
                        let files = mThis.fileChooser.prop('files');
                        //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
                        let file = files[0];
                        if (file) {
                            if (file.type.match(/^image\/.*/)) {
                                
                                let _size = file.size;
                                let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
                                let i=0;
                                while(_size>900){_size/=1024;i++;}
                                let sizeInfo = {'size':(Math.round(_size*100)/100),'unit':fSExt[i] };
                                
                                if (sizeInfo.size >_max_size && sizeInfo.unit =='KB') { 
                                    cv_interact.alert(`File is too large. Max size allowed is ${_max_size}`);
                                } else {
                                    reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                                    mThis.fileChooser.val(null); //reset it to NULL so that user can select the same file again
                                }
                                

                            } else {
                                cv_interact.alert('The chosen image file is invalid!','','error');
                            }

                        }              
                    });

                          
                            reader.onload = function (e) {
                                    e.preventDefault();	
                                    // console.log(e.total); // file size 
                                    //Sanitize photo data or photo stream
                                    //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
                                    let photo_data = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

                                    /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
                                    let base64result = photo_data.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

                                    /*Get file extention or fileType from the base64 String */
                                    let file_type = photo_data.split('/')[1].split(';')[0];
                                    if (file_type == 'jpeg') fileType = 'jpg'; /* make file extension to 3 characters only */
                                    /* Display the selected photo image */
                                    //mThis.imgProfilePhoto.prop('src', photoData); // putting file in dom without server upload.
 
                                    if (mThis.person_id>0 || mThis.person_id> 0){
                                            let p = {
                                                'photo_data': base64result, /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                                                'file_type': file_type,
                                                'person_id':mThis.person_id,
                                                'loan_app_id':mThis.person_id 
                                            };
                                            
                                            post_ajax(`${mThis.base_url}/api/loan-application/save-profile-picture`,p,function(result) {
                                                if (typeof result =='string') alert(result); 
                                                if (result.status =='OK')
                                                {
                                                    mThis.imgProfilePhoto.prop('src',photo_data);
                                                    cv_interact.alert('Photo uploaded');
                                                }
                                                else cv_interact.alert(result.error_message,'','error');
                                                //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                                                mThis.fileChooser.val(null);
                                            });
                                    }else{
                                       
                                        mThis.imgProfilePhoto.prop('src',photo_data);
                                        mThis.photo_data = base64result;
                                        mThis.photo_file_type = fileType;
                                         //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                                         mThis.fileChooser.val(null);
                                    }   
                            };
                //##end:: PROCESS PHOTO UPLOAD
                 
        }
  
        this.displayDocuments =(items=[])=>{
            let tbody = mThis.tblDocs.find('tbody');
            tbody.empty();
            if (!items || !items[0]){
                tbody.append(`<tr class="person-no-doc"><td colspan="2"><div class="person-no-docs">No attached documents. &nbsp;<a href="#" class="person-add-doc">Add document</a></div></td></tr>`);
                return;
            }

            let i=0,c;
            do{
                c = items[i];
                if(!c) break;
                 mThis.addDocumentItem(c); 
                i++;
            }while(c);
        }

        this.addDocumentItem = (item)=>{
            if(!item) return;
          let tbody = mThis.tblDocs.find('tbody');
        //   if(!mThis.document_count) mThis.document_count = 0;
        //   mThis.document_count++;
          tbody.append(`<tr data-id="${item.id}" data-tempid="${item.temp_id}">
            <td>${item.description}</td>
            <td>
                <div class="width:80">
                    <a class="person-btn-delete-doc" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i></a>&nbsp;
                    <a class="person-btn-download-doc" href="javascript:void(0)"><i class="fa fa-download" style="color:green"></i></a>&nbsp;
                    <a class="person-btn-open-doc" href="javascript:void(0)"><i class="fas fa-file" style="color:#81D5F9;"></i></a>
                </div>
            </td>
           </tr>`);
          
           tbody.find('tr.person-no-doc').remove();
        }

        this.getPersonInfo = (id,onFinish)=>{
            let p ={'person_id':id};
            post_ajax(`${mThis.base_url}/api/person/profile`,p,(d)=>{
               
               if(d){
                let documents= [];
                let income_items = [];
                let image_url = d.image_url;
                d.image_url = null;
                if (d.documents){
                    documents = StringSanitizer.sanitizeObject(d.documents);
                    d.documents = null;
                } 
                if (d.income_items){
                    income_items = StringSanitizer.sanitizeObject(d.income_items);
                    $d.income_items = null;
                }
                
                d = StringSanitizer.sanitizeObject(d,null,['email']);
                d.documents = documents;
                d.income_items = income_items;
                d.image_url = image_url;
               }
                onFinish(d);
            });
        }

        this.refreshOrgList = (d,org_id)=>{
            CommonLib.setComboItems(mThis.elOrg,d,'id','org_name',true,'select organization',org_id);
            if(org_id>0) mThis.elOrg.trigger('change');
        }

        this.getData=()=>{
            let p = {'person_id':mThis.person_id};
            let has_error = false;
            let personal_data = {'person_id':mThis.person_id};
 
            mThis.personal_data_view.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                if(el.data('error')==1){
                    has_error =true;
                    return false;
                }
                personal_data[f]= el.val();
            });
             
            //Combine employment_info together with personal_data
            mThis.employment_info_view.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                personal_data[f]= el.val();
            });

            //On fileInput.on('change',{ /**  mThis.photoData = something => photo data changed **/ })
            personal_data.photo_data = mThis.photo_data;
            personal_data.file_type = mThis.photo_file_type;
            
            if (has_error) return null;

            p.personal_data = personal_data;
            
            //begin:: get academic-info
                let academic_data ={};
                has_error = false;
                mThis.academic_view.find('.data-input').each(function(){
                    let el = $(this);
                    let f = el.data('field');
                    if(el.data('error')==1){
                        has_error =true;
                        return false;
                    }
                    academic_data[f]= el.val();
                });

                if (has_error) return null;
                p.academic_data = academic_data;
            //end:: get academic info
 
            p.documents = mThis.documents?mThis.documents:[]; 
            
            return p;

        }

        this.setData = (d,readOnly=false)=>{  
          mThis.form_ready = false;
          mThis.person_id = null;
          mThis.person_id = null;
          mThis.photo_data = null;
          mThis.readOny = false;

          if(!d) {
            d ={};
            mThis.imgProfilePhoto.prop('src',null);
          }

            mThis.self.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                el.val(d?d[f]:null); 
                  
                if(el.is('select')){
                    mThis.preset_district_id = d.adr_district_id;
                    mThis.preset_commune_id = d.adr_commune_id;
                    el.trigger('change');
                    el.prop('disabled',readOnly);  
                }else{
                    el.prop('readOnly',readOnly); 
                }
            });

            if(d.image_url) mThis.imgProfilePhoto.prop('src',DUtil.escapeHtml(d.image_url));
            mThis.person_id = d.person_id?d.person_id:null;
         
            mThis.displayDocuments(d.documents);
            //if (d.income_items) mThis.displayIncomes(d.income_items);
            if(AuthManager.allowed(219,true)){
                if (readOnly){
                    mThis.btnModify.show();
                    mThis.btnSave.hide();
                } else{
                    mThis.btnModify.hide();
                    mThis.btnSave.show();
                } 

            }
            else {
                mThis.btnModify.hide();
                mThis.btnSave.hide();
            }
 
            mThis.person_id = d.person_id;
            mThis.form_ready = true; 
            mThis.readOnly = readOnly;
            mThis.personal_data_changed = false;
        }

        //option ={title,person_id}
        this.show = (option)=>{
            if(!option) option={};
            mThis.previous_view = option.previous_view;
            mThis.previous_view_option = option.previous_view_option;

            //This is to determine if the Person's Profile is read only
            mThis.isReadOnly = AuthManager.allowed(219,true);

            if(option.person_id > 0) {
                if (!option.title) option.title ="Modify Personal Profile";
            }else{
                if(!option.title) option.title ='New Person';
            }
 
            Validator.clearErrors(mThis.self);
            
            mThis.getForm_options(null,()=>{
                
                if(option.person_id > 0){
                    mThis.getPersonInfo(option.person_id,(d)=>{
                        if (!d) cv_interact.alert('The person profile information is missing!');
                        mThis.setData(d,true);
                        mThis.self.show().siblings().hide();
                    }); 
                }else {
                    mThis.setData(null,false);
                    mThis.self.show().siblings().hide();
                }
                mThis.elScreenTitle.text(option.title);
            });
        }

        this.back = ()=>{
            if(mThis.previous_view) mThis.previous_view.show(mThis.previous_view_option);
        }
 }
//end:: Applicant View
  
$(document).ready(()=>{
    PersonComponent.init();
});