'use strict';
//begin:: LoanAppFormComponent (New Applicant / Modify Applicant)
 let LoanAppFormComponent = new function(){
        let mThis = this;
        this.title_prop = 'loan application'; //title prop stored in locale file such as en.json, km.json
        //this.elScreenTitle = $('#screen_title');
        this.self = $('#_main_loanAppFormComponent');
        this.base_url = $('#__base_url').val();
       
        this.elNID = $('#_loanapp_nid');
        this.elOcc = $('#_loanapp_occupation');
        this.elCurrentAddress_city = $('#_loanapp_adr_city');
        this.elCurrentAddress_district = $('#_loanapp_adr_district');
        this.elCurrentAddress_commune = $('#_loanapp_adr_commune');
        this.elGuarantorId = $('#_loanapp_gid');
        this.current_address = {};

        this.elEmpOrg = $('#_loanapp_emp_org');
        this.elLoanType = $('#_loanapp_loan_type');
        this.elLoanPurpose = $('#_loanapp_purpose');
        this.elOccupation = $('#_loanapp_occupation');
        this.elPayBackOption = $('#_loanapp_payback_option');
        this.elCO = $('#_loanapp_credit_officer');
        this.elTenureUnit = $('#_loanapp_tenure_unit');
        this.elTenure = $('#_loanapp_tenure');
        this.elCompoundCycle = $('#_loanapp_compound_cycle');

        //this.elIndustry = $();

        this.imgProfilePhoto = $('#_loanapp_profile_img');
        this.fileChooser = $('#_loanapp_fileChooser');
        this.btnChoosePhoto = $('#_loanapp_lnkChoosePhoto');
        this.btnDeletePhoto = $('#_loanapp_lnkDeletePhoto');
         
        this.btnPrintPmtSched = $('#_loanapp_btnPrintPmtSched');
        this.btnPrintContract = $('#_loanapp_btnPrintContract');
        this.btnSave = $('#_loanapp_btnSave');
        this.btnClose = $('#_loanapp_btnClose');

        this.btnApprove = $('#_loanapp_btnApprove');
        this.btnDisburse = $('#_loanapp_btnDisburse');
        this.btnApproveAndDisburse =$('#_loanapp_btnApproveDisburse');
        this.btnClose = $('#_loanapp_btnClose');
        
        this.personal_data_view = $('#_loanapp_personal_data_view');
        this.employment_info_view = $('#_loanapp_employment_view');
        this.request_view = $('#_loanapp_request_view');
        this.guarantors_view = $('#_loanapp_guarantors_view');
        
        this.lnkNewOrg = $('#_loanapp_lnkNewOrg');
        this.lnkNewOccupation = $('#_loanapp_lnkNewOccupation');
        this.lnkNewPurpose = $('#_loanapp_lnkNewPurpose');
        
        this.lnkAddCollateral = $('#_loanapp_lnkAddCollateral');
        this.lnkAddDoc = $('#_loanapp_lnkAddDoc');

        this.tblCols = $('#_loanapp_tblCols');
        this.tblCols_body = $('#_loanapp_tblCols_body');

        this.tblDoc= $('#_loanapp_tblDocs');
        this.tblDoc_body = $('#_loanapp_tblDocs_body');
        //this.btnApprove = $('#_loanapp_btnApprove');
        this.form_options =null;
        //collateralAttachments
        this.person_id = null; // on Loan Application Form
        this.collateral_attachments = [];
        this.documents = [];

        this.init = ()=>{
            
            mThis.elTenureUnit.on('change',(e)=>{
               //let compound_cycle_id = mThis.elCollateralType.val();
               if(!mThis.elCompoundCycle.is(':disabled')){
                 mThis.elCompoundCycle.val(mThis.getCompoundCycleValue(mThis.elTenureUnit.val()));
                 //NOTE: tenure_units[] and compound_cycles[] must be in same order with same element id
                 //['day','week','month','year'] =>  //['dayly','weekly','monthly','yearly']
               }
            });

            mThis.lnkNewOrg.on('click',(e)=>{
                e.preventDefault();
                let op = {'title':"New Organization","form_options":{'industries':mThis.form_options.industries}};
                  
                NewOrgDialog.show(op,(p)=>{
                    if(p){ 
                        mThis.form_options=mThis.form_options?mThis.form_options:{};
                        if (!mThis.form_options.emp_organizations) mThis.form_options.emp_organizations = [];
                        mThis.form_options.emp_organizations.unshift({'id':p.org_id,'org_name':p.name});
                        mThis.refreshOrgList(mThis.form_options.emp_organizations,p.org_id);       
                    }
                });
            });

            mThis.lnkNewOccupation.on('click',(e)=>{
                e.preventDefault();
                let op = {'title':'New Occupation','default_value':null,'dataLabel':'Occupation name'};
                InputBox1.show(op,(d)=>{
                   if(d){
                       let p = {'name':d};
                       post_ajax(`${mThis.base_url}/api/settings/save-occupation`,p,(res)=>{
                           if(res.status_code === 200){
                               d = res.data;
                               mThis.loadOccupations({'occupation_id':d.id});
                           }else cv_interact.error(res.error_message,null);
                       });
                   }
                });
            });
            
          
            mThis.tblDoc_body.on('click','.loanapp-btn-delete-doc',function(e){
                e.preventDefault();
                let tr = $(this).closest('tr');
                mThis.deleteDocument($(this).data('id'),tr); 
             });

            mThis.tblDoc_body.on('click','.loanapp-btn-download-doc',function(e){
                e.preventDefault();
                mThis.downloadDocument($(this).data('id')); 
             });

            mThis.tblCols_body.on('click','.coll_action_delete',function(e){
               e.preventDefault();
               mThis.deleteCollateral($(this)); 
            });

            mThis.tblCols_body.on('click','.coll_action_view_file',function(e){
                e.preventDefault();
                mThis.viewCollateralFile($(this).data('id')); 
             });

            mThis.lnkAddCollateral.on('click',(e)=>{
              e.preventDefault();
              
              //Create temporary Random ID for the new collateral added. This temp_id is used to associate attachments with each collateral
              let temp_collateral_id = Math.floor(Math.random() * 100); // or " temp_collateral_id = Date.now();"" 

              //NOTE: temp_id is temporary collateral ID that is used to associate each attachment file with the colleral item
              let op = {collateral_id:0,'temp_id':temp_collateral_id};
              CollateralDialog.show(op);

            //   CollateralDialog.show(op,(c)=>{
            //     if(c){
            //       //get existing collaterals being displayed in collateral table
            //       if (!c.collateral_type_id){
            //         cv_interact.alert('Collateral Type is not valid','','error',{'langSection':'validation'});
            //         return;
            //       } 
            //       let ps = mThis.getCollaterals();
                   
            //       if(!c.attachments) c.attachments= [];
            //       //Temporarily store file attachments of newly added Collateral in the array "mThis.collateral_attachments", which is array [{temp_id,file_type,file_content}]. This array is used to retrieve a set of files for each Collateral based on temporary collateral ID "temp_id"
            //       c.attachments.map((file)=>{
            //          mThis.collateral_attachments.push({'temp_id':c.temp_id,'file_type':file.file_type,'file_content': file.file_content});
            //       });

            //       if (mThis.loan_app_id > 0 || mThis.loan_id > 0){
            //          let p = {'loan_app_id':mThis.loan_app_id,'loan_id':mThis.loan_id,'collateral':c}; 
            //          post_ajax(`${mThis.base_url}/api/loanapp/save-collateral`,p,(res)=>{
            //             if(res.status_code ===200){
            //                 c.id = res.data.id; //gnewly generated collateral Id
            //                 ps.push(c); //add the newly entered Collateral
            //                 mThis.displayCollaterals(ps);
            //             }else cv_interact.alert(res.error_message,'','error');
            //          });

            //       }else{
            //             ps.push(c); //add the newly entered Collateral
            //             mThis.displayCollaterals(ps);
            //       }
                 
            //     }

            //   });

            });

            mThis.lnkAddDoc.on('click',(e)=>{
               e.preventDefault();
               let op = {};
               AttachDialog.show(op,(d)=>{
                 //d = {file_content,file_type}
                 if(d){
                            if (mThis.loan_app_id > 0 || mThis.loan_id > 0) 
                            {
                                 //save document to server using loan_app_id
                                 let p = {'loan_app_id':mThis.loan_app_id,'loan_id':mThis.loan_id,'file':d};
                                 post_ajax(`${mThis.base_url}/api/loanapp/save-document`,p,(res)=>{
                                     if(res.status_code ===200){
                                         //display newly added document
                                         d.id = res.data.id; //newly generated file_id
                                         mThis.addDocument(d);
                                     }else cv_interact.alert(res.error_message,'','error');
                                 });
                            }
                            else {
                                if(!mThis.documents) mThis.documents = [];
                                mThis.documents.push(d);
                                //display newly added document
                                mThis.addDocument(d);
                            } 
                            
                 }

               });
            });

            //View Pmt schedule button
            mThis.btnPrintPmtSched.on('click',(e)=>{
     
                //   Toast.fire({
                //     icon: 'error',
                //     title: 'This is for test'
                //   })

                let except_fields = [];
                //mThis.getLoanFields return array of {name,value}
                let fields = mThis.getLoanFields(true);
               
                fields.push({'name':'loan_app_id','value':mThis.loan_app_id});  
                fields.push({'name':'loan_id','value':mThis.loan_id});
                fields.push({'name':'lang','value':'en'}); //set langauge to English
                let str_vars ="";
                let required_fields = ['loan_type_id','principal','loan_tenure','loan_tenure_unit','period_interest_rate','compoud_cycle','payback_method_id','start_date']; 
                let is_valid =true;
                fields.map((f)=>{
                   if(except_fields.indexOf(f.name) <0){
                    if(required_fields.indexOf(f.name) >= 0){
                        if (!f.value || f.value <=0){
                            let fName = (f.name+'').replace(/_id/g,'').replace(/_/g,' ');
                            cv_interact.error(`${fName} is required!`);
                            //cv_interact.alert(`${fName} is required!`,'','error',{'langSection':'validation'});
                            is_valid =false;
                            return false;
                        }
                    }
                     //Remove underscore '_' from any field name
                     f.name = (f.name+'').replace(/_/g,'');
                     str_vars = [str_vars,'&',f.name,'=',f.value].join('');
                   }
                });

                //let report_name =mThis.getReportName_pmt_sched(mThis.elPayBackOption.val());
                if(!is_valid) return;
                let params = ['rtype=pmt_schedule',str_vars].join('');
                main_view.getEncryptData(encodeURI(params),(d)=>{
                    window.open([mThis.base_url,'/genreport/',d].join(''),'_blank'); 
                });
            });

            //View Contract button
            mThis.btnPrintContract.on('click',(e)=>{
                let fields = [
                    {'name':'loanid','value':mThis.loan_id?mThis.loan_id:0},
                    {'name':'loanappid', 'value':mThis.loan_app_id?mThis.loan_app_id:0}
                ];
               
                let str_vars ="";
                fields.map((f)=>{
                   //if(except_fields.indexOf(f.name) <0){
                     //remove underscore '_' from any field name
                     f.name = (f.name+'').replace(/_/g,'');
                     str_vars = [str_vars,str_vars?'&':'',f.name,'=',f.value].join('');
                   //}
                });

                //depending on the selected loan_type_id => this will lead to either loan_contract report or pawn_contract report route
                main_view.getEncryptData(encodeURI(str_vars),(d)=>{
                    //window.open([mThis.base_url,'/loancontract/',d].join(''),'_blank'); 
                    window.open([mThis.base_url,'/pawncontract/',d].join(''),'_blank'); 
                });
            });
 
            mThis.btnApprove.on('click',(e)=>{
               e.preventDefault();
               if(!mThis.loan_app_id || mThis.loan_app_id<=0){
                  cv_interact.warning('Loan Application has not been saved yet!');
                  return;
               }
               //NOTE that mThis.getLoanFields(false) return json object for params (it is loan info for approving loan action)
               //NOTE that mThis.getLoanFields(false) returns array [{name:<field name>,value: field value},{name:'principal',value:3500},.....] . This is used for creating or previewing Payment schedule reports
               let p = mThis.getLoanFields(false);
               p.loan_app_id = mThis.loan_app_id;

               let op =   {
                title:'LMS',
                'confirmButtonText':'Approve',
                'cancelButtonText':'Dont Approve'  
               };
               
               cv_interact.confirm('Approve this loan application?',op,(e)=>{
                  if(e){
                        post_ajax(`${mThis.base_url}/api/loan/approve`,p,(res)=>{
                            if(res.status_code===200){
                                let data_changed = true;
                                mThis.goBack(data_changed);
                            }else cv_interact.error(res.error_message,'');
                        });
                  }
               });            
            });

            mThis.btnDisburse.on('click',(e)=>{
                e.preventDefault();
                if(!mThis.loan_app_id || mThis.loan_app_id<=0){
                   cv_interact.warning('Loan Application has not been saved yet!');
                   return;
                }
                //NOTE that mThis.getLoanFields(false) return json object for params (it is loan info for approving loan action)
                //NOTE that mThis.getLoanFields(false) returns array [{name:<field name>,value: field value},{name:'principal',value:3500},.....] . This is used for creating or previewing Payment schedule reports
                let p = mThis.getLoanFields(false);
                p.loan_app_id = mThis.loan_app_id;
                cv_interact.confirm('Disburse this loan?',{
                    title:'LMS',
                    'confirmButtonText':'Disburse',
                    'cancelButtonText':'Not Yet'  
                    },(e)=>{
                        if(e){
                                post_ajax(`${mThis.base_url}/api/loan/disburse`,p,(res)=>{
                                    if(res.status_code===200){
                                        let data_changed = true;
                                        mThis.goBack(data_changed);
                                    }else cv_interact.error(res.error_message,'');
                                });
                        }
                    });            
             });

            mThis.btnSave.on('click', (e) => {
                    e.preventDefault();
                    let p = mThis.getFormData();
                   
                    if (p.has_error===1){
                        // let f = p.error_element.data('ffield'); 
                        // cv_interact.alert(`${f} value is not correct!`,'','warning');
                        p.error_element.select();
                         p.error_element.focus();
                        return;
                    }

                    //if (!mThis.loan_app_id || mThis.loan_app_id ==0) 
                    if (mThis.loan_app_id > 0 || mThis.loan_id > 0) 
                      {
                        p.collaterals = [];
                        p.documents = [];
                        p.guarantors = [];
                      }
                    else{
                        p.collaterals = mThis.getCollaterals();
                        p.documents = mThis.documents;
                        //p.guarantors = mThis.getGuarantors();
                    }
                    
                    let g = mThis.getGuarantors();

                    //Check if guarantor fields has error or data incomplete
                    if (g.error){
                       swal.fire(
                        '',
                        g.error,
                        'error'  
                       ); 
                       //cv_interact.alert(g.error,'','error');
                       return;
                    }
                    p.guarantors = g.guarantors;
                    //saveLoanApplication() | save-loan-application
                    post_ajax(`${mThis.base_url}/api/loanapp/save`,p,(res)=>{
                        if(res.status_code ===200){
                            let minor_errors = res.data.errors;
                            if(minor_errors[0]){
                                cv_interact.alert(`<span style="display:block;font-weight:bold;color:orange">Problem with guarantor information</span>${minor_errors[0]}`,'','success');
                            }
                            mThis.goBack();
                        }else cv_interact.error(res.error_message); 
                    });
                });
   
            //Start::Close Button
             mThis.btnClose.on('click', () => {
                   mThis.goBack();  
             });
            //END::Close Button
           
            this.elNID.on('keyup',(e)=>{
                e.preventDefault();
                if (e.keyCode ===13){
                     mThis.displayPersonInfo(mThis.elNID.val());
                }
            });

            this.elCurrentAddress_city.on('change',function(e){
                let city_id = $(this).val();
                mThis.loadDistricts(city_id,mThis.current_address.district_id);
            });
            
            this.elCurrentAddress_district.on('change',function(e){
                let district_id = $(this).val();
                mThis.loadCommunes(district_id,mThis.current_address.commune_id);
            });
            
              //##begin:: PROCESS PHOTO UPLOAD
                    //image file reader image_reader  
                    let reader = new FileReader();
                    mThis.btnChoosePhoto.on('click',(e)=>{
                        e.preventDefault();
                        $('#_loanapp_fileChooser').trigger('click'); 
                    });

                    mThis.btnDeletePhoto.on('click',(e)=>{
                        e.preventDefault();
                        let p ={'person_id':mThis.person_id};
                        
                        cv_interact.confirm('Delete this photo?',{'title':'Delete Photo','confirmButtonText':'Delete','cancelButtonText':'Dont Delete','context':'delete','translate':true},(e)=>{
                            if(e){
                                post_ajax(`${mThis.base_url}/api/loanapp/delete-profile-picture`,p,(res)=>{
                                    if(res.status_code ===200){
                                        mThis.imgProfilePhoto.prop('src',null);
                                    }else cv_interact.error(res.error_message,null);
                                 });
                            }
                        });
                    });
        
                    //Profile Picture
                    reader.onload = (e)=>{
                        e.preventDefault();	
                        // console.log(e.total); // file size 
                        //Sanitize photo data or photo stream
                        //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
                        let photo_data = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

                        /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
                        let base64result = photo_data.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

                        /*Get file extention or fileType from the base64 String */
                        let file_type = photo_data.split('/')[1].split(';')[0];
                        if (file_type === 'jpeg') file_type = 'jpg'; /* make file extension to 3 characters only */

                        //Preview File content or Photo image
                        mThis.imgProfilePhoto.prop('src',photo_data);

                        mThis.data = {
                            'person_id': mThis.person_id,
                            'file_type':file_type,
                            'file_content':base64result
                        };

                        if(mThis.person_id > 0){
                           post_ajax(`${mThis.base_url}/api/loanapp/save-profile-picture`,mThis.data,(res)=>{
                                if(res.status_code ===200){
                                    cv_interact.alert('Photo has been saved!','','success');
                                }else cv_interact.alert(res.error_message,'','error');
                           });  
                        }  
                         
                         //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                         mThis.fileInput.val(null);

                    }

                    //Profile Photo
                    mThis.fileChooser.on('change',(e)=>{
                        let allowed_file_types = /(gif|jpe?g|png|pdf|\.document|\.sheet)$/i;
                        //allow maximum 50 KB size of image
                        let _max_size = 3000; 
                        let files = mThis.fileChooser.prop('files');
                        //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
                        let file = files[0];
                        if (file) {
                            if (file.type.match(allowed_file_types)) {
                                
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
                                    if (file_type === 'jpeg') file_type = 'jpg'; /* make file extension to 3 characters only */
                                    /* Display the selected photo image */
                                    //mThis.imgProfilePhoto.prop('src', photoData); // putting file in dom without server upload.
 
                                    if (mThis.person_id>0 || mThis.loan_app_id> 0){
                                            let p = {
                                                'file_content': base64result, /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                                                'file_type': file_type,
                                                'person_id':mThis.person_id,
                                                'loan_app_id':mThis.loan_app_id 
                                            };

                                            post_ajax(`${mThis.base_url}/api/loanapp/save-profile-picture`,p,function(result) {
                                                if (result.status ==='OK')
                                                {
                                                    mThis.imgProfilePhoto.prop('src',photo_data);
                                                    cv_interact.alert('Photo has been saved');
                                                }
                                                else cv_interact.alert(result.error_message,'','error');
                                                //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                                                mThis.fileChooser.val(null);
                                            });
                                    }else{
                                       
                                        mThis.imgProfilePhoto.prop('src',photo_data);
                                        mThis.photo_data = base64result;
                                        mThis.photo_file_type = file_type;
                                         //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
                                         mThis.fileChooser.val(null);
                                    }   
                            };
                //##end:: PROCESS PHOTO UPLOAD
        }

        this.loadDistricts = (city_id = null,def_district_id=0,onFinish=null)=>{
            let p = {'city_id':city_id?city_id:mThis.elCurrentAddress_city.val()};
            post_ajax(`${mThis.base_url}/api/getComboItems_district`,p,(res)=>{
               if (res.status_code ===200){
                 let items = StringSanitizer.sanitizeObject(res.data);
                 CommonLib.setComboItems(mThis.elCurrentAddress_district,items,'district_id','name',true,'ស្រុក',def_district_id);
                 if (def_district_id > 0) mThis.elCurrentAddress_district.val(def_district_id).trigger('change');
                 if (typeof onFinish ==='function') onFinish();
               }
            });
    
        }

        this.refreshOrgList = (d,org_id)=>{
            CommonLib.setComboItems(mThis.elEmpOrg,d,'id','org_name',true,'select organization',org_id);
            if(org_id>0) mThis.elEmpOrg.trigger('change');
        }

        this.loadOccupations = (def)=>{
            if(!def) def = {};
            post_ajax(`${mThis.base_url}/api/settings/occupations`,null,(res)=>{
                if(res.status_code ===200){
                    let items =StringSanitizer.sanitizeObject(res.data);  
                    CommonLib.setComboItems(mThis.elOccupation,items,'id','occupation',def.occupation_id);
                    if(def.occupation_id>0) mThis.elOccupation.val(def.occupation_id).trigger('change');
                    if (mThis.form_options) mThis.form_options.occupations = items;
                }else console.log(`/api/settings/occupations returned status_code ${res.status_code} . Error: ${res.error_message}`); 
            });
        }

        this.getCompoundCycleValue= (tenure_unit =0)=>{
           switch(tenure_unit)
           {
                case 'days':{
                    return 'daily';
                }
                case 'weeks':
                    {
                        return 'weekly';
                    }
                case 'month':{
                    return 'monthly';
                }
                case 'years':{
                    return 'yearly';
                }
                default:{
                    return 'monthly';
                } 
           }
        }

        this.loadPurposes = (def)=>{
            if(!def) def = {};
            post_ajax(`${mThis.base_url}/api/settings/loan-purposes`,null,(res)=>{
                if(res.status_code ===200){
                    items = res.data;
                    items = StringSanitizer.sanitizeObject(items);  
                    CommonLib.setComboItems(mThis.elLoanPurpose,items,'id','purpose',def.purpose_id);
                    if(def.purpose_id>0) mThis.elLoanPurpose.trigger('change');
                    if (mThis.form_options) mThis.form_options.loan_purposes = items;
                }
            });
        }


        this.loadCommunes= (district_id = 0,def_commune_id=0,onFinish= null)=>{
            let p = {'district_id':district_id?district_id:mThis.elCurrentAddress_district.val()};
            post_ajax(`${mThis.base_url}/api/getComboItems_commune`,p,(res)=>{
               if (res.status_code ===200){
                 let items = StringSanitizer.sanitizeObject(res.data);
                 CommonLib.setComboItems(mThis.elCurrentAddress_commune,items,'commune_id','name',true,'ឃំុ',def_commune_id);
                 if (def_commune_id > 0) mThis.elCurrentAddress_commune.trigger('change');
                 if (typeof onFinish ==='function') onFinish();
               }
            });
        }

       this.loadFormOptions = (def={},refresh=false,onFinish)=>{
         if(refresh) 
            mThis._loadFormOptions(def,onFinish);
         else{
             if (mThis.form_options){
                    CommonLib.setComboItems(mThis.elOcc,mThis.form_options.occupations,'id','occupation',true,'Occupation',def.occupation_id);
                    CommonLib.setComboItems(mThis.elCurrentAddress_city,mThis.form_options.cities,'id','city_name',true,'City',def.city_id);
                    CommonLib.setComboItems(mThis.elLoanType,mThis.form_options.loan_types,'id','loan_type',true,'Loan Type',def.loan_type_id);
                    CommonLib.setComboItems(mThis.elEmpOrg,mThis.form_options.emp_organizations,'id','emp_org_name',true,'Organization',def.emp_org_id);
                    CommonLib.setComboItems(mThis.elLoanPurpose,mThis.form_options.loan_purposes,'id','loan_purpose',true,'Loan Purpose',def.loan_purpose_id);
                    CommonLib.setComboItems(mThis.elPayBackOption,mThis.form_options.payback_options,'id','payback_option',true,'Payback option',def.payback_option_id);
                    CommonLib.setComboItems(mThis.elCO,mThis.form_options.credit_officers,'id','name',true,'Credit officer',def.credit_officer_id);
                    if (typeof onFinish ==='function') onFinish();
             }else  mThis._loadFormOptions(def,onFinish);
         }   
               
       }

       this._loadFormOptions = (def={},onFinish)=>{
                def = def || {}; 
                post_ajax(`${mThis.base_url}/api/loanapp/combo-options`,null,(res)=>{
                    if (res.status_code ===200){
                        let d = res.data;
                        let occupations = StringSanitizer.sanitizeObject(d.occupations);
                        let cities = StringSanitizer.sanitizeObject(d.cities);
                        let loan_purposes = StringSanitizer.sanitizeObject(d.loan_purposes);
                        let loan_types = StringSanitizer.sanitizeObject(d.loan_types);
                        let emp_organizations = StringSanitizer.sanitizeObject(d.emp_organizations);
                        let payback_options = StringSanitizer.sanitizeObject(d.payback_options);
                        let industries = StringSanitizer.sanitizeObject(d.industries);
                        let credit_officers = StringSanitizer.sanitizeObject(d.credit_officers);
                        
                        CommonLib.setComboItems(mThis.elOcc,occupations,'id','occupation',true,'Occupation',def.occupation_id);
                        CommonLib.setComboItems(mThis.elCurrentAddress_city,cities,'id','city_name',true,'ក្រុង/ខេត្ត',def.city_id);
                        CommonLib.setComboItems(mThis.elLoanType,loan_types,'id','loan_type',true,'Select loan type',def.loan_type_id);
                        CommonLib.setComboItems(mThis.elEmpOrg,emp_organizations,'id','emp_org_name',true,'Organization',def.emp_org_id);
                        CommonLib.setComboItems(mThis.elLoanPurpose,loan_purposes,'id','loan_purpose',true,'Loan Purpose',def.loan_purpose_id);
                        CommonLib.setComboItems(mThis.elPayBackOption, payback_options,'id','payback_option',true,'Payback option', def.payback_option_id);
                        CommonLib.setComboItems(mThis.elCO, credit_officers,'id','name',true,'Credit officer', def.credit_officer_id);
                        if(typeof onFinish === 'function') onFinish();
                        mThis.form_options = {'occupations':occupations,'cities':cities,'loan_purposes':loan_purposes,'loan_types':loan_types,'emp_organizations':emp_organizations,'industries':industries,'payback_options':payback_options,'credit_officers':credit_officers};
                    }
                    
                   
                });
       }

 
        //Get forma data on Application Form
        this.getFormData = ()=>{
            let p = {'loan_app_id':mThis.loan_app_id};
            let has_error = false;
            let personal_data = {};
            let err_field = null;
            let el = null;
            mThis.personal_data_view.find('.data-input').each(function(){
                el = $(this);
                if (el.data('required')==1) Validator.checkValue(el);
                let f = el.data('field');
                if(el.data('error')===1){
                    has_error =true;
                    err_field = el.data('ffield');
                    return false;
                }
                personal_data[f]= el.val();
            });

            if (has_error) return {'has_error':1,'error_element':el,'error_field':err_field};

            personal_data.person_id = mThis.person_id;
            p.personal_data = personal_data;

            let emp_data = {};
            has_error = false;
            //Combine @employment_info with @personal_data. NOTE that @employment_info = {emp_start_date, emp_org_id, emp_org_type_id}
            mThis.employment_info_view.find('.data-input').each(function(){
                el = $(this);
                if (el.data('required')==1) Validator.checkValue(el);
                let f = el.data('field');
                err_field = el.data('ffield');
                p.personal_data[f] =el.val();
                emp_data[f]= el.val();
            });
            
            if (!emp_data.emp_org_id) return {'has_error':1,'error_element':el,'error_field':err_field};
            //p.emp_data = emp_data;
 
             //begin:: get request-info
                    
                let request_data = {};
                mThis.request_view.find('.data-input').each(function(){
                    el = $(this);
                    if (el.data('required')==1) Validator.checkValue(el);
                    let f = el.data('field');
                    err_field = el.data('ffield');
                    if(el.data('error')==1){
                        has_error =true;
                        return false;
                    }
                    request_data[f]= el.val();
                });

                if(has_error) return {'has_error':1,'error_element':el,'error_field':err_field};
               
                request_data.loan_app_id = mThis.loan_app_id;
                //request_data.period_count = mThis.getLoanPeriodCount(request_data); 
                //period_interest_rate is rate per compounding cycle
                //request_data.period_interest_rate = mThis.getPeriodInterestRate(request_data); 
                p.request_data = request_data;
            //end:: get request-info
            
            ////p.loan_app_id = mThis.loan_app_id;
            p.documents = mThis.documents?mThis.documents:[]; 
            return p;
 
        }

        // END::get form data
 
        this.addDocument = (d={})=>{
             //mThis.tblDoc_body.empty();
           if(!d.numero) d.numero =1; 
           let id = d.id?d.id:'';
           let html =`<tr data-id="${d.id?d.id:''}" data-type="${d.file_type}">
           <td style="width:50px">${d.numero}</td>
           <td>${d.description}</td>
           <td>
             <div style="min-width:80px">
               <a data-id="${id}" class="loanapp-btn-download-doc" href="#"><i class="fas fa-file"></i></a>&nbsp;
               <a data-id="${id}" class="loanapp-btn-delete-doc off-when-readonly" href="#"><i class="fa fa-trash" style="color:red"></i></a>
             </div>
           </td>
           </tr>`;
           mThis.tblDoc_body.append(html);
        }

        this.deleteDocument = (id=0,tr)=>{
            let p = {'file_id':id,'loan_app_id':mThis.loan_app_id};
            cv_interact.confirm('Delete this file?',{
                'title':'Delete File',
                'confirmButtonText':'Delete',
                'cancelButtonText':'Dont Delete',
                'translate':true,
                'langSection':'loan_app_form'}
                ,(e)=>{
                    if(e){
                            post_ajax(`${mThis.base_url}/api/loanapp/delete-document`,p,(res)=>{
                                if(res.status_code ===200)
                                { 
                                    tr.remove();
                                }else cv_interact.alert(res.error_message,'','error');
                            });
                    }
            });
           
        }


        this.downloadDocument = (id=0)=>{
            //let p = {'loan_app_id':mThis.loan_app_id,'file_id':id};
           window.open([`${mThis.base_url}/download-doc/document/${mThis.loan_app_id}/${id}/`].join(''),'_blank');
        }

        this.deleteCollateral = (lnk)=>{
            let id = lnk.data('id');
            if (!id){
                lnk.closest('tr').remove();
                return;
            }else{
                cv_interact.confirm('Delete this collateral?',{'title':'Delete Collateral','translate':true,context:'delete','langSection':'loan_app_form'},(e)=>{
                    if(e){
                        let p = {'collateral_id':id};
                        post_ajax(`${mThis.base_url}/api/loanapp/delete-collateral`,p,(res)=>{
                            if(res.status_code ===200){
                                lnk.closest('tr').remove();
                            }else cv_interact.alert(res.error_message,'','error');
                        });
                    }
                });
          }

        }

        //return array => loan paramters for making payment schedule for Print
        //If return_json_array ==false => returns object for api. Example {'loan_tenure':36, 'principal'=>3500,...}
        //if return_json_array == true => returns array for making printable payment schedule  [{name:'start_date',value:'2022-20-3'},{...}, ..] 
        this.getLoanFields = (return_json_array=true)=>{
            let fields = [];
            let p = {};
            //get all loan related fields, and return [{name,value}]
            mThis.request_view.find('.data-input').each(function(){
               let el = $(this);
               let f = el.data('field');
               if(!return_json_array){
                  p[f] = el.val();
                  //todo: update this line to include dynamic currency
                  if(f==='currency_code') p[f]='USD';
               }else {
                //todo: update this line to include dynamic currency
                if(f==='currency_code') fields.push({'name':f,'value':'USD'});
                else 
                 fields.push({'name':f,'value':el.val()});
               }
              
            });
            if (return_json_array){
                fields.push({name:'borrower_id','value':mThis.person_id});
                return fields;
            }
            else{
                p.borrower_id = mThis.person_id;
                return p;
            }
        }
 
        // this.getReportName_pmt_sched = (payback_method_id =0)=>{
        //  switch(payback_method_id){
        //     case '1':{
        //         return 'pmt_sched_anuity';
        //     }
        //     case '2':{
        //         return 'pmt_sched_balloon';
        //     }  
        //   }
        //  return 'pmt_sched_balloon';
        // }

        this.viewCollateralFile = (id=0)=>{
            //alert('View collateral file ' + id);
            if(!id){
                cv_interact.alert('No file found!',null,'info',{'langSection':'test'});
                return;
            }
            window.open([`${mThis.base_url}/download-doc/collateral/${mThis.loan_app_id}/${id}/`].join(''),'_blank');
        }

        this.displayCollaterals = (ds=[])=>{
            let i =0,c=null;
            // ds = [
            //     {type:'Computer',description:'DELL 270i',owner_name:'Mr. Sovannda',identification_number:'508968',estimate_value:0,'expiration_date':'NA'}
            //   ];
            mThis.tblCols_body.empty();
            do{
              c = ds[i];
              if(!c) break;
               let temp_id = c.temp_id?c.temp_id:'';
               let html_action = [
                //`<a href="#" class="coll_action_info"><i class="fa fa-list"></i></a>&nbsp;`,
                `<a href="#" data-id="${c.id?c.id:''}" class="coll_action_view_file"><i class="fa fa-file"></i></a>&nbsp;`,
                `<a href="#" data-id="${c.id?c.id:''}" class="coll_action_delete off-when-readonly"><i class="fa fa-trash" style="color:red"></i></a>`
               ].join('');
               c.identification_number =c.identification_number?c.identification_number:'គ្មាន';
               c.estimate_value = c.estimate_value?c.estimate_value:0;
               c.currency_symbol =c.currency_symbol?c.currency_symbol:'$';
                let html = [`<tr data-id="${c.id?c.id:''}" data-tempid ="${temp_id}" data-cursymol="${c.currency_symbol}" data-typeid="${c.collateral_type_id}"><td class="numero">${i+1}</td><td class="collateral_type">${c.collateral_type}</td><td class="description">${c.description}</td><td class="owner_name">${c.owner_name}</td><td class="identification_number">${c.identification_number}</td><td class="estimate_value" data-value="${c.estimate_value}">${c.currency_symbol}${c.estimate_value}</td><td class="col_action">${html_action}</td></tr>`].join('');
                mThis.tblCols_body.append(html);
              i++;
            }while(c);
             
         }
        
         this.displayGuarantors = (ds=[])=>{
            //Assuming there is only one gurator, so not array $ds[], but $d
            let d = ds[0]?ds[0]:{};
            mThis.elGuarantorId.val(null);
            mThis.guarantors_view.find('.data-input').each(function(){
                 let el = $(this);
                 let f = el.data('field');
                 el.val(d[f]);
            });
         }

         this.displaydocuments = (ds=[])=>{
            mThis.tblDoc_body.empty();
           let i=0,c;
           do{
              c = ds[i];
              if(!c) break;
              c.numero = (i+1);
              mThis.addDocument(c);
              i++;
           }while(c);
         }

         this.getCollateralAttachments = (temp_id =null)=>{
             let i=0,c;
             let ds = [];
 
             if(!temp_id || temp_id==0) return ds;
             //console.log(JSON.stringify(mThis.collateral_attachments));
             do{
               c = mThis.collateral_attachments[i];
               if(!c) break;
                  if(c.temp_id ==temp_id){
                     //delete(c['temp_id']);
                     ds.push(c);
                  } 
               i++;
             }while(c);

             return ds;
         }
 
         this.getGuarantors = ()=>{
           let ps = [];
           let p= {};
           let err = null;

           mThis.guarantors_view.find('.data-input').each(function(){
              let el = $(this);
              let f = el.data('field');
              //let ff = el.data('ffield')?el.data('ffield'):'Guarantor information';  
              p[f] = el.val();
           });

            //If user enters Guarantor's name, then phone number and address are required
            if(p.name){
                if (!p.phone_number || !p.address)
                {
                    err =LocaleManager.trans('guarantor_invalid','loan_app_form');
                    return {'error':err,'guarantors':[]};
                }
              }
           ps.push(p);
           return {'error':err,'guarantors':ps};
         }
     
         this.getCollaterals = ()=>{
            let ps = [];
            
            mThis.tblCols_body.find('tr').each(function(){
                let tr = $(this);
                let coll_id = tr.data('id');
                let coll_type_id = tr.data('typeid');
                let cur_symbol = tr.data('cursymbol');
                let temp_id = tr.data('tempid');
                    //if (!temp_id || temp_id==0){
                        let c = {
                            'collateral_type_id':coll_type_id,
                            'collateral_type': tr.find('td.collateral_type').text(),
                            'description':tr.find('td.description').text(),
                            'owner_name':tr.find('td.owner_name').text(),
                            'identification_number':tr.find('td.identification_number').text(),
                            'currency_symbol':cur_symbol,
                            'estimate_value':tr.find('td.estimate_value').data('value')
                            //,'attachments':mThis.getCollateralAttachments(temp_id)
                        };

                        if (temp_id) c.attachments =mThis.getCollateralAttachments(temp_id);
                        else c.id = coll_id;
                        ps.push(c);
                    //}
                 
            });
           
            return ps;
         }

         //display Personal Info by NID when National ID field lost focus "blur" or when Enter key pressed
         this.displayPersonInfo = (nid=null)=>{
           let p = {'national_id':nid};
           post_ajax(`${mThis.base_url}/api/person/info-by-nid`,p,(res)=>{
                if(res.status_code===200){
                     let d = StringSanitizer.sanitizeObject(res.data,null,['image_url']);
                     mThis.setFormData_person_info(d);
                }
           });
         }

         //Show buttons on LoanAppForm depending on status = {1=Pending,2=Approved,3=Disbursed}
         this.showButtons = (loan_app_id=null, status_id=1)=>{
            if (!loan_app_id) {
                mThis.btnSave.show();
                mThis.btnApprove.hide();
                mThis.btnApproveAndDisburse.hide();
                mThis.btnDisburse.hide();
                return;
            }

            if (status_id==1){
                mThis.btnSave.show();
                mThis.btnApprove.show();
                mThis.btnApproveAndDisburse.show();
                mThis.btnDisburse.hide();
            } else if (status_id ==2){
                mThis.btnSave.hide();
                mThis.btnApprove.hide();
                mThis.btnApproveAndDisburse.hide();
                mThis.btnDisburse.show();
                if (status_id==3){
                    mThis.btnDisburse.hide();
                    mThis.btnApproveAndDisburse.hide();
                }
            }   
        }
         
        //show Loan Application form
        this.show = (option={},onClose)=>{
            if(!option) option={};
            mThis.onClose = onClose;
            mThis.goBackHandler = option.goBackHandler;
            mThis.documents = [];
            mThis.collaterals = [];
            
            mThis.loan_app_id = option.loan_app_id;
            mThis.status_id = option.status_id;

            //Clear temporary Collateral's attachments store
            mThis.collateral_attachments = []; //[ {tem_id:0,attachments:[]}, ... ]

            if (option.loan_app_id > 0){
                mThis.person_id = option.person_id;
                mThis.title_prop ='Review Application';
            } else {
                mThis.title_prop ='New Application';
                mThis.person_id = null;
            }
            
            //mThis.showButtons(option.loan_app_id,option.status_id);
            mThis.loadFormOptions({},false,()=>{
                if(!mThis.loan_app_id || mThis.loan_app_id <=0){ 
                    mThis.displayLoanAppDetails(null,()=>{
                        mThis.self.show().siblings().hide();
                        main_view.setTitle(mThis.title_prop); 
                    });
                    //return;
                } 

                mThis.displayLoanAppDetails(mThis.loan_app_id,(data)=>{
                    mThis.self.show().siblings().hide();
                    main_view.setTitle(mThis.title_prop);
                    //mThis.showButtons(d.loan_app_id,d.status_id);
                }); 
               
            });
          
        }
    
        this.goBack = ()=>{
            if(typeof mThis.goBackHandler ==='function'){
                mThis.goBackHandler();
                return;
            }
            //By default, go back to pending Loan Application List
            let op = {};
            LoanAppListComponent.show(op);
        }

        //setFormData() display both personal information and loan info. setFormData_personal_info() display only personal info based on the given NID
        this.setFormData = (d=null,readOnly=false)=>{
            if(!d){
                d ={};
                readOnly=false;
            }
            //if(!mThis.current_address) mThis.current_address ={};
            //Clear out the profile photo
            mThis.imgProfilePhoto.prop('src',null);
            
            let dont_trigger_changes = ['adr_city_id','adr_commune_id','adr_district_id','adr_village_id'];
            mThis.current_address.city_id = d.adr_city_id;

            if(d.adr_city_id > 0){
                //when d.adr_city_id > 0 => store address info (city_id,district_id,commune_id) in the object "mThis.current_address"
                mThis.current_address.district_id = d.adr_district_id;
                mThis.current_address.commune_id = d.adr_commune_id;
                mThis.current_address.village_id = null;
                mThis.elCurrentAddress_city.val(mThis.current_address.city_id).trigger('change');
            }else mThis.current_address= {};
           

            mThis.self.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                if(el.is('select'))
                 {
                    el.prop('disabled',readOnly);
                    if(dont_trigger_changes.indexOf(f) < 0) el.val(d[f]).trigger('change');
                 }
                else {
                    el.prop('readOnly',readOnly);
                    //console.log(f+' \n');
                    el.val(d[f]);
                }
 
             });
             
             mThis.person_id = d.person_id;

             mThis.loan_app_id = d.loan_app_id;
             mThis.imgProfilePhoto.prop('src',d.image_url);

            //  if( mThis.current_address.city_id){
            //     mThis.elCurrentAddress_city.val(mThis.current_address.city_id).trigger('change');
            //     // if(mThis.current_address.district_id>0){
            //     //     mThis.elCurrentAddress_district.val(mThis.current_address.district_id).trigger('change');
            //     //     if(mThis.current_address.commune_id > 0){
            //     //         mThis.elCurrentAddress_commune.val(mThis.current_address.commune_id).trigger('change');
            //     //     }
            //     // }  
            //  }
 
                mThis.displayCollaterals(d.collaterals);
                mThis.displaydocuments(d.documents);
                mThis.displayGuarantors(d.guarantors);

                //hideEditActions(readOnly) => will hide or show buttons for New Document, New Collateral, New Organiation, New Loan Purpose, etc 
                 mThis.hideEditActions(readOnly);
                 //NOTE: the d.status_id will be automatically set to 1 when there is no d.loan_app_id
                 mThis.showButtons(d.loan_app_id,d.status_id);
        }

        this.hideEditActions = (hide=true)=>{
           mThis.self.find('.off-when-readonly').each(function(){
                let el = $(this); 
                if (hide) el.hide();
                else el.show();
           });
        }

        //display personal info Section only
        this.setFormData_person_info = (d=null)=>{
            if(!d) d ={};
            //if(!mThis.current_address) mThis.current_address ={};
            //Clear out the profile photo
            mThis.imgProfilePhoto.prop('src',null);
            
            let dont_trigger_changes = ['adr_city_id','adr_commune_id','adr_district_id','adr_village_id'];
            mThis.current_address.city_id = d.adr_city_id;

            if(d.adr_city_id > 0){
                //when d.adr_city_id > 0 => store address info (city_id,district_id,commune_id) in the object "mThis.current_address"
                mThis.current_address.district_id = d.adr_district_id;
                mThis.current_address.commune_id = d.adr_commune_id;
                mThis.current_address.village_id = null;
                mThis.elCurrentAddress_city.val(mThis.current_address.city_id).trigger('change');
            }else mThis.current_address= {};
           

            mThis.personal_data_view.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                if(el.is('select'))
                 {
                    if(dont_trigger_changes.indexOf(f) < 0) el.val(d[f]).trigger('change');
                 }
                else el.val(d[f]); 
 
             });

             mThis.employment_info_view.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                if(el.is('select'))
                 {
                    if(dont_trigger_changes.indexOf(f) < 0) el.val(d[f]).trigger('change');
                 }
                else el.val(d[f]); 
 
             });
              
             mThis.person_id = d.person_id;
             mThis.imgProfilePhoto.prop('src',d.image_url);
        }


        this.displayLoanAppDetails = (id=null,onFinish=null)=>{
           let p = {'loan_app_id':id};
           mThis.tblCols_body.empty();
           mThis.tblDoc_body.empty();
           mThis.imgProfilePhoto.prop('src',null);
           //if no loan_app_id given then Clear the form data
           if (!id || id===0){
              mThis.setFormData(null);
              if(typeof onFinish ==='function') onFinish();
              return;
           }

           post_ajax(`${mThis.base_url}/api/loanapp/info`,p,(res)=>{
                if(res.status_code ===200){
                    //let documents = StringSanitizer.sanitizeObject(res.data.documents);
                    //let collaterals = StringSanitizer.sanitizeObject(res.data.collaterals);
                    //let guarantors = StringSanitizer.sanitizeObject(res.data.guarantors);

                    let d = StringSanitizer.sanitizeObject(res.data,null,['image_url']);
                    //d.documents = documents;
                    //d.collaterals = collaterals;
                    //d.guarantors = guarantors;
                    mThis.readOnly = d.status_id > 1;
                    mThis.setFormData(d,mThis.readOnly);
                    if(typeof onFinish ==='function') onFinish(d);
                }
               
           });
        }


 }



