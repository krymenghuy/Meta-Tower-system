//##### begin::pdfReport
  let pdfReport = new function(){
      let mThis = this;
      this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        post_ajax([mThis.base_url,'/api/encryptData'].join(''),p,(d)=>{
            onFinish(d);
        }); 
      }
      //Create pdf document base on a given table_id with my default style 
      this.createPDFDocument_table =(table_id,option={})=> {
        let table = document.getElementById(table_id);
        let start_col_index = option.start_col_index? option.start_col_index:0;
        let col_widths=[];
        let header_cols = [];
        if (!table.rows[0]) {
            alert('createPDFDocument_table() => The given table does not have any row');
            return;
        }
        let cnt = table.rows[0].cells.length;
        for (let i = start_col_index; i < cnt; i++) {
            let cell = table.rows[0].cells[i];
            col_widths[i-start_col_index] ='auto';
            let col = {'text':cell.innerText,'style':'th_style'}; 
            header_cols[i-start_col_index]= col;
            //widths[i] = (cell.style.width != ""? cell.style.width : cell.style.offsetWidth); //if the cell's style width is not set, get its' actual width
        }
    
        let bdy=[];
        let c, i=1; //NOTE: $i start from 1, not zero. because 0 is header row
        let col_count =0;
        //insert header_row before adding body rows
        bdy.push(header_cols);
        do{
            c = table.rows[i];
            if(!c) break;
              if(col_count <=0 || !col_count) col_count =cnt; //** OR  col_count = c.cells.length;
              let row = [];
            
              for (let x = start_col_index; x < col_count; x++) {
                    let cell_value =c.cells[x]?c.cells[x].innerText:'';
                    row.push({"text":cell_value,"style":"td_text"});
              } 
              bdy.push(row); 
            i++; 
        }while(c);
               /** prevent error when there are no data row **/
                if (!bdy[1][0]){
                    let empty_row= [];
                    col_count = cnt;
                    for (let x = start_col_index; x < col_count; x++) {
                        empty_row.push({"text":"","style":"td_text"});
                    }
                    bdy[1] = empty_row;
                }

                 // //Define Khmer fonts for pdf doc 
                 pdfMake.fonts = {
                    // Khmer: {
                    // normal: 'Khmer.ttf',
                    // bold: 'Khmer.ttf',
                    // //italics: 'Khmer.ttf',
                    // //bolditalics: 'Khmer.ttf'
                    // },
                    DaunTep: {
                        normal: 'DaunTep.ttf',
                        bold: 'DaunTep.ttf',
                        //italics: 'DaunTeav.ttf',
                        //bolditalics: 'DaunTeav.ttf'
                    },
                    Roboto:{
                        normal: 'Roboto-Regular.ttf', //Khmer unicode font
                        bold: 'Roboto-Regular.ttf',
                        italic:'Roboto-Italic.ttf'

                    }
                }   

                //make custom table layout style
                    pdfMake.tableLayouts = {
                        myCustomLayout: {
                            hLineWidth: function (i, node) {return 1;},
                            vLineWidth: function (i, node) {return 1;},
                            hLineColor: function (i, node) {return '#D9E0DF';},
                            vLineColor: function (i, node) {return '#D9E0DF';},
                            //fillColor: function (i, node) {return 'green';},
                            paddingLeft: function(i, node) {return 10;}
                        }
                    };

            let rpt_title= {'text':option.title?option.title:'Report Title','style':'rpt_title'};
            let rpt_sub_title =null;
            if (option.subTitle) rpt_sub_title = {'text':option.subTitle,'style':'rpt_sub_title'};
            let docDef = {
                            //page header / footer function
                            // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Landscape',
                            //pageMargins:[10,10,10,10], 
                            content: [
                                     rpt_title,
                                     rpt_sub_title,
                                     {
                                        layout:function(){

                                       }
                                     },
                                     { 
                                        layout: 'myCustomLayout', // optional
                                        table: { headerRows: 1, widths: col_widths, body: bdy } 
                                     }],
                                     defaultStyle:{
                                        font: 'DaunTep'
                                     },
                                     styles: {
                                        rpt_title: 
                                            {
                                                //font: 'Khmer',
                                                fontSize: 15,
                                                bold: true,
                                                color:option.title_color?option.title_color:'#2441B8',
                                                margin: [0, 3, 0, 0],
                                                alignment: 'center'
                                            },
                                          rpt_sub_title:{
                                            fontSize: 11,
                                            bold: true,
                                            color:option.sub_title_color?option.sub_title_color:'grey',
                                            margin: [0, 0, 0, 2],
                                            alignment: 'center'
                                          },  
                                            th_style: 
                                            {
                                                //font: 'Khmer',
                                                fontSize: 11,
                                                bold:true, 
                                                fillColor: option.header_back_color?option.header_back_color:'#fff',
                                                color: option.text_color?option.text_color:'#333435',
                                                margin:[5,5,5,5]
                                            },
                                            td_text:{
                                                //font: 'Khmer',
                                                fontSize: 10,
                                                color:option.text_color?option.text_color:'#5E5E61',
                                                margin:[5,5,5,5]
                                            }

                                    }  
              };
            
              return docDef;
    }
     
    //Create pdf document based on JSON data 
    //option.header_columns: [] //list of header's titles, example ['Name','Place of Birth','Date of Birth','Phone Number']
    this.createPDFDocumentFromJson =(data,option={})=> {
        if(!data || !data[0] || data==[]) return null;
        let col_widths=[];
        let header_cols = [];
        let bdy = [];
        let user_header_cols =null;
        if (Array.isArray(option.header_columns)){
           let x =0,c;
           user_header_cols = [];
           do{
               c = option.header_columns[x];
               if(!c) break;
               user_header_cols.push({'text':c,'style':'th_style'});
               x++;
           }while(c);
        }

        //let except_props = option.exceptProps; // array of exceptions ['email','col_name']
        if (Array.isArray(data)) // process Array object = [{pro1,prop2,...}]
		{
			let i=0, myObj;
            let col_cnt=0;
			do
			{
				myObj = data[i]; //rows array of objects
				if (!myObj) break;
                let row =[];
				for (let property in myObj) {
				  if (i==0){
                     col_widths.push('auto');
                     if (!user_header_cols) header_cols.push({'text':property,'style':'th_style'});
                     col_cnt++;
                  }
                     row.push({"text":myObj[property],"style":"td_text"});   
                 } //end::for loop

                  if (user_header_cols){
                    if (!user_header_cols[col_cnt-1]) {
                        alert('Header columns less than number of provided data properties');
                        return;
                    } else if (user_header_cols[col_cnt]) {
                      alert('Header columns more than number of provided data properties');
                      return;
                    }
                  }
                  
                 // Add header row
                 if (i==0) {
                    if(!user_header_cols){
                       bdy.push(header_cols);
                     }else bdy.push(user_header_cols);
                 }

                 bdy.push(row); 
                 i++;				
			}while(myObj);

		} else {
            alert("Invalid json data provided. Expected array of JSON objects");
            return;
        }
                /** NOTE: to keep clean code => the following pdfMake.fonts defintion is written in file vfs_fonts.js **/
                // //Define Khmer fonts for pdf doc 
                 pdfMake.fonts = {
                    // Khmer: {
                    // normal: 'Khmer.ttf',
                    // bold: 'Khmer.ttf',
                    // //italics: 'Khmer.ttf',
                    // //bolditalics: 'Khmer.ttf'
                    // },
                    DaunTep: {
                        normal: 'DaunTep.ttf',
                        bold: 'DaunTep.ttf',
                        //italics: 'DaunTeav.ttf',
                        //bolditalics: 'DaunTeav.ttf'
                    },
                    Roboto:{
                        normal: 'Roboto-Regular.ttf', //Khmer unicode font
                        bold: 'Roboto-Regular.ttf',
                        italic:'Roboto-Italic.ttf'

                    }
                }   

                //pdfMake.vfs = pdfFonts.pdfMake.vfs;
                 //make custom table layout style
                    pdfMake.tableLayouts = {
                        myCustomLayout: {
                            hLineWidth: function (i, node) {return 1;},
                            vLineWidth: function (i, node) {return 1;},
                            hLineColor: function (i, node) {return '#D9E0DF';},
                            vLineColor: function (i, node) {return '#D9E0DF';},
                            //fillColor: function (i, node) {return 'green';},
                            paddingLeft: function(i, node) {return 10;}
                        }
                    };

            let rpt_title= {'text':option.title?option.title:'Report Title','style':'rpt_title'};
            let rpt_sub_title= null;
            if(!option.subTitle) option.subTitle = option.sub_title;
            if (option.subTitle) rpt_sub_title = {'text':option.subTitle,'style':'rpt_sub_title'};
            let docDef = {
                            //page header / footer function
                            // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Landscape',
                            pageMargins:[10,10,10,10], 
                            content: [
                                     rpt_title,
                                     rpt_sub_title,
                                     option.heading_contents,
                                     { 
                                        layout:'myCustomLayout',//'headerLineOnly', // optional
                                        table: { headerRows: 1, widths: col_widths, body: bdy } 
                                     }
                                    ],
                                     defaultStyle:{
                                        font:'DaunTep',
                                        fontSize: 10,
                                        bold:false,
                                     },
                                     styles: {
                                        rpt_title: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 18,
                                                bold: true,
                                                color:option.title_color?option.title_color:'#2441B8',
                                                margin: [0, 3, 0, 0],
                                                alignment: 'center'
                                            },
                                            rpt_sub_title: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 12,
                                                bold: true,
                                                color:option.sub_title_color?option.sub_title_color:'grey',
                                                margin: [0, 0, 0, 2],
                                                alignment: 'center'
                                            },
                                            th_style: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 11,
                                                bold:true, 
                                                fillColor: option.header_back_color?option.header_back_color:'#fff',
                                                color: option.text_color?option.text_color:'#333435',
                                                margin:[5,5,5,5]
                                            },
                                            td_text:{
                                                font:'DaunTep',
                                                fontSize: 10,
                                                color:option.text_color?option.text_color:'#5E5E61',
                                                margin:[5,5,5,5]
                                            }

                                    }  
              };
            
              return docDef;
    }

    //JsonToPDF()
    this.viewPDF_json = (data,option)=>{ 
        let docDef = mThis.createPDFDocumentFromJson(data,option); 
        /**NOTE:  _vfs_fonts is "Virtual File System fonts" defined in javascript file "vfs_fonts.js" that is in the same directory with file pdfMake.min.js **/
        pdfMake.vfs = _vfs_fonts; // _vfs_fonts is built using node command. 'node build-vfs.js "./examples/fonts" '
        if(option.styles) pdfMake.styles = option.styles;
        if (docDef) pdfMake.createPdf(docDef,null,null).open();
        else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');
     }
    
    //viewPDF_fromTable() | htmlTableToPDF()
    this.viewPDF = (table_id,option)=>{
        let docDef = mThis.createPDFDocument_table(table_id,option); 
           //##Start creating PDF using pdfmake.js
                pdfMake.vfs = _vfs_fonts;
                if (docDef) pdfMake.createPdf(docDef).open();
                else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');

                // // create the window before the callback
                // var win = window.open('', '_blank');
                // $http.post(mThis.base_url, data).then(function(response) {
                //     // pass the "win" argument
                //     pdfMake.createPdf(docDef).open({}, win);
                // });
           //##end creating pdf
    }

    //HtmlElementToPDF()
    //convert html element (defined by getElementById() ) to image (screenshot) and display as pdf 
    //For element ID need to be prefixed with '#' 
    this.htmlToPdf = (elementId,option={})=>
    {
        //const  html2canvas =  new html2canvas();
        html2canvas(document.getElementById(elementId),{
            Scale: 5, // scale, default is 1
            Allowtaint: false, // allow cross domain images to contaminate the canvas
            Usecors: true, // do you want to use CORS to load images from the server
            Width: '500', // width of canvas
            Height: '500', // height of canvas
            BackgroundColor: '� 000000', // the background color of the canvas, which is transparent by default
        }).then((canvas)=>{
            let rpt_title = {'text':'List of Pickups','style':'rpt_title'};
            let img = canvas.toDataURL("image/png"); //base64
            //let img = canvas.toDataURL(); //base64
            let docDefinition = {
                          // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Portrait',
                content: [
                    rpt_title,
                    {
                        image: img,
                        width: 500
                    }],
                    styles:{
                        rpt_title: 
                        {
                            //font: 'Khmer',
                            fontSize: 15,
                            bold: true,
                            color:option.title_color?option.title_color:'#2441B8',
                            margin: [0, 3, 0, 5],
                            alignment: 'center'
                        }
                    }
            };
            pdfMake.createPdf(docDefinition).open();
        });
    }
            
  }
//##### end::pdfReport