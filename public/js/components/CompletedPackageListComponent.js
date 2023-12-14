'use strict';
//## begin::CompletedPackageListComponent
//NOTE in converting from PackageListComponent to CompletedPackageListComponent => seach for "PackageListComponent.tblPackages" and "PackageListComponent.form_data" and replace it with "CompletedPackageListComponent."
var CompletedPackageListComponent = new function() {
    let mThis = this;
    // this.lang ='kh';
    this.title_prop = "Finished Packages";
    this.self = main_view.appContent.find('#_main_completedPackageListComponent');
    this.elFilter_period = this.self.find('#_cpl_filter_period');
    this.base_url = main_view.base_url; // this.self.find('#__base_url').val();
      
    this.div_filter_fields = main_view.appContent.children('#_cpl_dlgFilter').find('.modal-body')[0];

    //this.package_dropdown_menu = mThis.tblPackages.find('.dropdown-menu');

    //this.lnkReceivePackage = this.self.find('#_cpl_lnkReceivePackage');
    //this.btnScanBackIn = this.self.find('#_cpl_btnScanBackIn')[0];
    this.elSearchPackage = this.self.find('#_cpl_search')[0];
    this.btnSearch = this.self.find('#_cpl_btnSearch')[0];
    this.btnToggleFilter = this.self.find('#_cpl_btnToggleFilter')[0];

    this.btnPrint = this.self.find('#_cpl_btnPrint')[0];
    //this.btnPDF = this.self.find('#_cpl_btnPDF');
    this.btnExcel = this.self.find('#_cpl_btnExcel')[0];
   
    this.cols = [
                    {
                        // data:function(data,type,meta) {
                        //     return cnt++;
                        // },
                        // title:'NO.'
                        className:'col_action',
                        data:function(data,index,tr) {
                         let html =['<div class="dropdown">',
                             '<a href="javascript:void(0)" data-barcode="',data.barcode,'" data-id="',data.id,'" data-did="',data.delivery_id,'" data-statusid="',data.status_id,'" class="btn_cp_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-cube fs-5 text-warning text-opacity-25"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        data:function(data,index,tr){
                            return ['<div style="display:flex;flex-direction:row">',
                             '<div>',
                              '<span class="pg-barcode">',data.barcode,'</span>',
                               '<span class="pg-pickup_time d-block">',data.arrival_date,'</span>',
                               '<span class="d-block text-primary">ថ្ងៃបញ្ចប់ ',data.finish_time,'</span>',
                             '</div>',
                             '<a href="javascript:;" style="display:none" data-barcode="',data.barcode,'" class="_cpl_pa_quick_btn_barcode"><i class="fa fa-barcode" style="color:green"></i></a>',
                            '</div>'].join('');
                        },
                        title:'Barcode'
                    },
                    {
                        data:function(data,index,tr) {
                            if(!data.sender_phone) data.sender_phone ='(Contact not available)';
                            return ['<div style="display:flex;flex-direction:column;align-items:justify-content"><span class="pg-text pg-sender_name" data-field="sender_name">',data.sender_name,'</span><div style="display:flex;flex-direction:row">',
                            '<span class="pg-text pg-sender_type" data-field="sender_type">',data.sender_type,'</span>',
                            '<div style="width:15px"></div>',
                            '<span class="pg-text pg-sender_phone" data-field="sender_phone">',data.sender_phone,'</span>',
                            ,'</div></div>'].join('');
                        },
                        title:'Merchant'
                    },
                    {
                        data:function(data,index,tr) {
                            if(!data.product_type) data.product_type ='Generic Product';
                          
                            if(!data.receiver_phone || data.receiver_phone =='') 
                              data.receiver_phone ='<span class="pg-no_customer_phone">Customer phone not avaialable</span>';
                            else
                              data.receiver_phone =['<span class="pg-text pg-receiver_phone" data-type="number" data-field="receiver_phone">',data.receiver_phone,'</span>'].join('');  
                            return ['<div class="d-flex-fex-row">',
                                 '<div style="display:flex;flex-direction:column;align-items:space-between">',
                                      '<span class="pg-text pg-product_type text-nowrap" data-field="product_type">',data.product_type,'</span>',
                                      '<div class="w-100">',data.receiver_phone,'</div>',
                                 '</div>',
                            '</div>'].join('');
                        },
                        title:'Package Info' 
                    },
                    {
                        data:function(data,index,tr) {
                            if(!data.zone_code) data.zone_code ='(Zone code)';
                            if(!data.zone_name) data.zone_name ='(Zone Name)';
                            return ['<div style="display:flex;flex-direction:column;align-items:justify-content;margin-top:-10px"><span class="pg-text pg-zone_code" data-field="zone_code">',data.zone_code,'</span><span class="pg-text pg-zone_name" data-field="zone_name">',data.zone_name,'</span></div>'].join('');
              
                        },
                        title:'Destination'
                    },
                    {
                        title:'Service Type',
                        data:(data,index,tr)=>{
                            let pickup_driver_name = data.pickup_driver_name? ['Picked by: ',data.pickup_driver_name].join(''):'';
                            return  ['<div class="d-flex flex-column">','<span class="pg-text pg-delivery_type pg-badge-delivery_type" style="margin-left:30%" data-field="delivery_type">',data.delivery_type,'</span>','<span>',pickup_driver_name,'</span>','</div>'].join('');
                        }
                    },
                    {
                        className:'package-status',
                        data:function(data,index,tr) {
                            let str_driver = ['<a href="javascript:void(0)" class="_pol_driver_name">',data.driver_name?data.driver_name:'មិនមានអ្នកដឹក','</a>'].join('');
                            
                             //set failure notes | remarks | package ramarks
                             let notes = (data.status_id==9 || data.status_id==11 || data.status_id ==10)? data.failure_notes:data.delivery_notes;
                             let cls_status = DUtil.getStatusClass(data.status_id);
                             return ['<a data-notes="',notes,'" class="',cls_status,' pg-text _pol_status" data-field="status" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" data-senderid="',data.sender_id,'" href="javascript:;">',data.status,'</a>',str_driver].join('');
                        },
                        title:'Status'
                    },
                    {
                          className:'total', //css class "total" is used for accessing value and update values of totals in <td>
                          data:function(data,index,tr){
                            let merchant_paid='';
                            let driver_paid = '';
                             if(data.status_id ==8){
                                merchant_paid = data.sender_pmt_status_id == 1? `<span class="text-success ml-1" style="font-size:0.8em">(Paid)</span>`:`<span class="ml-1 text-danger" style="font-size:0.8em">(Unpaid)</span>`;
                                driver_paid = data.driver_pmt_status_id == 1? `<span class="text-success ml-1" style="font-size:0.8em">(Paid)</span>`:`<span class="ml-1 text-danger" style="font-size:0.8em">(Unpaid)</span>`;
                             }
                            return ['<div style="display:flex;flex-direction:column">',
                                '<div class="pg-total_driver"><span class="total-label">Driver:</span><span class="total-value driver-total">',data.driver_total,driver_paid,'</span></div>',
                                '<div class="pg-total_sender"><span class="total-label">Sender:</span><span class="total-value sender-total">',data.sender_total,merchant_paid,'</span></div>',
                            '</div>'].join(''); 
                        },
                        title:'Totals'
                    }
                ];
 
    this.initOnce = function() {
        if(mThis.initAlready) return;
        
        //FilterDialog_cpl.loadFilterData();

        mThis.listView = new ListView('_cpl_package_list', {
            'columns':mThis.cols,
            // 'clientSidePagination':true,
            // 'processResponse':(res)=>{ 
            //   return res.data.data;
            // },
            //'paginationContainer': document.querySelector('#test_div'),
            'apiCluster':main_view.apiCluster,
            'fetchApi': `${main_view.base_url}/api/completed-package/list`,
            'apiCluster': main_view.apiCluster,
            'tableClass':'header-uppercase table',
            'perPage': 6,
            'rowCreated':(data,index,tr) =>{
                tr.classList.add('package_header');
                tr.dataset.id = data.id;
                tr.dataset.barcode = data.barcode;
                tr.dataset.senderpmtstatusid = data.sender_pmt_status_id ==1? data.sender_pmt_status_id :0;
                tr.dataset.driverpmtstatusid = data.driver_pmt_status_id ==1? data.driver_pmt_status_id:0;
                tr.dataset.senderid = data.sender_id;
                tr.dataset.zonecode = data.zone_code || '';

               //begin::init Popover view
                    const btnStatus = tr.querySelector('._pol_status');
                    //if(btnStatus){
                        const notes = btnStatus.dataset.notes;
                        //const status_id = btnStatus.dataset.statusid;
                        if (notes) {
                            $(btnStatus).popover({
                                html: true,
                                trigger: "hover",
                                title: ["<span class='pg-remarks-title'>Remarks</span>"].join(''),
                                content: notes
                            });
                        }
                    //} 
               //end::Init Popover view


            },
            'listContainerClass': null
        });

        mThis.tblPackages = $(mThis.listView.getTable());

        mThis.cfg = new ExpandableRowConfig(mThis.tblPackages.attr('id'), {
            dontExpandByClickingOn: ['btn_cp_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                let pid = parent_tr.dataset.id;
                let barcode = parent_tr.dataset.barcode;
                //let sender_pmt_statu_id = parent_tr.dataset.senderpmtstatusid;
                //let driver_pmt_statu_id = parent_tr.dataset.driverpmtstatusid;
                container.dataset.id = pid;
                container.dataset.barcode = barcode;
                container.dataset.senderid = parent_tr.dataset.senderid;
                container.dataset.zonecode = parent_tr.dataset.zonecode;
                container.dataset.driverpmtstatusid = parent_tr.dataset.driverpmtstatusid;
                container.dataset.senderpmtstatusid = parent_tr.dataset.senderpmtstatusid;

                detail_tr.barcode = barcode;
                detail_tr.id = pid;
                mThis.ExpandableDetails.displayPackageDetails(container,pid,true);
            },
        });

        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
            el.onChange = e =>{
                e.preventDefault();
                if(!mThis.filter_disabled){
                     mThis.listView.showPage(mThis.getFilterData());
                }
            }
        });

         mThis.btnSearch.addEventListener('click', e =>{
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
         });

         mThis.elSearchPackage.addEventListener('keyup',e => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.listView.showPage(mThis.getFilterData());
            },250);
         });
        
         this.btnToggleFilter.addEventListener('click',e=>{
            e.preventDefault();
             const op = {
                "onClose": (d) =>{
                   //Clear Search value when user uses Filter Dialog 
                   mThis.elSearchPackage.value = '';
                    mThis.listView.showPage(d);  
                }
             };
             FilterDialog_cpl.show(op);
         });

         mThis.btnPrint.addEventListener('click',e =>{
            const d = mThis.getFilterData();
             const param_string = ReportCenter.translateToQueryString(d);
            let params = ['rtype=package_list&completed=1&',param_string].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms-gen-report/',d].join(''),'_blank'); 
            });
         }); 

        //  this.btnPDF.on('click',function(e){
        //    let p = FilterDialog_cpl.getData();
        //    p.search_value = mThis.elSearchPackage.val();
        //    let sub_title =null;
        //    if(p.start_date && p.end_date) [p.start_date,' to ', p.end_date].join('');
        //    let rpt_title = 'Completed Package List';
        //    if (mThis.lang == 'kh') rpt_title = 'បញ្ជីរកញ្ចប់ទំនិញដែលបានបញ្ចប់';
        //    try {
        //         vsapi.call(`${mThis.base_url}/api/getCompletedPackageList_print`,p).then(res => {
        //             if(res.status_code === 200){
        //                 let data = res.data;
        //                 //data = StringSanitizer.sanitizeObject(data,'email');
        //                 //mThis.processPackageList_print() return object @d = {'data':json array,'titles':[]}
        //                 let d = mThis.processPackageList_print(data);
        //                 let op = {'title':rpt_title,'title_color':'blue','subTitle':sub_title,'header_columns':d.titles};
        //                 pdfReport.viewPDF_json(d.data,op); 
        //             } 
        //    });           
        //    }catch(e){
        //        cv_interact.error(e.toString());
        //    } 
        //  });

        // this.btnExcel.addEventListener('click',function(e){
        //     let p = FilterDialog_cpl.getData();
        //     p.search_value = mThis.elSearchPackage.val();
        //          vsapi.call(`${mThis.base_url}/api/completed-package/list-all`,p).then(res => {
        //              if(res.status_code === 200){
        //                 let data = res.data;
        //                  let d = mThis.processPackageList_print(data);
        //                  JsonToExcel.exportToExcel(d.data,'package_list',d.titles);  
        //              } 
        //     });
        // });
         
      //##BEGIN:: tblPackages dropdown menu
                mThis.tblPackages.on('click', (e) => {
                    // Check if the clicked element has the class 'btn_cp_action'
                    let btn = VSUtil.getElementByClass(e.target,'btn_cp_action');
                    if (btn) {
                        e.preventDefault();

                        let p = btn.parentElement;
                     
                        let package_id = btn.dataset.id;
                        let barcode = btn.dataset.barcode;
                        let delivery_id = btn.dataset.did;
                        let status_id = btn.dataset.statusid;

                        let dropdownMenu = p.querySelector('.dropdown-menu');

                        if (!dropdownMenu || dropdownMenu.length <= 0) {
                            const dropdownMenuHtml = mThis.createDropdownMenuHtml_package(delivery_id, package_id, barcode, status_id);
                            p.insertAdjacentHTML('beforeend', dropdownMenuHtml);
                            dropdownMenu = p.querySelector('.dropdown-menu');
                        }

                        // Style for "dropdown-menu" class
                        dropdownMenu.classList.toggle('show');

                        // Remove 'show' class from the previous dropdown menu if it exists
                        if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                            mThis.prev_dropdownMenu.classList.remove('show');
                        }

                        // Store the current dropdown menu as the previous one
                        if (dropdownMenu.classList.contains('show')) {
                            mThis.prev_dropdownMenu = dropdownMenu;
                        }
                        return;
                    }
                });
 
                // $(document).on('click',function(e){
                //     //e.preventDefault();
                //     let x = mThis.tblPackages.find('div.dropdown-menu'); 
                //     let container =  x.parent(); 
                //     //mThis.package_dropdown_menu.parent(); // div.dropdown
                //     if(container){
                //         if (!container.is(e.target) && container.has(e.target).length === 0) {
                //             //mThis.package_dropdown_menu.removeClass('show');
                //             x.removeClass('show'); 
                //         } 
                //     }
                // });

                document.addEventListener('click', function (e) {
                    mThis.tblPackages[0].querySelectorAll('div.dropdown-menu').forEach(dropdownMenu => {
                        if (!dropdownMenu.parentElement.contains(e.target)) {
                            dropdownMenu.classList.remove('show');
                        }
                    });
                });
 
                mThis.tblPackages.on('mouseover','tr',function(e){
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_barcode = x.find('a._cpl_pa_quick_btn_barcode');
                    btn_barcode.show();
                    col_action.find('a.btn_cp_action>i').addClass('action-button-zoomin');    
                }).on('mouseleave','tr',function(e) {
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_barcode = x.find('a._cpl_pa_quick_btn_barcode');
                    btn_barcode.hide();
                    col_action.find('a.btn_cp_action>i').removeClass('action-button-zoomin');
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });

                // /** NOTE: because mThis.tblPackages is a jQuery object , so we use mThis.tblPackages[0] */
                // mThis.tblPackages.on('mouseover', function (e) {
                //     if (e.target.tagName === 'TR') {
                //         const x = e.target;
                //         const colAction = x.querySelector('td.col_action');
                //         const btnBarcode = x.querySelector('a._cpl_pa_quick_btn_barcode');
                //         if(btnBarcode) console.log(' found btnBarcode');
                //         btnBarcode.style.display = 'block';
                //         colAction.querySelector('a.btn_cp_action i').classList.add('action-button-zoomin');
                //     }
                // });
                
                // mThis.tblPackages.on('mouseleave', function (e) {
                //     if (e.target.tagName === 'TR') {
                //         const x = e.target;
                //         const colAction = x.querySelector('td.col_action');
                //         const btnBarcode = x.querySelector('a._cpl_pa_quick_btn_barcode');
                //         btnBarcode.style.display = 'none';
                //         colAction.querySelector('a.btn_cp_action i').classList.remove('action-button-zoomin');
                //         colAction.querySelector('div.dropdown-menu').classList.remove('show');
                //     }
                // });
       //##END:: tblPackages dropdown menu
   
    //    mThis.tblPackages.on('mouseover', 'button._pol_status', function (e) {
    //     let popper_notes = new Popper($(this), mThis.popper_div, {
    //         placement: 'top'
    //     });
    //     popper_notes.show();
    //   }).on('mouseleave', 'button._pol_status', function (e) {
    //     return;
    //   });

       mThis.tblPackages.on('click',e =>{
           e.preventDefault();

           //Click on delete menu item
           let btn = VSUtil.getElementByClass(e.target,'_pl_pa_delete');
           if(btn){
                let package_id = btn.dataset.id;
                let barcode = btn.dataset.barcode;
                //let delivery_id = btn.dataset.did;
                cv_interact.confirm('Delete this package?',{'title':'Delete Package','context':'delete'}, e => {
                    if(e) {
                        mThis.deletePackage(barcode,package_id);
                    }
                });
                return;
           }


                //Click on barcode menu item
                btn = VSUtil.getElementByClass(e.target,'_cpl_pa_print_barcode');
                if(btn){
                    const barcode = btn.dataset.barcode;
                    window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
                }
               

                 //Click on Quick barcode icon
                 btn = e.target.closest('._cpl_pa_quick_btn_barcode');
                 if(btn){
                    const barcode = btn.dataset.barcode;
                    window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
                 }
       });
   
        
    //    //Update Delviery status
    //    mThis.tblPackages.on('click','a._cpl_pa_change_status',function(e){
    //         e.preventDefault();
    //         let tr = $(this).closest('tr');
    //         let delivery_id = tr.data('did');
    //         let pid = tr.data('pid');
    //         //let driver_id = tr.data('driverid');
    //         let def_status_id = tr.data('statusid');
    //         //let sender_id = tr.data('senderid');
 
    //         let option = {
    //             "title":"Set Package Status",
    //             "data":mThis.statuses,
    //             "textMember":"status_name", //status code
    //             "valueMember":"id",  // status name of delivery. Whereas status_id is used in table order.status_id
    //             "dataLabel":"Choose package status",
    //             'blankErrorMessage':'Please select one status',
    //             'okBtnText':'OK',
    //             'defaultValue': def_status_id
    //         };

    //         InputBox2.show(option,function(data) {
    //             if(data) {
    //                 let p = {
    //                     "delivery_id":delivery_id,
    //                     "package_id":pid,
    //                     "status_id":data.value
    //                 };
                    
    //                 vsapi.call(`${mThis.base_url}/api/updatePackageStatus`,p).then(res => {
    //                     if(res.status_code === 200) {
    //                         let data = res.data;
    //                         let td = tr.find('td.package-status');
    //                         td.find('a.pg-text').text(data.text); 
    //                         //mThis.ExpandableDetails.refreshPackageData(tr,pid);
    //                     } else cv_interact.error(res.error_message);
    //                 });
    //              }
    //         });
    //    });
 
        // mThis.tblPackages.on('click','a._cpl_pa_quick_return_package',function(e){
        //     e.preventDefault();
        //     let x =$(this);
        //     let tr = x.closest('tr');
        //     let p  = {'package_id':tr.data('pid')};
        //     //let def_driver_id = tr.data('driverid');
        //     cv_interact.confirm('Return this package?',{title:'Return Package',context:'update'},function(e){
        //             if(e){
        //                 vsapi.call(`${mThis.base_url}/api/returnPackage`,p).then(res => {
        //                     if(res.status_code === 200){
        //                        //update status on package trail | updatePackageStatus() || displayPackageStatus() || displayStatus()
        //                        let btn = tr.find('a._pol_status');
        //                        btn.data('statusid',11);
        //                        btn.data('status','Returned');
        //                        btn.text('Returned');
        //                     }else cv_interact.error(res.error_message);
        //                 }); 
        //             }
        //     });

          
        // });
      
     // //BEGIN:: listen to private event from backend (private channel)
        //         window.Echo.private(main_view.backend_channel_name).listen( '.package_status_changed',(d) =>{
        //             let data = d.data;
        //             toastr.info(DUtil.escapeHtml(data.message),data.title);
        //             main_view.addNotificationItem({'title':data.title,'message':data.message});

        //             if(mThis.tblPackages.is(':visible')){
        //                 let tr = mThis.findRowByBarcode(data.bar_code);
        //                 mThis.displayDriverData(tr,{"driver_id":data.driver_id,"driver_name":data.driver_name,'status':data.status,'status_id':data.status_id});
        //             }
                
        //         });
        //  //END:: listen to private event from backend (private channel)

        // //initialize class "ExpandableDetails", which is the package's dropdown expanded detail
        // mThis.ExpandableDetails.init();
        // mThis.initialized = true;
        mThis.initAlready = true;
    }
    //end::CompletedPackageListComponent.init() | end::init()
 
    this.findRowByBarcode = (barcode)=>{
       let tr = null; 
       mThis.tblPackages.find(`tr.package_header`).each(function(){
           tr = $(this);
           if(tr.data('barcode')==barcode) return false; 
       });
       return tr?tr:{};
    }
    //loadFilterData() on CompletedPackageListComponent
    this.loadFilterData = (onFinish) => {
       onFinish();    
    }

    this.getFilterData = ()=>{
       let p = {
        "search_value": mThis.elSearchPackage.value
       };
       mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
          const f = el.dataset.field;
          p[f] = el.value;
       });
       return p;
    }

    this.show = (options=null)=>{
        mThis.initOnce();
        mThis.loadFilterData(()=>{
            mThis.listView.showPage(mThis.getFilterData());
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop); 
            mThis.self.fadeIn(200);
        });
    }
    
    // this.processPackageList_print = (data)=>{
    //     let titles =['No','Barcode','Date','Sender','Customer','Driver','Type','COD','Fees','Total','Status'];
    //     if (mThis.lang =='kh') titles =['ល.រ','លេខកួដ','កាលបរិច្ចេទ','អ្នកផ្ញើរ','អ្នកទទួល','អ្នកដឹក','សេវា','ថ្លៃទំនិញ','ថ្លៃសេវា','សរុប','ស្ថានភាព'] 
    //     let c,i=0;
    //     let rows=[];
    //     do{
    //       c = data[i];
    //       if(!c) break;
    //          if(!c.cur) c.cur ='$';
    //          if(!c.cod_amount) c.cod_amount =0;
    //          if(!c.fees) c.fees=0;
    //          let row = {'No':(i+1),'barcode':c.barcode,'booking_date':c.booking_date,'sender':[c.sender_name,'\n',c.sender_phone].join(''),'zone_name':[c.zone_name,'\n',c.receiver_phone].join(''),'driver':c.driver_name,'type':c.delivery_type,'cod':[c.cur,c.cod_amount].join(''),'fees':[c.cur,c.fees].join(''),'total':[c.cur,c.driver_total].join(''),'status':c.status};
    //           rows.push(row);
    //          i++;
    //     }while(c);
    //     return {'data':rows,'titles':titles};
    // }

    // this.displayDriverData = (tr,d)=>{
    //      let prev_did =0;
    //      let cnt =0;

    //    if (tr){
    //         tr.data('driverid',d.driver_id);
    //         tr.find('a._pol_driver_name').text(d.driver_name);
    //         let lnkStatus = tr.find('td.package-status').find('a._pol_status');
    //         lnkStatus.text(d.status);
    //         lnkStatus.data('statusid',d.status_id);
    //         tr.data('statusid',d.status_id);
             
    //         let d_tr = tr.next();
    //         if(d_tr.hasClass('package_detail')) {
    //             d_tr.find('span.pg-driver').text(d.driver_name);
    //         }

    //         //Change the look of Status button according to status_id
    //           let statusClass = DUtil.getStatusClass(d.status_id);
    //           lnkStatus.attr('class', statusClass + ' pg-text _pol_status');
    //         return true;
    //    }  

    //    mThis.tblPackages.find('tr.package_header').each(function(){
    //         cnt++;
    //         let x = $(this);
    //         let this_id = x.data('did');
    //         let found = false;
    //         if(this_id === delivery_id) {
    //             x.data('driverid',d.driver_id);
    //             x.find('a._pol_driver_name').text(d.driver_name);
    //             let lnkStatus = x.find('td.package-status').find('a._pol_status');
    //             lnkStatus.text(d.status);
    //             lnkStatus.data('statusid',d.status_id);
    //             x.data('statusid',d.status_id);

    //             let d_tr = x.next();
    //             if(d_tr.hasClass('package_detail')) {
    //                 d_tr.find('span.pg-driver').text(d.driver_name);
    //             }
    //             prev_did = this_id;
    //             found = true;
    //         } else {
    //             if(found==true) return false;
    //         }
    //    });
         
    //     // //the following is to update driver in one row only
    //     //// the following code needs parameter @tr html row
    //     //     let detail_tr = null;
    //     //     if(tr.hasClass('package_detail')) 
    //     //     detail_tr = tr;
    //     //     else {
    //     //         detail_tr = tr.next();
    //     //     }
        
    //     //     if(detail_tr){
    //     //         if(detail_tr.hasClass('package_detail')) {
    //     //             let span = detail_tr.find('span.pg-driver');  
    //     //             span.text(driver.driver_name);
    //     //         } 
    //     //     }
    //     // //the above code is to update driver data in one row only
    // }

    this.localizePackageStatuses = (onFinish)=>{
        vsapi.call(`${mThis.base_url}/api/getComboItems_package_status`,null).then(res => {
            if(res.status_code === 200){
                let rows = res.data;
                mThis.statuses = StringSanitizer.sanitizeObject(rows);
                if(typeof onFinish =='function') onFinish();
            }
         }); 
    }
   
    this.createDropdownMenuHtml_package =(delivery_id,package_id,barcode,status_id)=> {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu bg-white shadow" data-deliveryid="',delivery_id,'" data-id="',package_id,'" data-barcode="',barcode,'" data-statusid="',status_id,'">',
          '<a data-id="',package_id,'" data-barcode="',barcode,'"  class="dropdown-item _cpl_pa_print_barcode" href="#"><i class="fa fa-barcode" style="color:green"></i> Print Barcode</a>',
          '<div class="dropdown-divider"></div>',
          '<a data-id="',package_id,'" class="dropdown-item _pl_pa_delete" href="#"><i class="fa fa-trash-can  text-danger" style="color:red"></i> Delete Package</a>',
        '</div>'].join('');
        return html;
    };

    this.deletePackage = (barcode,package_id)=>{
        let p = {'barcode':barcode?barcode:'','id':package_id};
       vsapi.call(`${mThis.base_url}/api/completed-package/delete`,p).then(res => {
         if(res.status_code === 200) {
             mThis.listView.showPage(mThis.getFilterData());
             cv_interact.success('Package was deleted');
         } else cv_interact.error(res.error_message);
       });
    }
 
    //## begin::ExpandableDettails class Package's expanded detail class view 
    this.ExpandableDetails = new function(){
       this.is_editing = false;
       let mThis = this;
       this.base_url = main_view.base_url;
       this.inputs = {};

       this.setBilledKg = (pd_container)=>{
            let actual_kg = 0, str_size ='';
            let elBillKg =null;
            pd_container.querySelectorAll('.data-input').forEach(el =>{
               let f = el.dataset.field;
               if(f ==='actual_kg') actual_kg = el.value;
               else if(f==='size') str_size = el.value;
               else if(f ==='billed_kg') elBillKg = el;
            });

            let size = mThis.processPackageSize(str_size);
            let b = (size.width * size.length * size.height)/6015;
            let billed_kg = 0 ;
            if (actual_kg >= b) billed_kg = actual_kg; else billed_kg = b;
            elBillKg.value = Number(billed_kg).toFixed(2);
            //mThis.getDeliveryPriceInfo(pd_container);
        }

        /** priceFactorInfo = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};  */  
        this.getDeliveryPriceInfo = (pd_container)=>{
            let pid = pd_container.dataset.id;
            //let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};  
            let p = mThis.getPriceFactors(pd_container);
            vsapi.call(`${mThis.base_url}/api/package/price-info`,p,false).then(res => {
               if(res.error_message) {
                 cv_interact.warning(res.error_message);
               } 
               else{
                let d = StringSanitizer.sanitizeObject(res.data);
                mThis.inputs.base_fee.value = d.base_fee;
                mThis.inputs.delivery_fee.value = Number(d.delivery_fee).toFixed(2);
 
                let driver_total =0;
                let sender_total =0;
                let price = parseFloat( mThis.inputs.price.value);
                let cod =   parseFloat( mThis.inputs.cod.value);
                let zone_code = mThis.inputs.zone_code.value;
                let forwarding_cost =  parseFloat(mThis.inputs.forwarding_cost.value);
                let cod_fee = 0, cod_amount = 0;
                if (cod==1 || cod =='yes') {
                    //alert(price + '|' + d.base_fee  + '| ' + d.delivery_fee + ' | ' + d.cod_fee_percent);
                    cod_fee = (price + parseFloat(d.base_fee) + parseFloat(d.delivery_fee)) * parseFloat(d.cod_fee_percent)/100;
                    cod_amount = price;
                }
                
                driver_total = parseFloat(cod_amount);
                sender_total = cod_fee + forwarding_cost; //Seller or sender always has to pay for taxi or forwarding cost

                mThis.inputs.cod_fee.value = Number(cod_fee).toFixed(2);
                let df_payer =   mThis.inputs.df_payer.value;
                if((df_payer+'').toLowerCase() =='sender')
                    sender_total += parseFloat(d.base_fee) + parseFloat(d.delivery_fee);
                else
                    driver_total += parseFloat(d.base_fee) + parseFloat(d.delivery_fee) - Math.abs(forwarding_cost); // pay taxi fee back to driver
                //begin:: update values on header fields
                  let receiver_phone = mThis.inputs.receiver_phone.value;
                  let receiver_address = mThis.inputs.receiver_address.value;
                  //let zone_name ???
                  mThis.header_totals = {"id": pid,'sender_total':sender_total,'driver_total':driver_total,'receiver_address':receiver_address,'receiver_phone':receiver_phone,'zone_code':zone_code,'zone_name':'???'};    
                    //let tr = pd_container.closest('tr').previousElementSibling;
                   //mThis.setTotals(tr,mThis.header_totals );
                //end::update values on header fields
               }
            });

        }

       //calculateTotals() on package's "ExpandableDetails" 
       //paramter @orinin is in fact the source of change in value that can causes changes in other values. It is same as field name. 
       //parameter @origin is to avoid cicular event firing causing infinite firing or loops. 
       //parameter @orgin is IMPORTANT for 3 input fields : base_fee, delivery_fee, billed_kg, where these fields are resulted from changes in other vars, but user can also change these value directly
    //    this.calculateTotals = (tr,origin=null)=>{
    //        if (!tr) return;
    //        let pd_container = tr.find('div.pd-container');
    //        let priceInfo = mThis.senderPriceInfo?mThis.senderPriceInfo:{}; 
    //        if(!priceInfo) priceInfo = {'sender_id':null,'price_per_kg':0.15,'base_fee':0,'cod_fee_percent':0.05};
    //        //let size_str = pd_container.find('input.size').val();
    //        let actual_kg = parseFloat(pd_container.find('input.actual_kg').val());
    //        if(!$.isNumeric(actual_kg)) actual_kg=0;

    //         //    let size = mThis.processPackageSize(size_str,true);
    //         //    let billed_kg =0;

    //         //    let cod =  pd_container.find('select.cod').val();
    //         //    if(!$.isNumeric(cod)) cod =0;

    //         //    mThis.setTotals(tr,priceInfo);  
    //    } 
 
       //keywords: updateDriverTotal(), updateTotals, refreshTotals(), 
       //Set total columns. "Total Driver", "Total Sender", "Income", "cost","profit"
       //paramter @tr here is the <tr.package_detail>, which is the detail expanded row, not header row 
       // @data={'driver_total':0,'sender_total':0} // "sender_total" is amount to be paid by sender, not amount to pay to sender such as COD amount
       this.setTotals = (tr, data)=>{
          if(!tr) return null; 
          let pid = tr.dataset.id; 
          //let header_tr = tr.prev(); //header row <tr.package_header> that contains "total" element to be displayed

          if(tr.classList.contains('package_header')){
              //Check to make sure the package_id in detailed row match with the packag_id in header row
              if(data.id == pid){
                 let td = tr.querySelector('td.total'); //tr.package_header>td.totals> contains div and span displaying driver-total, and sender-total 
                 let span_total_driver = td.querySelector('span.driver-total');
                 let span_total_sender = td.querySelector('span.sender-total');
                 data.driver_total = isNaN(data.driver_total)? 0: data.driver_total; 
                 data.sender_total = isNaN(data.sender_total)? 0 : data.sender_total;
                 span_total_driver.textContent =  Number(data.driver_total).toFixed(2);
                 span_total_sender.textContent =  Number(data.sender_total).toFixed(2);
              }
          }

       }

       //refresh display of package all data including package's ehader info and expanded dropdown details
        //parameter @tr is html row object (jquery object) that represents the package header row <tr.pg-header> 
        this.refreshPackageData = (tr,pid)=> {
               if(!tr) return;
                let p = {'id':pid};
                //css class "pg-text" refers to every <td> or <span> or <div> that contains data value or text such as sender_name, sender_type, sender_phone, etc... on <"tr.pg-header"> row
                //css class ="vc-value" refers to very <span> in "tr.pg-detail" row that contains data for each field of the package's expaned details
                vsapi.call(`${mThis.base_url}/api/pacakge/details`,p).then(res => {
                    if(res.status_code === 200){
                        let d = StringSanitizer.sanitizeObject(res.data,null,['email']);
                        tr.querySelector('td.pg-text').forEach(x => {
                            let data_member = x.dataset.field;
                            let itemName =null;
                            //if(data_member =='email') itemName = 'email'; //anitize email differently by allowing '@' charater
                            x.textContent =  d[data_member]
                        });
                        let next_tr = tr.nextSiblingElement;
                        if(next_tr){
                          let container = next_tr.querySelector('div.expandable-row');
                          mThis.currency_symbol = d.currency_symbol || '$';
                          if(container) mThis.renderPackageDetails(container,d);
                        }
                    }       
                });
        } 
  
    mThis.displayPackageDetails = (container,id,can_edit=false)=>{
        //container.style.display ='none';
        vsapi.call(`${mThis.base_url}/api/package/details`,{"id":id},null).then(res => {
             let d = res.status_code === 200? StringSanitizer.sanitizeObject(res.data) : {};
             d = d || {};
             mThis.currency_symbol = d.currency_symbol || '$';
             //container.style.display ='block';
             mThis.renderPackageDetails(container,d,can_edit);
        });
    }
    this.currency_symbol ='$';
    this.fields = [
        {
            "name":"receiver_phone",
            "label":"Receiver",
            "required":1,
            "inputType":"text" 
        },
        {
            "feeFactor":true,
            "name":"price",
            "label":"Price",
            "required":0,
            "value": (data)=>{
                return [ mThis.currency_symbol,' ',data.price].join('');
            },
            "inputType":"number" 
        },
        {
            "feeFactor":true,
            "name":"cod",
            "label":"COD",
            "value": (data)=>{
                return data.cod ==1? "Yes":"No";
            },
            "required":1,
            "inputType":"select",
            "options":{
                "valueField":"cod",
                "textField":"cod_name" 
            } 
        },
        {
            "feeFactor":true,
            "name":"zone_code",
            "label":"Zone",
            "required":1,
            "value":(data)=>{
               return [data.zone_name,' (',data.zone_code,')'].join('');
            },
            "inputType":"select",
            "options":{
                "valueField":"zone_code",
                "textField":"zone_name" 
            }  
        },
        {
            "name":"base_fee",
            "label":"Base fee",
            "readOnly":true,
            "value": (data)=>{
                return [ mThis.currency_symbol,' ',data.base_fee].join('');
            },
            "required":0,
            "inputType":"number" 
        },
        {
            "name":"delivery_fee",
            "label":"Additional fee",
            "readOnly":true,
            "value": (data)=>{
                return [ mThis.currency_symbol,' ',data.delivery_fee].join('');
            },
            "required":0,
            "inputType":"number" 
        },
        {
            "name":"size",
            "label":"Size (W x L x H)",
            "value":(data) =>{
                return [Number(data.dim_y),' x ',Number(data.dim_x),' x ',Number(data.dim_h),' cm'].join('');
             },
            "formattedValue":(data) =>{
              return [Number(data.dim_y),' ',Number(data.dim_x),' ',Number(data.dim_h)].join('');
            },
            "required":0,
            "inputType":"text" 
        },
        {
            "feeFactor":true,
            "name":"billed_kg",
            "label":"Billed kg",
            //"currency": mThis.currency_symbol,
            "value":(data) =>{
              return [data.billed_kg,' kg'].join('');
            },
            "required":0,
            "inputType":"number" 
        },
        {
            "name":"actual_kg",
            "label":"Actual kg",
            //"currency": mThis.currency_symbol,
            "value":(data) =>{
              return [data.actual_kg,' kg'].join('');
            },
            "required":0,
            "inputType":"number" 
        },
        {
            "feeFactor":true,
            "name":"df_payer",
            "label":"Fee Payer",
            "inputType":"select",
            "options":{
                "valueField":"df_payer",
                "textField":"df_payer" 
            },
            "value":(data) =>{
              return data.df_payer;
            },
            "required":0
        },
        {
            "name":"cod_fee",
            "label":"COD Fee",
            "readOnly":true,
            //"currency": mThis.currency_symbol,
            "value":(data) =>{
              return [mThis.currency_symbol,' ',data.cod_fee].join('');
            },
            "required":0,
            "inputType":"text" 
        },
        {
            "feeFactor":true,
            "name":"delivery_type",
            "label":"Delivery Type",
            "value":(data) =>{
              return data.delivery_type;
            },
            "required":1,
            "inputType":"select",
            "options":{
                "valueField":"delivery_type",
                "textField":"delivery_type", 
            } 
        },
        {
            "name":"receiver_address",
            "label":"Receiver Address",
            "required":1,
            "inputType":"text" 
        },
        {
            "feeFactor":true,
            "name":"forwarding_cost",
            "label":"Taxi Fee",
            "required":0,
            "inputType":"number" 
        },
        {
            "name":"driver_name",
            "label":"Driver",
            "required":0,
            "inputType":"text",
            "readOnly":true 
        },
        {
            "name":"delivery_notes",
            "label":"Remarks",
            "required":0,
            "inputType":"text" 
        }
    ];

    this.renderPackageDetails = (container,d =null,can_edit=false) => {
        let html = null;
        const vertical_col_count =4;
        d = d || {};
        container.style.display ='none';
        let driver_pmt_status_id = container.dataset.driverpmtstatusid;
        let sender_pmt_status_id = container.dataset.senderpmtstatusid;

        let cnt = 0;
        let col_html ='';
        mThis.fields.map(field =>{
            cnt++;
            let val = d[field.name];
            if(field.value) val = field.value(d);
            col_html = [col_html,
            `<div class="d-flex">
                 <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.${field.label}"></p>
                 <p class="px-2">:</p>
                 <p class="text-nowrap text-capitalize">`,val,`</p></div>`].join('');
           
                if(cnt >= vertical_col_count){
                    html = [html,`<div class="col">`,col_html,`</div>`].join('');
                    col_html = '';
                    cnt = 0;
                }
        });
     
        html = [`<div class="d-flex flex-column ms-3 w-100 p-2">`,
          `<div class="action-buttons d-flex flex-row gap-2 mb-2">`,
            `<a href="javascript:void(0)" data-id="${d.id}" data-barcode="${d.barcode}" class="pg-detail_edit_button" style="display:${can_edit};padding:5px"><i class="fa fa-edit fw-semibold fs-5"></i></a>`,
            `<a href="javascript:void(0)" data-id="${d.id}" data-barcode="${d.barcode}" class="pg-detail_save_button" style="display:none;padding:5px"><i class="fa fa-save fw-semibold text-success fs-5"></i></a>`,
            `<a href="javascript:void(0)" data-id="${d.id}" data-barcode="${d.barcode}" class="pg-detail_cancel_edit_button" style="display:none;padding:5px"><span class="text-warning fw-semibold">Cancel</span></a>`,
          `</div>`,
          //`<div class="d-block ms-3 w-100">`,
          `<div class="row pd-container" data-id="${d.id}" data-senderid="${d.sender_id}" data-barcode="${d.barcode}" data-driverpmtstatusid ="${driver_pmt_status_id}" data-senderpmtstatusid ="${sender_pmt_status_id}">`,
              html,
          `</div>`,
          //`</div>`,
        `</div>`].join('');
        
        container.innerHTML = html;
        mThis.setHandlers_view(container);
        LocaleManager.translateZone(container,{hide:true},()=>{
            container.style.display ='block';
        });
    }
  
    /** Set event handlers in  view Mode*/
    this.setHandlers_view = (container)=>{
        const div_actions_buttons = container.querySelector('div.action-buttons');
        div_actions_buttons.addEventListener('click', e =>{
            e.preventDefault();

            //Click on Edit Package
                let btn = VSUtil.getElementByClass(e.target,'pg-detail_edit_button');
                if(btn){
                    mThis.beginEdit(container,btn.dataset.id);
                    return;
                }
  
                //Click on Cancel Edit Package
                    btn = VSUtil.getElementByClass(e.target,'pg-detail_cancel_edit_button');
                    if(btn){
                        mThis.cancelEdit(container,btn.dataset.id);
                        return;
                    }
 
                
                //Click on Save Edit Package
                btn = VSUtil.getElementByClass(e.target,'pg-detail_save_button');
                if(btn){ 
                    let btn_modify = div_actions_buttons.querySelector('.pg-detail_edit_button');
                    let btn_cancel_modify = div_actions_buttons.querySelector('.pg-detail_cancel_edit_button');
                    //let btn_save = div_actions_buttons.querySelector('.pg-detail_save_button');
           
                    mThis.saveChanges(container,(d)=>{
                        //if(d) {
                            //Display package details in View mode
                            mThis.renderPackageDetails(container,d);
                            const tr = container.closest('tr').previousElementSibling;
                            mThis.setTotals(tr,mThis.header_totals);
                            btn.style.display ="none"; //Hide self => Save button
                            btn_cancel_modify.style.display ="none"; //Hide Cancel Edit button
                            btn_modify.style.display ="inline-block"; //Show Edit button
                        //}
                    });
                    return;
                }
           
         });
    }
 

    this.getPriceFactors = (pd_container)=>{
      let p = {};
      pd_container.querySelectorAll('.fee-factor').forEach(el =>{
        const f = el.dataset.field;
        p[f] = el.value;
      });
      p.sender_id = pd_container.dataset.senderid;
      return p;
    }

    /** Set event handlers in Edit Mode */
    this.setHandlers_edit = (pd_container,feeFactorClass)=>{
        pd_container.querySelectorAll(['.',feeFactorClass].join('')).forEach(el=>{
            const f = el.dataset.field;
            if(el.tagName ==='SELECT'){
                el.onchange = e =>{
                    e.preventDefault();
                    //mThis.getPriaceFactors() will return object that contains all factors that affect the delivery fees
                    mThis.getDeliveryPriceInfo(pd_container);
                };
            }else{
                el.addEventListener('keyup',e =>{
                   e.preventDefault();
                   if(el.value > 0)
                     mThis.inputs.cod.value =1; 
                   else mThis.inputs.cod.value =0;

                     const event = new Event('change',{bubbles:true});
                     mThis.inputs.cod.dispatchEvent(event);
                     mThis.inputs.cod.setAttribute('disabled',true);
                
                   setTimeout(()=>{
                    mThis.getDeliveryPriceInfo(pd_container);
                   },250);
                  
                });
            }
        });
    }

     //display package header data field/ display packageHeaderData(), refreshHeaderData, updateHeaderData
     this.displayHeaderData = (tr,fields=[],d)=>{
         if(!tr) return;
         let c =null, i =0;
         do{
            c = fields[i];
            if(!c) break;
                const f_name = c;
                const span = tr.querySelector(['span.pg-',f_name].join(''));
                if(span) span.textContent = d[f_name];
            i++;
         }while(c); 
     }
  
       this.beginEdit = (container,id)=>{
          const pd_container = container.querySelector('div.pd-container');
          const div_actions_buttons =  container.querySelector('div.action-buttons');
          const driver_pmt_statu_id = container.dataset.driverpmtstatusid;
          const sender_pmt_statu_id = container.dataset.senderpmtstatusid;
          if (driver_pmt_statu_id ==1 || sender_pmt_statu_id ==1){
               let agent = (driver_pmt_statu_id ==1 && sender_pmt_statu_id ==1)? 'with driver and merchant': (driver_pmt_statu_id==1 ? 'with driver': 'with merchant');  
               cv_interact.warning(`Cannot edit package information because there is cash settlement ${agent} already`);
               return;
          }
           vsapi.call(`${main_view.base_url}/api/package/details-with-options`,{"id":id},null).then(res =>{
              const data = res.status_code ===200? StringSanitizer.sanitizeObject(res.data) : {};
              const d = data.details || {};
              
              let html = '';
              /** fields = [ {inputType,name,label,required} ] */
              mThis.fields.map(field =>{
                let input_html = '';
                let feeFactorClass = field.feeFactor? 'fee-factor':'';
                if(field.inputType =="select"){
                    input_html = `<select data-required="${field.required}" valueField="${field.options.valueField}" textField="${field.options.textField}" data-value="${d[field.name]?d[field.name]:''}" class="modal-select2 ${feeFactorClass} data-input" data-field="${field.name}" ${field.readOnly? 'disabled':''}></select>`;
                }else {
                    let textValue = d[field.name]?d[field.name]:'';
                    if(field.formattedValue) textValue = field.formattedValue(d);
                    input_html = `<input ${field.inputType ==='number'? 'number':field.inputType} class="data-input ${feeFactorClass} form-control" data-required="${field.required}" data-field="${field.name}" value="${textValue}" ${field.readOnly? 'readOnly':''}/>`;
                }

                html = [html,
                `<div class="form-group col-lg-3">`,
                 `<label for="${field.name}" class="form-label trans-text" data-langprop="titles.${field.label}"></label>`,
                 `<div>`,input_html,`</div>`,
                `</div>`, 
                ].join('');
              });
               if(html) html = [`<div class="row">`,html,`</div>`].join('');
               
               pd_container.style.display ='none';
               pd_container.innerHTML = html;
  
               //Init SELECT fields to be select2
               pd_container.querySelectorAll('select').forEach(el =>{
                 //Load SELECT's options for all SELECT fields on Edit Form
                 let f = el.dataset.field;
                 let valueField = el.getAttribute("valueField") || 'id';
                 let textField = el.getAttribute("textField") || 'name';
                 el.removeAttribute("valueField");
                 el.removeAttribute("textField");

                  VSUtil.setComboItems(el,data[f],valueField,textField,false,'',null);
                  $(el).select2({
                    "width":"100%"
                  }).val(el.dataset.value).trigger('change');
                 
               });

              //Store object list of input elements in the mThis.inputs as an object accessible by key, which is the field's name
               pd_container.querySelectorAll('.data-input').forEach(el =>{
                let f = el.dataset.field;
                    mThis.inputs[f] = el;
               });
               
               LocaleManager.translateZone(pd_container,{"hide":true},()=>{
                 pd_container.style.display ='block';
               })

               //Hide Edit button, and show Save button
               let btnEdit = div_actions_buttons.querySelector('.pg-detail_edit_button');
               btnEdit.style.display = 'none';

               let btnSave = div_actions_buttons.querySelector('.pg-detail_save_button');
               let btnCancelSave = div_actions_buttons.querySelector('.pg-detail_cancel_edit_button');
               btnCancelSave.style.display = 'inline-block';
               btnSave.style.display ='inline-block';
               //set event handler for EDIT view
               mThis.setHandlers_edit(pd_container,'fee-factor');
           });
             
           mThis.is_edition = true;    
       }  
        
       //Change from Edit Mode to View mode. 
       //if paremeter @data is specified => user has made changes to package details and therefore => display new details 
       //parameter @tr is expanded detail row <tr.pg_detail>
       this.cancelEdit = (container,pid)=>{
          mThis.displayPackageDetails(container,pid)      
       }

       this.getData =(container)=>{
          const pd_container = container.querySelector('div.pd-container'); 
          let p = {
            "id":container.dataset.id,
            "sender_id":pd_container.dataset.senderid
          };
          //p.package_id = container.dataset.id; //pacakge_id;
          pd_container.querySelectorAll('.data-input').forEach(el =>{
             const f = el.dataset.field;
             p[f] = el.value;
          });
          
          let err_text ="";
          if (!p.id) {
                err_text = LocaleManager.trans('Package identity is not valid','validation');
                cv_interact.error(err_text);
                return null;
         }

          if (p.cod ==1) {
             if (p.price <=0 || isNaN(p.price)) {
                 err_text = LocaleManager.trans('When COD is Yes then Price is required','validation');
                 cv_interact.error(err_text);
                 return null;
             }
          }

          if ((p.df_payer+'').toLowerCase() !='sender' && (p.df_payer+'').toLowerCase() != 'receiver') {
            //err_text = LocaleManager.trans('When COD is Yes then Price is required','validation');
            cv_interact.warning('Fee payer must be Sender or Receiver');
            return null;
          }
           let size = mThis.processPackageSize(p.size);
           if (!size) {
            cv_interact.error('<span class="error_text">Package size is not correct format</span><br><span style="color:green;font-weight:bold">Package Size is formated as Width Length Height. Example 20.2 11 15. All numbers are centimeter (cm)</span>','','warning');
            return null;
          } else {
              p.dim_x = size.width;
              p.dim_y = size.length;
              p.dim_h = size.height;
          }
          return p;
       }

        //size = width * length * height.  Return null in case of error or invalid size data. If @size_str i empty returns size(0,0,0)
        //processPackageSize() returns size object = {'length','width','height'}. parem @size_str = 20 10 5 (in cm)
        this.processPackageSize = (size_str)=>{
            if(!size_str || (size_str+'').trim() =='') return {'length':0,'width':0,'height':0};
            let parts = size_str.split(' ');
            if (!parts[0]) 
            return false;
            else if (parts[0] && !parts[2]){
                return false;
            } else if (isNaN(parts[2]) || isNaN(parts[1]) || isNaN(parts[0])) 
            return false;
            else {
                let length = parseFloat(parts[0]);
                let width =  parseFloat(parts[1]);
                let height =  parseFloat(parts[2]);
                return {'length':length,'width':width,'height':height};
            }      
            return null;
        }

       this.saveChanges = (container,onDone)=>{
          let p = mThis.getData(container);
          if (!p) return;
           let pid = container.dataset.id;
           let driver_total =0,sender_total=0;
           //(sender_id, delivery_type,zone_code,billed_kg) are important to determine pricing details
           let sender_id = null;
           //let zone_code = null; 

          //begin:: get driver_total and sender_total values
                let header_tr = container.closest('tr').previousElementSibling;
                if(header_tr && header_tr.classList.contains('package_header')) {
                    if(header_tr.dataset.id == pid ) {
                        let td = header_tr.querySelector('td.total');
                        driver_total = td.querySelector('span.driver-total').textContent;
                        sender_total = td.querySelector('span.sender-total').textContent;
                        sender_id = header_tr.dataset.senderid; //(sender_id, delivery_type,zone_code,billed_kg) are important to determine pricing details
                        //delivery_type = header_tr.data('dtype'); // Do not use this @delivery_type from header row
                        //zone_code = header_tr.dataset.zonecode; // get zone_code from header_tr
                    }
                }
          //end:: get driver_toal and sender_total
            //p.sender_id = sender_id;
            //p.delivery_type = delivery_type;
            //p.zone_code =  //zone_code;

          p.driver_total = parseFloat(driver_total);
          p.sender_total = parseFloat(sender_total);
          //imporant params are "sender_d,df_payer, delivery_type,zone_code,billed_kg" in order to determine the price
          vsapi.call(`${mThis.base_url}/api/package/update`,p).then(res => {
            if(res.status_code === 200){
                const data = StringSanitizer.sanitizeObject(res.data,null,['email']);
                const d = data.details || {};
                //let btnStatus = tr.find('._pol_status');
                //if(btnStatus.data('statusid')==9) btnStatus.data('notes', d.delivery_notes);
                const header_tr = container.closest('tr').previousElementSibling;
                if(header_tr){
                    let a = header_tr.querySelector('._pol_status');
                    a.dataset.notes = d.delivery_notes;
                }
              
                if(typeof onDone ==='function') onDone(d);
                cv_interact.success('Paackage details have been saved!');
             }else cv_interact.error(res.error_message);
          });
          //mThis.cancelEdit(tr);
       }
    }
    //##end::ExpandableDetails class
}
//## end::CompletedPackageListComponent
 
