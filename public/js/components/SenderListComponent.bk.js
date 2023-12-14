'use strict';
var SenderListComponent = new function(){
    let mThis = this;
    this.title_prop ="Merchants";
    this.base_url =main_view.base_url;
    this.self = main_view.appContent.children('#_main_senderListComponent');
    this.elFilter_business_type = $('#_sdl_filter_business_type');
    this.elFilter_sender_type = $('#_sdl_filter_sender_type');
    this.elFilter_sender_status = $('#_sdl_filter_sender_status');
    this.elFilter_sales_agent = $('#_sdl_filter_sales_agent');
       
    this.btnNewSender = $('#_sdl_btnNewSender');
    this.elSearch = $('#_sdl_search_sender');
    this.btnSearch = $('#_sdl_btnSearch');
    this.tblSenders = $('#_sdl_tblSenders');
    this.tblSenders_body = $('#_sdl_tblSenders_body');
    this.sender_dropdown_menu = mThis.tblSenders.find('div.dropdown');

    this.btnPrint = $('#_sdl_btnPrint');
    this.btnPDF = $('#_sdl_btnPDF');
    
    this.loadFilterData = (def,onFinish)=>{
        if(!def) {
            def={}
            def.business_type = 0;
            def.sender_type_id =0;
            def.status_code =0;
            def.sales_agent_id = 0;
        }

        vsapi.call(`${mThis.base_url}/api/merchant/form-options`,null).then(res => {
           if(res.status_code === 200){
                let d = res.data;
                d.sender_types = StringSanitizer.sanitizeObject(d.sender_types);
                d.sender_statuses = StringSanitizer.sanitizeObject(d.sender_statuses);
                d.business_types = StringSanitizer.sanitizeObject(d.business_types);
                d.sales_agents = StringSanitizer.sanitizeObject(d.sales_agents);
                (d.sales_agents || []).unshift({'id':'-1','agent_name':'(All)'});
                VSUtil.setComboItems(mThis.elFilter_sender_type,d.sender_types,'id','sender_type',true,'(All Merchant Types)',def.sender_type_id);
                VSUtil.setComboItems(mThis.elFilter_sender_status,d.sender_statuses,'status_code','status_name',true,'(All Status)',def.status_code);
                VSUtil.setComboItems(mThis.elFilter_business_type,d.business_types,'business_type','business_type',true,'(All Business Types)',def.business_type);
                VSUtil.setComboItems(mThis.elFilter_sales_agent,d.sales_agents,'id','agent_name',true,'(No referral)',def.sales_agent_id);
                VSUtil.setComboItems(SenderDialog.elSalesAgent,d.sales_agents,'id','agent_name',true,'(No referral)',def.sales_agent_id);  
                mThis.form_data = d;
                if (typeof onFinish =='function') mThis.onFinish();
            }
        });
    }

    this.getPriceListItems =(onFinish)=>{
        vsapi.call(`${mThis.base_url}/api/getComboItems_price_list`,null).then(res => {
            let items = res.data;
            if(typeof items =='string') console.error('getComboItems_price_list() return error ' + items);
            if(items) {
                if (typeof onFinish =='function') onFinish(items);
            }
        });
    }
    
    this.init = ()=>{
        mThis.loadFilterData();

        mThis.self.find('._sdl_filter_field').on('change',function(e){
           mThis.displaySenderList();
        });

        this.btnNewSender.on('click',function(e){
            SenderDialog.show({'title':'New Merchant'},function(sender){
                if(sender) {
                    mThis.displaySenderList();
                }
            });
        });

        mThis.tblSenders.on('click','a.btn_sender_action',function(e) {
            e.preventDefault();
            let p = $(this).parent();
            let x = $(this);
            
            let sender_id = x.data('senderid');
            let status_code = x.data('statuscode');
            let sender_code = x.data('sendercode');

            let dropdownMenu = p.find('.dropdown-menu');
            if (!dropdownMenu || dropdownMenu.length <= 0) {
            
            p.append(mThis.createDropdownMenuHtml_sender(sender_id,sender_code,status_code));
                dropdownMenu = p.find('.dropdown-menu');
            }
            if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

            dropdownMenu.toggleClass('show');
            if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
        });

        $(document).on('click',function(e){
            let container = mThis.sender_dropdown_menu.parent();
            if(container){
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    mThis.sender_dropdown_menu.removeClass('show');
                }
            }
        });
                
        mThis.tblSenders.on('mouseover','tr',function(e){
            let col_action = $(this).find('td.col_action');
            col_action.find('a.btn_sender_action>i').addClass('action-button-zoomin');   
        }).on('mouseleave','tr',function(e) {
            let col_action = $(this).find('td.col_action');
            col_action.find('a.btn_sender_action>i').removeClass('action-button-zoomin');  
            col_action.find('div.dropdown-menu').removeClass('show');  
        });

        mThis.tblSenders.on('click','a.sender_status_action',function(e){
            e.preventDefault();
            let lnk = $(this);
            let sender_id = lnk.data('senderid'); 
            let def_status_code = lnk.data('statuscode');
            mThis.changeSenderStatus(def_status_code,lnk); 
        });
 
        mThis.tblSenders.on('click','a._sdl_sa_set_price_list',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let sender_id = x.data('senderid');
            let tr = x.closest('tr');
            mThis.getPriceListItems((items)=>{
                items.unshift({'id':null,'name':'Select price list'});
                let option = {'title':'Set Merchant\'s Price List',"dataLabel":"Price list name","valueMember":"id","textMember":"name","blankErrorMessage":"Please a price list","data":items,"defaultValue":null};
                InputBox2.show(option,(d)=>{
                    if(d) {
                        let p = {"sender_id":sender_id,"price_list_id":d.value};
                        vsapi.call(`${mThis.base_url}/api/merchant/set-price-list`,p).then(res => {
                            if(res.status_code === 200) {
                                let d = StringSanitizer.sanitizeObject(res.data);
                                tr.find('td.sl-td-price-list').text(d.list_name); 
                                cv_interact.success('Price list ' + d.list_name + ' has been assigned to the merchant successfully');
                            }
                            else cv_interact.error(res.error_message); 
                        });
                    }
                });
            });
        });

        mThis.tblSenders.on('click','a._sdl_sa_delete',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let sender_id = x.data('senderid');
            let status_code = x.data('statuscode');
            let p = {'sender_id':sender_id,'status_code':status_code};
            cv_interact.confirm('Delete this merchant?',{'title':'Delete Merchant','context':'delete'},function(e){
                if(e){
                    vsapi.call(`${mThis.base_url}/api/sender/delete`,p).then(res => {
                        if(res.status_code === 200) {
                            mThis.displaySenderList();
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblSenders.on('click','a._sdl_sa_modify',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let sender_id = x.data('senderid');

            let option = {'sender_id':sender_id,'title':'Modify Merchant Details'};
            SenderDialog.show(option,(d)=>{
                if(d) {
                    mThis.displaySenderList();
                }
            });
        });

        mThis.tblSenders.on('click','a._sdl_sa_change_status',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let sender_id = x.data('senderid');
            let status_code = x.data('statuscode');

            let option = {'title':'Set Merchant Status',"dataLabel":"Merchant status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":status_code};
            InputBox2.show(option,(d)=>{
                if(d) {
                    let p = {"sender_id":sender_id,"status_code":d.value};
                    vsapi.call(`${mThis.base_url}/api/sender/update-status`,p).then(res => {
                        if(res.status_code === 200) {
                            mThis.displaySenderList();
                        }else cv_interact.error(res.error_message); 
                    });
                }
            });
        });

        mThis.tblSenders.on('click','a._sdl_sa_create_mobile_login',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            let sender_code = tr.data('sendercode');
            let phone_number = tr.data('phonenumber');
            let full_name = tr.find('.name-text').text(); 
            let option1= {"official_code":sender_code,"user_class":"merchant","phone_number":phone_number,"full_name":full_name,"goBackFunction":()=>{
                SenderListComponent.show(SenderListComponent.option);
            }};
            AddUserPanel.show(option1);
        });

        mThis.elSearch.on('keyup',(e)=>{
            let val = e.target.value;
            if(!val) 
                mThis.displaySenderList();
            else if(val.length>2)
                mThis.displaySenderList();
        });
        
        mThis.btnSearch.on('click',function(){
            mThis.displaySenderList();
        });
    }

    this.show = (option)=>{
        mThis.option = option;
        if(!AuthManager.access_mod(mThis.module_id,true)) return;
        mThis.displaySenderList(); 
        mThis.self.siblings().hide(0, function() {
            main_view.setTitle(mThis.title_prop);
            mThis.self.hide().fadeIn(300);
        });
    }

    this.hide = ()=>{
        mThis.self.hide();
    }	  

    this.createDropdownMenuHtml_sender = function(sender_id,sender_code, status_code) {
        let html = ['<div class="dropdown-menu" data-senderid="',sender_id,'" data-sendercode="',sender_code,'" data-statuscode="',status_code,'">',
        '<a class="dropdown-item _sdl_sa_set_price_list" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:green"></i> Set Price List</a>', 
          '<a class="dropdown-item _sdl_sa_delete" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete Merchant</a>',
          '<a class="dropdown-item _sdl_sa_modify" href="javascript:voidd(0)"><i class="fa fa-edit" style="color:green"></i> Modify Merchant Info</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _sdl_sa_change_status" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue"></i> Change Merchant Status</a>', 
          '<a class="dropdown-item _sdl_sa_create_mobile_login" href="javascript:void(0)"><i class="fa fa-tasks" style="color:orange"></i> Create Mobile Login</a>',
          '</div>'].join('');
        return html;
    };

    this.displaySenderList = function(){ 
        let p = {};
        p.search_value = mThis.elSearch.val();
        p.sender_type_id = mThis.elFilter_sender_type.val();
        if(!p.sender_type_id) p.sender_type_id = 0;
        if (!p.search_value) p.search_value ='';
        p.business_type = mThis.elFilter_business_type.val();
        p.status = mThis.elFilter_sender_status.val();
        p.sales_agent_id = mThis.elFilter_sales_agent.val();
        if(!p.business_type ) p.business_type  ='';
        if (! p.status)  p.status ='';
        
        vsapi.call(`${mThis.base_url}/api/getSenderList`,p).then(res => {
            if (mThis.table){
                mThis.tblSenders.DataTable().clear().destroy();
                mThis.tblSenders.empty();
                mThis.table = null;
            }
            
            let data = StringSanitizer.sanitizeObject(res.data);

            let cnt = 1;
            let my_columns = [
                {
                    className:'col_action',
                    data:function(data,row,display) {
                        let html =['<div class="dropdown">',
                            '<a href="javascript:void(0)" data-senderid="',data.id,'" data-statuscode="',data.status_code,'" data-sendercode="',data.code,'" class="btn_sender_action" aria-haspopup="true" aria-expanded="false">',
                            '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.3em"></i>',
                            '</a>',
                        '</div>'].join('');
                        return html;
                    } 
                },
                {
                    data:'code',
                    title:'Merchant ID'
                    },
                {
                    className:"name name-text", 
                    data:'name',
                    title:'Merchant Name'
                },
                {
                    className:'sl-td-price-list',
                    data:'price_list_name',
                    title:'Price List'
                },
                {
                    className:'sl-td-cod',
                    data:function(data,a,b){
                        return `<div class="sender-cod-info">
                            <span class="sender-cod-info-option">${(data.cod==1)?'Yes':'No'}</span>
                            <span class="sender-cod-info-percent">${data.cod_fee?data.cod_fee:0}%</span>
                        </div>`;
                    },
                    title:'COD'
                },
                {
                    data:'business_type',
                    title:'Business Type'
                },
                {
                    data:'phone_number',
                    title:'Phone Number'
                },
                {
                    data:'address',
                    title:'Address'
                },
                {
                    className:'sender-status',
                    data:function(data,type,meta) {
                        if (!data.status_code || data.status_code =='') data.status_code ='?';
                        return ['<a class="sender_status_action" data-statuscode="',data.status_code,'" data-senderid="',data.sender_id,'" href="javascript:void(0)"><span>',data.status_code,'</span></a>'].join('');
                    },
                    title:'Status'
                }
            ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblSenders.DataTable({
                searching:false,
                destroy:true,
                paging:true,  
                retrieve: true,
                info:true,
                bLengthChange:false,
                saveState:true,
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...',
                    "emptyTable": "No merchants found"
                },
                data:data,
                columns:my_columns 
                ,"createdRow": function(row, data, dataIndex){
                    let tr = $(row);
                    tr.data('senderid',data.sender_id);
                    tr.data('sendercode',data.code); 
                    tr.data('phonenumber',data.phone_number); 
                }     								
            });
        });      
    };

    this.changeSenderStatus = ()=>{
        return;
    }
}

var SenderDialog = new function(){
    let mThis = this;
    this.self = $('#_sdl_dlgSender');
    this.base_url =main_view.base_url;
    this.elTitle = $('#_sdl_dlgSenderTitle');
    this.btnSave = $('#_sdl_sender_btnSave');
    this.elSenderType = $('#_sdl_sender_sendertype');
    this.elBusinessType = $('#_sdl_sender_businesstype');
    this.elSalesAgent = $('#_sdl_sales_agent');
    
    this.elPriceList = $('#_sdl_price_list');
    this.elCOD = $('#_sdl_cod');
    this.elCODFee = $('#_sdl_cod_fee');

    this.onClose = null;
    this.elError = $('#_sdl_sender_error');
    
    this.body = $('#_sdl_dlgSender_body');
    this.sender_panel = $('#_sdl_dlgSender_sender_panel');

    this.prepareData = (def,onFinish)=>{
        if(!def) def = {};
        if (mThis.form_data){
            VSUtil.setComboItems(mThis.elSenderType,mThis.form_data.sender_types,'id','sender_type',true,'(Select Merchant Type)',def.sender_type_id);
            VSUtil.setComboItems(mThis.elSalesAgent,mThis.form_data.sales_agents,'id','agent_name',true,'(No Referrer)',def.sales_agent_id);
            VSUtil.setComboItems(mThis.elPriceList,mThis.form_data.price_list,'id','name',true,'(Price List)',def.price_list_id);
            if(typeof onFinish ==='function') onFinish();
            return;
        }

        vsapi.call(`${mThis.base_url}/api/getFormData_senderdialog`,null).then(res => {
            if(res.status_code === 200){
                let d = res.data;
                d.sender_types = StringSanitizer.sanitizeObject(d.sender_types);
                d.price_list = StringSanitizer.sanitizeObject(d.price_list);
                VSUtil.setComboItems(mThis.elSenderType,d.sender_types,'id','sender_type',true,'(Select Merchant Type)',def.sender_type_id);
                VSUtil.setComboItems(mThis.elBusinessType,d.business_types,'business_type','business_type',true,'(Select Business Type)',def.business_type);
                VSUtil.setComboItems(mThis.elPriceList,d.price_list,'id','name',true,'(Price List)',def.price_list_id);
                mThis.form_data = d;
                if(typeof onFinish =='function') onFinish();
            }
        });
    }

    this.btnSave.on('click',function(e){
        let p = mThis.getData();
        vsapi.call(`${mThis.base_url}/api/sender/save`,p).then(res => {
            if(res.status_code === 200) {
                mThis.self.modal('hide');
                if (typeof mThis.onClose ==='function') mThis.onClose(p);
            }
            else cv_interact.error(res.error_message);
        });
    });

    this.show = (option,onClose)=>{
        if(!option) option ={};
        mThis.onClose = onClose;
        mThis.sender_id = option.sender_id;
        mThis.elTitle.html(option.title);

        if (mThis.sender_id > 0) {
            mThis.elTitle.html("Merchant Details");
            let p = {'sender_id':mThis.sender_id};
            vsapi.call(`${mThis.base_url}/api/sender/details`,p).then(res => {
                if(res.status_code === 200){
                    let d = res.data;
                    let bank_accounts = StringSanitizer.sanitizeObject(d.bank_accounts); 
                    d = StringSanitizer.sanitizeObject(d,null,['email']);
                    mThis.prepareData(d, function(){
                        d.bank_accounts = bank_accounts?bank_accounts:[];
                        mThis.setData(d);
                        mThis.self.modal({
                            backdrop:'static'
                        });
                    });
                }
            });
        }
        else {
            mThis.elTitle.html("New Merchant");
            mThis.prepareData(null, function(){
                mThis.setData(null);
                mThis.self.modal({
                    backdrop:'static'
                });
            });
        }
    }

    this.setData = (d)=>{
        mThis.body.find('.data-input').each(function(){
            $(this).val(null);
        });
        if (!d) return;

        let bank_accounts = d.bank_accounts;
        d.bank_accounts = null;  
        mThis.sender_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            if (el.is('select')){
                el.val(d[data_member]).trigger('change');
            }
            else el.val(d[data_member]);
        });
     
        let i=0,c;
        do{
            c = bank_accounts[i];
            if(!c) break;
            let css_class ='primary_bank_panel';
            if (c.is_primary == 0) css_class ='secondary_bank_panel';
            let div = mThis.body.find(['div.',css_class].join(''));
            div.find('input.data-input').each(function(e){
                let el = $(this);
                let dataMember = el.data('field');
                el.val(c[dataMember]);
            });
            i++;
        }while(c);
    }

    this.getData = ()=>{
        let p = {};
        p.id = mThis.sender_id;
        mThis.sender_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            p[data_member] = el.val();
        });
        p.banks = mThis.getBanks();
        return p;
    }

    this.getBanks = ()=>{
        let ps = [];
        let div = mThis.body.find('div.primary_bank_panel');
        let p = {};
        p.is_primary =1;
        div.find('input.data-input').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            p[dataMember] = el.val();
        });
        ps.push(p);

        div = mThis.body.find('div.secondary_bank_panel');
        let p1 = {};
        p1.is_primary =0;
        div.find('input.data-input').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            p1[dataMember] = el.val();
        });
        ps.push(p1);
        return ps; 
    }
}

window.addEventListener('DOMContentLoaded',e=> {
    SenderListComponent.init();
});