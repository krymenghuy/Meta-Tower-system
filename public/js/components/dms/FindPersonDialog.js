//corresponding html in packageListComponent.blade.php 
//begin::FindPersonDialog
var FindPersonDialog = new function() {
    let mThis = this;
    this.apiSearchCluster ='apifindperson';
    this.self = main_view.appContent.children('#dg_dlgFindPerson');
    this.base_url = main_view.base_url;
    this.tblPersons = this.self.find('#dg_tblPersons');
    this.tblPersons_body = this.self.find('#dg_tblPersons');
    this.elSearch = this.self.find('#dg_person_search');

    this.btnFind = this.self.find('#dg_btnFindPerson');
    this.btnOK = this.self.find('#dg_btnChoosePerson');
    this.btnClose = this.self.find('#dg_findperson_btnClose');
    this.elTitle = this.self.find('#dg_dlgFindPersonTitle');
    this.elInfo = this.self.find('#dg_lblInfo');

    this.btnOK.off('click').on('click',()=>{
        
        let ps = mThis.getSelectedPersons();
        if (typeof mThis.onClose =='function') mThis.onClose(ps);
        
        mThis.self.modal('hide');
       //  if (mThis.option.previousDialog) {
       //     mThis.option.previousDialog.modal({
       //         backdrop:'static'
       //     });
       //  }
    });

    mThis.btnClose.off('click').on('click',function(){
       mThis.self.modal('hide');
       // if (mThis.option.previousDialog) {
       //    mThis.option.previousDialog.modal({
       //        backdrop:'static'
       //    });
       // }
    });

    mThis.elSearch.on('keyup',e => {
      e.preventDefault(); 
       clearTimeout(mThis.search_timeout);
       mThis.search_timeout = setTimeout(()=>{
        mThis.beginFindPersons();
       },250);
    });
     
    mThis.btnFind.off('click').on('click',function(){
        mThis.beginFindPersons();
    });

    mThis.tblPersons.on('click','tr',function(){
       let tr = $(this);
       tr.toggleClass('row-selected');
       if(tr.hasClass('row-selected')) {
         if (mThis.option.singleSelect==true) {
             if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('row-selected');
         }
         mThis.prev_selected_tr = tr;
       }

    });

    /** @option = {'title','role','findBy','signgleSelect','previousDialog'} **/
    this.show = (option,onClose) =>{
       mThis.elInfo.text(null);
       mThis.tblPersons_body.empty();
        mThis.option = option;
        if (!mThis.option) mThis.option = {};

        mThis.onClose = onClose;
        if (option){
            if(mThis.option.title) mThis.elTitle.html(mThis.option.title);
            if (mThis.option.previousDialog) {
                mThis.option.previousDialog.modal('hide');
            }
        }
       
       if (mThis.elSearch.val()) mThis.btnFind.trigger('click');
     
       mThis.self.modal({
          backdrop:'static'
       }).off('hide.bs.modal').on('hide.bs.modal',function(){
           if (mThis.option.previousDialog) {
               mThis.option.previousDialog.modal({
                  backdrop:'static'
               });
           }
       });
    }

    this.beginFindPersons = ()=>{
        let p = {
            'search_value':mThis.elSearch.val(),
            'role':mThis.option.role
            //,'findBy':mThis.elFindBy.val()
        };
        vsapi.call([mThis.base_url,'/dms/person/find'].join(''),p,null,mThis.apiSearchCluster).then(res=>{
            if(res.status_code ===200){
                let rows = StringSanitizer.sanitizeObject(res.data);
                mThis.displayPersons(rows);
            }
        });
    }

    this.displayPersons= (rows) =>{
       mThis.elInfo.text(null);
       //let div = mThis.tblPersons;
    //    div.removeClass('animate-slide-zoomin').addClass('animate-slide-zoomin');
       mThis.tblPersons_body.empty();
       let i=0, c;
       do{
          c = rows[i];
          if(!c) break;
           let html = ['<tr data-id="',c.id,'">',
              '<td>',(i+1),'</td>',
              '<td class="col_code">',c.code,'</td>',
              '<td class="col_name">',c.name,'</td>',
              '<td class="col_role">',c.role,'</td>',
              '<td class="col_phone">',c.phone_number,'</td>',
           '</tr>'].join('');
           mThis.tblPersons_body.append(html);
          i++;
       }while(c);
       
       if(i<=0) {
           mThis.elInfo.text('No persons found!');
       }
    }

    this.getSelectedPersons = (singleSelect =true)=>{
        let ps = [];
        mThis.tblPersons_body.find('tr.row-selected').each(function(){
            let tr = $(this);
               let person = {
                   'id':tr.data('id'),
                   'code':tr.find('td.col_code').text(),
                   'name':tr.find('td.col_name').text(),
                   'phone_number':tr.find('td.col_phone').text()
                   //,'email':tr.find('td.col_email').text()
               }
               ps.push(person);
               if(singleSelect==true) return ps;
        });

        return ps;
    } 
    
}
//endFindPersonDialog