let NewOrgDialog = new function(){
  let mThis = this;
  this.base_url = $('#__base_url').val();
  this.self = $('#dlgNewOrg');
  this.elTitle = $('#dlgNewOrgTitle');
  this.elError = $('#dlgNewOrg_error');

  this.btnOK = $('#dlgNewOrg_btnOK');
  this.elOrgName = $('#_new_org_name');
  this.elOrgIndustry = $('#_new_org_industry');
  this.elOrgType = $('#_new_org_type');

  this.loadFormOptions = (d, def,onFinish)=>{
      if(!def) def = {};

    CommonLib.setComboItems(mThis.elOrgIndustry,d.industries,'id','industry',0,'(Choose Indutry)',def.industry_id);
    // CommonLib.setComboItems(mThis.elOrgIndustry,d.org_types,'id','org_type',0,'(Choose Type)',def.org_type_id);
    if(def.industry_id > 0) mThis.elOrgIndustry.trigger('change');
    if(def.org_type_id > 0) mThis.elOrgType.trigger('change');
    if(typeof onFinish==='function') onFinish();
  }

  this.btnOK.on('click',(e)=>{
      e.preventDefault();
      let p = {
          'name':mThis.elOrgName.val(),
          'industry_id':mThis.elOrgIndustry.val(),
          'org_type_id':mThis.elOrgType.val()
      };

      if(!p.name){
          mThis.elError.text('Organization name cannot be empty!');
          return; 
      }

      if(!p.org_type_id){
        mThis.elError.text('Organization Type is not valid');
        return; 
      }

      if(!p.industry_id){
        mThis.elError.text('Please choose industry or sector');
        return; 
      }

      post_ajax(`${mThis.base_url}/api/settings/create-org`,p,(res)=>{
            if(res.status=='OK'){
                p.org_id = res.org_id;
                if(typeof mThis.onClose =='function') mThis.onClose(p);
                mThis.self.modal('hide');
            }else mThis.elError.text(res.error_message);

      });
  });

    this.self.on('shown.bs.modal',function(){
        mThis.elOrgName.focus();
        mThis.elOrgName.select();
    });

    this.show = (op,onClose)=>{
        if(!op) op ={};
        mThis.elTitle.html(op.title);
        mThis.onClose = onClose;
         
        mThis.loadFormOptions(op.form_options,null,()=>{
            mThis.self.modal({
                'backdrop':'static'
            });
        });
       
    }
  

};

