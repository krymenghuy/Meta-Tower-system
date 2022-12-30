'use strict'
//begin::JsonToExcel class
let JsonToExcel = new function()
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

   // required script => <script defer type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js"></script>
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