//begin::JsonToExcel class
 var JsonToExcel = new function()
 {
    let mThis = this;
    this.in_array = (val, m_array=[])=>{
       let i=0,c;
       do{
           c = m_array[i];
           if(!c) break;
            if ($.isNumeric(val)) if (parseFloat(val) ==parseFloat(c)) return true;
            else if ((val+'').toLowerCase() == (c+'').toLowerCase()) return true;
           i++;
       }while(c); 
       return false;
    };

    this.exportToExcel = function(JSONData, fileTitle,titles,first_row_label=false, exceptColNames=[]){
        let filename = [fileTitle,'-',(new Date().getUTCMilliseconds()),'.xlsx' ].join('');
        var ws = XLSX.utils.json_to_sheet(JSONData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws,fileTitle);
        XLSX.writeFile(wb,filename);
    }

	this.exportToCSV = function(JSONData, FileTitle,titles,first_row_label=false, exceptColNames=[]) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                let CSV = '';
                let except_col_indexes = [];
                //This condition will generate the Label/Header
                    if(Array.isArray(titles)){
                        let row = "";
                        //This loop will extract the label from 1st index of on array
                        let row_index =0;
                        for (let index in titles) {
                            //Now convert each value to string and comma-seprated
                            let col_name = titles[index];
                            if (!mThis.in_array(col_name, exceptColNames)) {
                                //row += col_name + ',';
                                row = [row,col_name,','].join('');
                            }else except_col_indexes.push(index);   
                        }
                      
                        row = row.slice(0, -1);
                        //append Label row with line break
                        CSV = [CSV,row,'\r\n'].join('');
                        //CSV += row + '\r\n';
                        row_index++;
                    } else {

                        if (first_row_label){
                            let row = "";
                            //This loop will extract the label from 1st index of on array
                            for (let index in arrData[0]) {
                                //Now convert each value to string and comma-seprated
                                row = [row,(index+'').replace('_',' ') ,','].join('');
                            }
                            row = row.slice(0, -1);
                            //append Label row with line break
                            CSV = [CSV,row, '\r\n'].join('');
                           
                        }
                    }

                //1st loop is to extract each row
                let i = 0,c;
                do{
                    c = arrData[i]; //c is array of columns
                    if(!c) break;
                    let row = "";
                    for (let index in c) {
                        let val = c[index];
                        val = $.isNumeric(val)?(val+' '):val; //To prevent Excel display Number in Cell not formmatted as Text
                        if(!val) val ="";
                        if (!mThis.in_array(index,except_col_indexes)) row = [row,`"${val}",`].join(''); //row += '"' + val + '",';
                    }
                    row.slice(0, row.length - 1);
                    //add a line break after each row
                    CSV =[CSV,row, '\r\n'].join('');
                    i++;
                }while(c);

                if (CSV === '' || !CSV) {
                    alert("Failed to create CSV file because the provided data is invalid");
                    return;
                }

                //Generate a file name
                let filename = [FileTitle,'-',(new Date().getUTCMilliseconds())].join('');

                //To ensure that blob and CSV file show Khmer unicode correctly
                let blob = new Blob([["\uFEFF",CSV].join('')], {
                    type: 'text/csv; charset=utf-18'
                    });

                // let blob = new Blob([CSV], {
                // type: 'text/csv;charset=utf-8;'
                // });

                if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
                } else {
                let link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    let url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.style = "visibility:hidden";
                    link.download = filename + ".csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                }
    };
 };	 
//end::JsonToExcel class
 
// //begin::AddressWidget
// var AddressWidget = new function () {
//     let mThis = this;
//     this.processAddress =(addr)=>{
//           //let addr = 'st:38E, No:Trasak Peom, Appartment Luxury A, Floor 11';
//           let parts = addr.split(','); 
//           let m_addr = {'street':null,'house':null,'name':null,'floor':null};
//           if(!parts || !parts[0]) return m_addr;

//           let house_part = parts[0];
//           let st = house_part.split(':');
//           let _house = st[1];
  
//           let street_part = parts[1]?parts[1]:':';
//           st = street_part.split(':');
//           let _street = st[1];
//           let loc_name = parts[2]?parts[2]:':';
//           let _floor = parts[3]; 
//       let info = {
//           house: _house,
//           street: _street,
//           name: loc_name,
//           floor: _floor,
//       };
//       return info;
//     }

//   this.getFriendlyAddress = (d)=>{
//       return ['st:',d.street,', No:',d.house,', ',d.name,', ',d.floor].join('');
//   } 
// };
// //end::AddressWidget