//begin::dlgCollateral
let CollateralDialog = new function(){
    let mThis = this;
    this.elTitle = $('#dlgCollateralTitle');
    this.self = $('#dlgCollateral');
    this.base_url = main_view.base_url;
    this.btnOK = $('#dlgCollateral_btnOK');
    this.elCollateralType = $('#_coll_type');
    this.elError = $('#dlgCollateralError');

    this.fileInput = $('#_loanapp_fileInput');
    this.lnkAddFile = $('#_loanapp_lnkAddFile');
    this.lnkRemoveFile = $('#_loanapp_lnkRemoveFile');
    this.fileList = $('#_loanapp_file_list');
    this.reader = new FileReader();
    this.temp_id = null;
    this.attachments = [];

    this.btnOK.on('click',(e)=>{
        let p = mThis.getFormData();
        if (!p) return;

               //get existing collaterals being displayed in collateral table
               if (!p.collateral_type_id){
                  mThis.elError.html(LocaleManager.trans('Collateral Type is not valid','validation'));
                 return;
              } 
              let ps = LoanAppFormComponent.getCollaterals();
               
              if(!p.attachments) p.attachments= [];
              //Temporarily store file attachments of newly added Collateral in the array "mThis.collateral_attachments", which is array [{temp_id,file_type,file_content}]. This array is used to retrieve a set of files for each Collateral based on temporary collateral ID "temp_id"
               p.attachments.map((file)=>{
                LoanAppFormComponent.collateral_attachments.push({'temp_id':mThis.temp_id,'file_type':file.file_type,'file_content': file.file_content});
              });

              if (LoanAppFormComponent.loan_app_id > 0 || LoanAppFormComponent.loan_id > 0){
                 let data = {'loan_app_id':LoanAppFormComponent.loan_app_id,'loan_id':LoanAppFormComponent.loan_id,'collateral':p}; 
                 post_ajax(`${mThis.base_url}/api/loanapp/save-collateral`,data,(res)=>{
                    if(res.status_code ===200){
                        p.id = res.data.id; //gnewly generated collateral Id
                        ps.push(p); //add the newly entered Collateral
                        LoanAppFormComponent.displayCollaterals(ps);
                        
                        mThis.self.modal('hide');
                        if (typeof mThis.onClose ==='function') mThis.onClose(p);

                    }else mThis.elError.html(res.error_message);
                 });

              }else{
                    ps.push(p); //add the newly entered Collateral
                    LoanAppFormComponent.displayCollaterals(ps);
              }


  
    });
    
    //fileReader for new Collateral's Attachments
    this.reader.onload = (e)=>{
        e.preventDefault();
        // console.log(e.total); // file size 
        //Sanitize photo data or photo stream
        //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
        let photo_data = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

        /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
        let base64result = photo_data.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

        /*Get file extention or fileType from the base64 String */
        let file_type = photo_data.split('/')[1].split(';')[0];
        if (file_type === 'jpeg') file_type = 'jpg'; /* make file extension to 3 characters only */

        //Preview File content or Photo image
        //mThis.imgProfilePhoto.prop('src',photo_data);
        //for multiple attachments, use mThis.attachments.push({'temp_id','file_content','file_type'});
        

        mThis.attachments = [{
            //NOTE: temp_id is temporary collateral_id used to associate each attachments with collateral item. It is total collateral count +1
            'temp_id': mThis.temp_id, 
            'file_type':file_type,
            'file_content':base64result
        }];

         //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
         mThis.fileInput.val(null);
     }

     //CollateralDialog, file input
    this.fileInput.on('change',(e)=>{
        mThis.attachments = [];   //Comment this line if we allow multiple attachments
        let allowed_file_types = /(gif|image\/gif|jpe?g|image\/jpe?g|png|image\/png|pdf|application\/pdf|\.document|\.sheet|xlsx|docx|doc|xls|text\/plain|csv)$/i;

        //allow maximum 50 KB size of image
        let _max_size = 3000; 
        let files = mThis.fileInput.prop('files');
        //Note:  mThis.reader.readAsDataURL() triggers the reader.onLoad event above
        let file = files[0];
        if (file) {
            mThis.addFileToList(null);
            if (file.type.match(allowed_file_types)) {
                let _size = file.size;
                let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
                let i=0;
                while(_size>900){_size/=1024;i++;}
                let sizeInfo = {'size':(Math.round(_size*100)/100),'unit':fSExt[i] };
                
                if (sizeInfo.size >_max_size && sizeInfo.unit ==='KB') { 
                    cv_interact.alert(`File is too large. Max size allowed is ${_max_size}`);
                } else {
                    mThis.reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                    mThis.fileInput.val(null); //reset it to NULL so that user can select the same file again
                    //display the selected file name on the CollateralDialog form
                    mThis.addFileToList(file.name);
                }
                //mThis.elFileSize.val(_size);
                 
            } else {
                mThis.elError.html('The file type is not allowed');
            }
           
        }

    });

    this.lnkAddFile.on('click',(e)=>{
        e.preventDefault();
        mThis.fileInput.trigger('click');
    });

    this.lnkRemoveFile.on('click',(e)=>{
        e.preventDefault();
       mThis.addFileToList(null);
    });

    //addFileToList(null) is used to clear the fileList
    this.addFileToList = (file_name=null)=>{
       mThis.fileList.empty();
       if(!file_name){
            mThis.lnkAddFile.show();
            mThis.lnkRemoveFile.hide();
            return null;
       }
       mThis.fileList.append(`<li>${file_name}</li>`);
       
       if(mThis.singleFileMode){
            mThis.lnkAddFile.hide();
            mThis.lnkRemoveFile.show();
       }
    }

    this.prepareLoad = (collateral_id=0,onFinish)=>{
       post_ajax(`${mThis.base_url}/api/settings/collateral-types`,null,(res)=>{
            CommonLib.setComboItems(mThis.elCollateralType,res.data,'id','name',null,null);
            if (collateral_id>0){
                post_ajax(`${mThis.base_url}/api/loan/collateral-info`,null,(d)=>{
                    mThis.displayData(d.data);
                });
            }

            if(typeof onFinish ==='function') onFinish();
       });
    }

    //get collateral inputs (input data) from CollateralDialog form 
    this.getFormData = ()=>{
      let p = {};
      let has_error =0;
      //let err_element = null;
      mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if (el.data('error')==1){
                //err_element = el;
                //"ffield" = friendly field name
                err_field = el.data('ffield');
                el.parent().addClass('has-error');
                has_error = 1;
                return false;
            }
            p[f] = el.val();
      });

      if(has_error===1){
        mThis.elError.html(LocaleManager.trans( `${err_field} is not valid`,'validation'));
        return null;
      }
      p.collateral_type = mThis.elCollateralType.find('option:selected').text();

      //mThis.attachments on CollateralDialog form. For loan app form, => it is mThis.documents = []
      p.attachments = mThis.attachments;
      p.temp_id = mThis.temp_id;
      return p;
    }

    this.displayData = (d=null)=>{
      if(!d) d = {};
      mThis.self.find('.data-input').each(function(){
        let el = $(this);
        let f = el.data('field');
        el.val(d[f]);
      });
    }

    this.clearErrors = ()=>{
        mThis.elError.html(null);
        Validator.clearErrors(mThis.self);
    }
   
    //option = {'max_files':3,'temp_id'};  //temp_id is temporary collateral_id that is used to associate each attachment with the collteral item
    this.show = (option,onClose=null)=>{
        mThis.data =null;
        mThis.attachments = [];
        mThis.clearErrors();
        
        //temp_id is temporary collateral_id that is used to associate each attachment with the collteral item
        mThis.temp_id = option.temp_id;

        if(!$.isNumeric(option.max_files)) option.max_files=0;
        mThis.singleFileMode = (option.max_files==1 || option.max_files==0)?1:option.max_files;

        if (option.collateral_id > 0)
          mThis.title = LocaleManager.trans('Modify Collateral','titles');
        else
          mThis.title = LocaleManager.trans('New Collateral','titles');

        mThis.onClose = onClose;  
        //Clear File List
        mThis.addFileToList(null); 
        mThis.prepareLoad(option.collateral_id,()=>{
            mThis.elTitle.text(mThis.title);
            mThis.self.modal({
                backdrop:'static'
            });
        });      
    }
    
}
//end:: dlgCollateral