//### begin::FilterDialog_cpl
const FilterDialog_cpl = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_cpl_dlgFilter');
    this.elFilter_warehouse = this.self.find('#_cpl_filter_warehouse'); //Receiving warehouse
    this.elTitle = this.self.find('#_cpl_dlgFilterTitle');
    this.elFilter_start_date = this.self.find('#_cpl_filter_startdate');
    this.elFilter_end_date = this.self.find('#_cpl_filter_enddate');
    this.elFilter_sender = this.self.find('#_cpl_filter_sender');
    this.elFilter_driver= this.self.find('#_cpl_filter_driver');
    this.elFilter_pickup_driver = this.self.find('#_cpl_filter_pickup_driver');
    this.elFilter_delivery_type = this.self.find('#_cpl_filter_dtype');
    this.elFilter_status = this.self.find('#_cpl_filter_status');
    this.elFilter_period = CompletedPackageListComponent.self.find('#_cpl_filter_period');
    this.elFilter_pmt_merchant = CompletedPackageListComponent.self.find('#_cpl_filter_pmt_merchant');
    this.elFilter_pmt_driver = CompletedPackageListComponent.self.find('#_cpl_filter_pmt_driver');

    //** period such as last Week, last Month, last 3 months */
    this.elFitler_period = this.self.find('#_cpl_filter_period');

    this.form_data =null ; //stores all filter options
    this.remembered_filter = {};
    this.btnOK = this.self.find('#_cpl_dlgFilter_btnOK');

    this.self.find('.dl_filter_field').on('change',(e)=>{
        e.preventDefault();
        mThis.remembered_filter = mThis.getData();
    });
      
    // this.elFilter_status.on('change',e=>{
    //     const el = $(this);
    //     let f =el.data('field');
    //     if (el.val() ==11){
    //         mThis.elFilter_pmt_merchant.val(-1).trigger('change');
    //         mThis.elFilter_pmt_driver.val(-1).trigger('change');
    //     }
    // });

    this.btnOK.on('click',(e)=>{
       mThis.self.modal('hide');
       let p = mThis.getData();
       mThis.options.onClose(p);
    });
  
   this.show = (options = {})=>{
     options = options || {};
     mThis.options = options;
     if(options.title) mThis.elTitle.text(options.title);
        mThis.loadFilterData(()=>{
           if (main_view.MULTI_WAREHOUSE_OP ==0) mThis.elFilter_warehouse.parent().hide();  
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }

   this.getData = ()=>{
       let p = {};
       const body = mThis.self.find('.modal-body')[0];
       p.warehouse_id =mThis.elFilter_warehouse.val();
       body.querySelectorAll('.filter-field').forEach(el=>{
         let f = el.dataset.field;
         p[f] = el.value;
       });
       if(p.delivery_type==0) p.delivery_type=null;
       p.search_value = CompletedPackageListComponent.elSearchPackage.value;
       console.log(p);
       return p;

    //    //p.search_value = PackageListComponent.elSearchPackage.val();
    //    p.start_date = mThis.elFilter_start_date.val();
    //    p.end_date = mThis.elFilter_end_date.val();
    //    p.driver_id = mThis.elFilter_driver.val();
    //    p.pickup_driver_id = mThis.elFilter_pickup_driver.val();
    //    p.sender_id =mThis.elFilter_sender.val();
    //    p.delivery_type = mThis.elFilter_delivery_type.val();
    //    if(p.delivery_type==0) p.delivery_type=null;
    //    p.status_id = mThis.elFilter_status.val();
    //    p.back_days = mThis.elFilter_period.val();
      
    //    return p;
   } 

    this.loadFilterData = (onFinish)=>{
                let def =  mThis.getData();
                //if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID; 
                console.log('def',mThis.remembered_filter);
                vsapi.call(`${mThis.base_url}/api/completed-package/form-options`,null).then(res => {
                    if(res.status_code === 200){
                        let data = StringSanitizer.sanitizeObject(res.data);
                        data.statuses= DUtil.process_statuses(data.statuses,[5,6,7,9,10],{"status_id":-1,"status_name":"(All Statuses)"});
    
                        //(data.zones || []).unshift({'zone_code':null,'zone_name':"(All Zones)"});
                        (data.drivers || []).unshift({'id':null,'driver_name':'(All Drivers)'});
                        (data.senders || []).unshift({'id':null,'sender_name':'(All Merchants)'});
    
                        const def_warehouse_id = def.warehouse_id >=1? def.warehouse_id : (data.warehouses[0]?data.warehouses[0].id : null);
                        VSUtil.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def_warehouse_id);
                        VSUtil.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,null,def.sender_id);
                        VSUtil.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,null,def.driver_id);
                        VSUtil.setComboItems(mThis.elFilter_pickup_driver,data.drivers,'id','driver_name',false,null,def.pickup_driver_id);
                        (data.statuses || []).unshift({'id':null,"name":"(Returned and Delivered)"});
                        VSUtil.setComboItems(mThis.elFilter_status,data.statuses,'id','name',false,null,def.status_id);
                        onFinish();
                    }
                });

            // if (mThis.form_data) {
            //     VSUtil.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
            //     VSUtil.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id);
            //     VSUtil.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,'(All Drivers)',def.driver_id);
            //     VSUtil.setComboItems(mThis.elFilter_zone,mThis.form_data.zones,'zone_code','zone_name',false,null,def.zone_code);
            //     VSUtil.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'id','status_name',false,null,def.status_id); 
            //     if(typeof onFinish =='function') onFinish();
            //     return;   
            // }
               
        }
 }