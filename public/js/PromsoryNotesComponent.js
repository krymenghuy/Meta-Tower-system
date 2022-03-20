
var PromsoryNotesComponent = new function(){
    this.base_url = $('#__base_url').val();
    let mThis = this;
    this.self = $('#_mainPromsoryNotesComponent');

    this.tblPromsoryNotes = $('#_mainPromsoryNotesComponent_table');

    this.btnAddPromsoryNote = $('#btnAddPromsoryNote');

    this.init = () => {
        mThis.btnAddPromsoryNote.on('click', () => { 
            let op = {title:'New Promsory Notes'};
            PromsoryNoteDialog.show(op, (p) => {
                //alert(JSON.stringify(p));
                post_ajax(mThis.base_url + '/api/save-applicant', p, function(results){
                    if(results.status == 'OK'){
                        mThis.displayPromsoryNoteList();
                    }else{
                        cv_interact.alert(results.error_message);
                    }
                });

            });
        });
    }
    //END::Init


    this.displayPromsoryNoteList = function()
    { 
        var p = null;
        post_ajax([mThis.base_url, '/api/applicant-list'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
             
            if (mThis.table){
                    mThis.tblPromsoryNotes.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblPromsoryNotes.empty();
                    //alert('destroyed => '+  mThis.tblPromsoryNotes.html());
                    mThis.table = null;
            }
            data = StringSanitizer.sanitizeObject(data);

            //begin::Set up columns
                let cnt = 1;
                let my_columns = [
                    {
                        // data:function(data,type,meta) {
                        //     return cnt++;
                        // },
                        // title:'NO.'
                        className:'col_action',
                        data:function(data,row,display) {
                         let html =['<div class="dropdown">',
                             '<a href="#" data-barcode="',data.barcode,'" data-pid="',data.package_id,'" data-did="',data.delivery_id,'" data-statusid="',data.status_id,'" class="btn_package_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        data:'name',
                        title: 'Username'
                    },
                    {
                        data: 'n_id',
                        title: 'Loan Number'
                    },
                    {
                        data: 'n_id',
                        title: 'Borrow Number'
                    },
                    {
                        data: 'n_id',
                        title: 'DateOfPayment'
                    },
                    {
                        data: 'n_id',
                        title: 'Due Amount'
                    },
                    {
                        data: 'n_id',
                        title: 'Remarks'
                    },
                    // {
                    //       className:'name', //css class "total" is used for accessing value and update values of totals in <td>
                    //       data:function(data,a,b){
                    //         return ['<div style="display:flex;flex-direction:column">',
                    //             '<div class="pg-total_driver"><span class="total-label">Driver:</span><span class="total-value driver-total">',data.driver_total,'</span></div>',
                    //             '<div class="pg-total_sender"><span class="total-label">Sender:</span><span class="total-value sender-total">',data.sender_total,'</span></div>',
                    //         '</div>'].join(''); 
                    //     },
                    //     title:'Totals'
                    // }
                ];
                //END Define colum
                 
            if (!mThis.table)
            mThis.table = mThis.tblPromsoryNotes.DataTable({
                searching:false,
                destroy:true,
                paging:true,
                ordering:false,
                //dom: 'Bfrtip',
                retrieve: true,
                //scrollY:390,
                //scrollX:500,
                //pagingType:'numbers',
                info:true,
                bLengthChange:false,
                saveState:true,
                 // rowReorder: {
                    // dataSrc: 'sequence'
                  // },
                   'processing': true,
                   'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": "No applicant found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          
                         
                      }

                //    ,"cellCreated":function(td,data,colIndex) {
                //        alert('test');
                //      if(colIndex==9){
                //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                //         $(td).html(html); 
                //      }
                //   }      								
            });
            
            // let div = $('#_dl_d_filter_panel');  
            // $('#_dl_tblPromsoryNotes_wrapper>div.dt-buttons').prepend(div);
                 				  
        }); //close post_ajax()
                 
    };



    this.elScreenTitle = $('#screen_title');

    this.show = (option) => {
        if(!option) option = {}
        mThis.elScreenTitle.text(option.title);
        mThis.self.show().siblings().hide();
        mThis.displayPromsoryNoteList();

    }
}


var PromsoryNoteDialog = new function(){
    let mThis = this;
    this.self = $('#modalPromsoryNote');
    this.btnSave = $('#modalPromsoryNote_btnSave');
    this.elTitle = $('#modalPromsoryNote_title');

    this.elErrors = $('#modalPromsoryNote_error');

    

    //validate
    this.validateData = () => {
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            let require = el.data('required');
            if(require == 1){
                if(!el.val()){
                    mThis.elErrors.text('This field is required!');
                    return false;

                }
            }
        });
        return true;
    }
    
    //Save
    mThis.btnSave.on('click', (e) => {
        e.preventDefault();

        if(!mThis.validateData()){
            return;
        }

        let p = mThis.getData();

        //validate form
        


        if(typeof mThis.onClose == 'function') mThis.onClose(p);
        mThis.self.modal('hide');


    });

    this.show = (option, onClose) => {
        if(!option) option = {};
        mThis.onClose = onClose;
        mThis.elTitle.text(option.title);
        mThis.self.modal();

    }
    //get data from form
    this.getData=()=>{
        let p = {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            p[el.data('field')] = el.val();
        });
        return p;
    }
}


$(document).ready(function(){
    PromsoryNotesComponent.init();
});