//begin:: AttachDialog
let AttachDialog = new function(){
    let mThis = this;
    this.self = $('#dlgAttach');
    this.fileChooser = $('#dlgAttach_fileInput');
    this.btnOK = $('#dlgAttach_btnOK');
    this.btnChooseFile = $('#dlgAttach_btnChooseFile');
    this.reader = new FileReader();
 
    this.elDes = $('#_attach_description');
    this.elFileType = $('#_attach_filetype');
    this.elFileSize = $('#_attach_filesize');

     this.btnChooseFile.on('click',(e)=>{
        //e.preventDefault();
        mThis.fileChooser.trigger('click');
     });
  
     //AttachDialog's fileInput
     this.fileChooser.on('change',function(e){
                 mThis.data = null;
                 let allowed_file_types = /(gif|image\/gif|jpe?g|image\/jpe?g|png|image\/png|pdf|application\/pdf|\.document|\.sheet|xlsx|docx|doc|xls|text\/plain|csv)$/i;
 
                  /*** allowed file types 
                     1. application/pdf
                     2. application/vnd.openxmlformats-officedocument.wordprocessingml.document
                     3. application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                   ***/
                   
                  //allow maximum 50 KB size of image
                  let _max_size = 3000; 
                  let files = mThis.fileChooser.prop('files');
                  //Note:  mThis.reader.readAsDataURL() triggers the reader.onLoad event above
                  let file = files[0];
                  if (file) {
                   
                      if (file.type.match(allowed_file_types)) {
                          let _size = file.size;
                          let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
                          let i=0;
                          while(_size>900){_size/=1024;i++;}
                          let sizeInfo = {'size':(Math.round(_size*100)/100),'unit':fSExt[i] };
                          
                          if (sizeInfo.size >_max_size && sizeInfo.unit ==='KB') { 
                              cv_interact.alert(`File is too large. Max size allowed is ${_max_size}`);
                          } else {
                              mThis.reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                              mThis.fileChooser.val(null); //reset it to NULL so that user can select the same file again
                          }
                          mThis.elFileSize.val(_size);
                           
                      } else {
                          cv_interact.alert('The chosen file type is not allowed!','','error');
                      }

                      mThis.elDes.val(file.name);
                      
                  }

     });

    this.btnOK.on('click',(e)=>{
        //let file = {'description':"",'base64':""};
        if(typeof mThis.onClose ==='function') mThis.onClose(mThis.data);
        mThis.self.modal('hide');
       
    });

    this.show = (op,onClose = null) =>{
       mThis.onClose = onClose;
       mThis.elDes.val(null);
       mThis.elFileSize.val(null);
       mThis.elFileType.val(null);
       mThis.data = null;

       mThis.self.modal({
        backdrop:'static'
       });
    }

    //mThis.reader on AttachDilaog (Document attachments for loan application)
    mThis.reader.onload = (e)=>{
        let photo_data = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

        /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
        let base64result = photo_data.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

        /*Get file extention or fileType from the base64 String */
        let file_type = photo_data.split('/')[1].split(';')[0];
        if (file_type === 'jpeg') file_type = 'jpg'; /* make file extension to 3 characters only */
        /* Display the selected photo image */
        //mThis.imgProfilePhoto.prop('src', photoData); // putting file in dom without server upload.
        mThis.elFileType.val(file_type);
        
        //## "New Attachment" Dialog (AttachDialog form)
        mThis.data = {
            'description':mThis.elDes.val(),
            'file_type': file_type,
            'file_content': base64result /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
        };
         
        // if (mThis.loan_app_id>0 || mThis.loan_id > 0 ){
        //         let p = {
        //             'file_content': base64result, /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
        //             'file_type': file_type,
        //             'loan_app_id':mThis.loan_app_id,
        //             'loan_id':mThis.loan_id  
        //         };
                
        //         post_ajax(`${mThis.base_url}/api/loanapp/save-attachment`,p,function(result) {

        //             if (result.status_code ===200)
        //             {
        //                 //mThis.imgProfilePhoto.prop('src',photo_data);
        //                 cv_interact.alert('File has been saved!');
        //             }
        //             else cv_interact.alert(result.error_message,'','error');
        //             //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
        //             mThis.fileChooser.val(null);
        //         });
        // }else{
           
        //     //mThis.imgProfilePhoto.prop('src',photo_data);
        //     //mThis.photo_data = base64result;
        //     //mThis.photo_file_type = fileType;
        //      //clear value of FileInput "fileChooser" to ensure second time it works for same file chosen
        //      mThis.fileChooser.val(null);
        // } 
    }
}
//end::AttachDialog

window.addEventListener('DOMContentLoaded',()=>{
    LoanAppFormComponent.init();
});