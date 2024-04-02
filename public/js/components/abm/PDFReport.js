"use strict";
//##### begin::pdfReport
let pdfReport = new function () {
    let mThis = this;
    this.getEncryptData = (qstring, onFinish) => {
        let p = { 'data': qstring };
        vsapi.call([main_view.base_url, '/api/encryptData'].join(''), p,null,false).then(d => {
            onFinish(d);
        });
    }

    this.myImage = `
     data:image/png;base64,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
     `;
    this.getImage = (base64) => {
        let canvas = document.createElement('canvas');
        let img = document.createElement('img');
        img.src = base64;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
            0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }

    //Create pdf document base on a given table_id with my default style 
    this.createPDFDocument_table = (table_id, option = {}, extend_last_column = true) => {
        let table = document.getElementById(table_id);
        let def_td_style = option.td_style ? option.td_style : {
            font: 'DaunTep',
            fontSize: 9,
            color: option.text_color ? option.text_color : '#5E5E61',
            margin: [0, 0, 0, 0]
        };

        let def_th_style = option.th_style ? option.th_style : {
            //font: 'Khmer',
            fontSize: 11,
            bold: true,
            fillColor: option.header_back_color ? option.header_back_color : '#fff',
            color: option.text_color ? option.text_color : '#333435',
            margin: [0, 0, 0, 0]
        };

        let start_col_index = option.start_col_index ? option.start_col_index : 0;
        let col_widths = [];
        let col_count = 0; //count number oc olumns
        let header_cols = [];
        if (!table.rows[0]) {
            alert('createPDFDocument_table() => The given table does not have any row');
            return;
        }
        let cnt = table.rows[0].cells.length;
        for (let i = start_col_index; i < cnt; i++) {
            let cell = table.rows[0].cells[i];
            col_widths[i - start_col_index] = 'auto';
            let col = { 'text': cell.innerText, 'style': 'th_style' };
            header_cols[i - start_col_index] = col;
            //widths[i] = (cell.style.width != ""? cell.style.width : cell.style.offsetWidth); //if the cell's style width is not set, get its' actual width
        }

        let bdy = [];
        let c, i = 1; //NOTE: $i start from 1, not zero. because 0 is header row

        //insert header_row before adding body rows
        bdy.push(header_cols);
        do {
            c = table.rows[i];
            if (!c) break;
            if (col_count <= 0 || !col_count) col_count = cnt; //** OR  col_count = c.cells.length;
            let row = [];

            for (let x = start_col_index; x < col_count; x++) {
                let cell_value = c.cells[x] ? c.cells[x].innerText : '';
                row.push({ "text": cell_value, "style": "td_text" });
            }
            bdy.push(row);
            i++;
        } while (c);
        /** prevent error when there are no data row **/
        if (!bdy[1][0]) {
            let empty_row = [];
            col_count = cnt;
            for (let x = start_col_index; x < col_count; x++) {
                empty_row.push({ "text": "", "style": "td_text" });
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
            Roboto: {
                normal: 'Roboto-Regular.ttf', //Khmer unicode font
                bold: 'Roboto-Regular.ttf',
                italic: 'Roboto-Italic.ttf'

            }
        }

        //make custom table layout style
        pdfMake.tableLayouts = {
            myCustomLayout: {
                hLineWidth: function (i, node) { return 1; },
                vLineWidth: function (i, node) { return 1; },
                hLineColor: function (i, node) { return '#D9E0DF'; },
                vLineColor: function (i, node) { return '#D9E0DF'; },
                //fillColor: function (i, node) {return 'green';},
                paddingLeft: function (i, node) { return 5; }
            }
        };

        //make sure that last column's width takes all remaining spave
        if (extend_last_column) col_widths[col_count - 1] = "*";

        let rpt_title = { 'text': option.title ? option.title : 'Report Title', 'style': 'rpt_title' };
        let rpt_sub_title = null;
        if (option.subTitle) rpt_sub_title = { 'text': option.subTitle, 'style': 'rpt_sub_title' };
        let docDef = {
            //page header / footer function
            // header:function(currentPage, pageCount, pageSize) {
            //         return [
            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            //         ]
            // },
            pageSize: option.pageSize ? option.pageSize : 'A4',
            pageOrientation: option.pageOrientation ? option.pageOrientation : 'Landscape',
            pageMargins: [15, 15, 15, 15],
            content: [
                rpt_title,
                rpt_sub_title,
                {
                    layout: function () {

                    }
                },
                {
                    layout: 'myCustomLayout', // optional
                    table: { headerRows: 1, widths: col_widths, body: bdy }
                }],
            defaultStyle: {
                font: 'DaunTep'
            },
            styles: {
                rpt_title:
                {
                    //font: 'Khmer',
                    fontSize: 10,
                    bold: true,
                    color: option.title_color ? option.title_color : '#2441B8',
                    margin: [0, 0, 0, 0],
                    alignment: 'center'
                },
                rpt_sub_title: {
                    fontSize: 9,
                    bold: true,
                    color: option.sub_title_color ? option.sub_title_color : 'grey',
                    margin: [0, 0, 0, 0],
                    alignment: 'center'
                },
                th_style: def_th_style
                ,
                td_text: def_td_style

            }
        };

        return docDef;
    }

    //Create pdf document based on JSON data
    /***
      option = {'header_columns','title','subTitle','td_style','th_style','text_color'}
      example: 
               option.text_color = '#5E5E61',

               option.td_style = {
                 fontSize:9,
                 color:'#5E5E61',
                 bold:true/false
                 margin:[1,1,1,1]
               }

            option.header_columns: [] //list of header's titles, example ['Name','Place of Birth','Date of Birth','Phone Number']         
    ***/
    this.createPDFDocumentFromJson = (data, option = {}, extend_last_column = true) => {
        if (!data || !data[0] || data == []) return null;
        let col_widths = [];
        let header_cols = [];
        let col_cnt = 0; // count number columns;

        let def_td_style = option.td_style ? option.td_style : {
            //font: 'Khmer',
            fontSize: 8,
            color: option.text_color ? option.text_color : '#5E5E61',
            margin: [1, 1, 1, 1]
        };

        let def_th_style = option.th_style ? option.th_style : {
            font: 'DaunTep',
            fontSize: 9,
            bold: true,
            fillColor: option.header_back_color ? option.header_back_color : '#fff',
            color: option.text_color ? option.text_color : '#333435',
            margin: [0, 0, 0, 0]
        };

        let bdy = [];
        let user_header_cols = null;
        if (Array.isArray(option.header_columns)) {
            let x = 0, c;
            user_header_cols = [];
            do {
                c = option.header_columns[x];
                if (!c) break;
                user_header_cols.push({ 'text': c, 'style': 'th_style' });
                x++;
            } while (c);
        }
        
        //let except_props = option.exceptProps; // array of exceptions ['email','col_name']
        if (Array.isArray(data)) // process Array object = [{pro1,prop2,...}]
        {
            let i = 0, myObj;

            do {
                myObj = data[i]; //rows array of objects
                if (!myObj) break;
                let row = [];
                for (let property in myObj) {
                    if (i == 0) {
                        col_widths.push('auto');
                        if (!user_header_cols) header_cols.push({ 'text': property, 'style': 'th_style' });
                        col_cnt++;
                    }
                    row.push({ "text": myObj[property], "style": "td_text" });
                } //end::for loop

                if (user_header_cols) {
                    if (!user_header_cols[col_cnt - 1]) {
                        alert('Header columns less than number of provided data properties');
                        return;
                    } else if (user_header_cols[col_cnt]) {
                        alert('Header columns more than number of provided data properties');
                        return;
                    }
                }

                // Add header row
                if (i === 0) {
                    if (!user_header_cols) {
                        bdy.push(header_cols);
                    } else bdy.push(user_header_cols);
                }

                bdy.push(row);
                i++;
            } while (myObj);

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
            Roboto: {
                normal: 'Roboto-Regular.ttf', //Khmer unicode font
                bold: 'Roboto-Regular.ttf',
                italic: 'Roboto-Italic.ttf'

            }
        }

        //pdfMake.vfs = pdfFonts.pdfMake.vfs;
        //make custom table layout style
        pdfMake.tableLayouts = {
            myCustomLayout: {
                hLineWidth: function (i, node) { return 1; },
                vLineWidth: function (i, node) { return 1; },
                hLineColor: function (i, node) { return '#D9E0DF'; },
                vLineColor: function (i, node) { return '#D9E0DF'; },
                //fillColor: function (i, node) {return 'green';},
                paddingLeft: function (i, node) {
                    return 3;
                    //return i === 0 ? 2 : 2; // check by row index (i)
                }
                , paddingRight: function (i, node) {
                    return 3;
                    //return (i === node.table.widths.length - 1) ? 0 : 8;
                }
                , paddingTop: function (i, node) {
                    return 1;
                }
                , paddingBottom: function (i, node) {
                    return 1;
                }
            }
        };

        //make sure that Last col take remaining space for its width
        if (extend_last_column) col_widths[col_cnt - 1] = "*";

        //let rpt_title= {'text':option.title?option.title:'Report Title','style':'rpt_title'};
        let rpt_sub_title = option.subTitle;
        if (!option.subTitle) option.subTitle = option.sub_title;
        if (option.subTitle) rpt_sub_title = { 'text': option.subTitle, 'style': 'rpt_sub_title' };
        let titles = [];
        if (option.title) titles.push({ 'text': option.title, 'style': 'rpt_title' });
        if (option.subTitle) titles.push({ 'text': option.subTitle, 'style': 'rpt_sub_title' });
        titles.push(option.heading_contents);

        let docDef = {
            //page header / footer function
            // header:function(currentPage, pageCount, pageSize) {
            //         return [
            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            //         ]
            // },
            pageSize: option.pageSize ? option.pageSize : 'A4',
            pageOrientation: option.pageOrientation ? option.pageOrientation : 'Landscape',
            pageMargins: [10, 10, 10, 10],
            content: [
                titles
                ,
                {
                    layout: 'myCustomLayout',//'headerLineOnly', // optional
                    table: { headerRows: 1, widths: col_widths, body: bdy }
                }

            ],
            defaultStyle: {
                font: 'DaunTep',
                fontSize: 10,
                bold: false,
            },
            styles: {
                rpt_title:
                {
                    font: 'DaunTep',
                    fontSize: 15,
                    bold: true,
                    color: option.title_color ? option.title_color : '#2441B8',
                    margin: [0, 3, 0, 0],
                    alignment: 'center'
                },
                rpt_sub_title:
                {
                    font: 'DaunTep',
                    fontSize: 10,
                    bold: true,
                    color: option.sub_title_color ? option.sub_title_color : 'grey',
                    margin: [0, 0, 0, 2],
                    alignment: 'center'
                },
                th_style: def_th_style
                ,
                td_text: def_td_style

            }
        };

        return docDef;
    }

    //JsonToPDF()
    this.viewPDF_json = (data, option) => {
        let docDef = mThis.createPDFDocumentFromJson(data, option);
        /**NOTE:  _vfs_fonts is "Virtual File System fonts" defined in javascript file "vfs_fonts.js" that is in the same directory with file pdfMake.min.js **/
        pdfMake.vfs = _vfs_fonts; // _vfs_fonts is built using node command. 'node build-vfs.js "./examples/fonts" '
        if (option.styles) pdfMake.styles = option.styles;
        if (docDef) pdfMake.createPdf(docDef, null, null).open();
        else cv_interact.error('It seems no data to display. If you see data, make sure your search box is empty');
    }

    //viewPDF_fromTable() | htmlTableToPDF()
    this.viewPDF = (table_id, option) => {
        let docDef = mThis.createPDFDocument_table(table_id, option);
        //##Start creating PDF using pdfmake.js
        pdfMake.vfs = _vfs_fonts;
        if (docDef) pdfMake.createPdf(docDef).open();
        else cv_interact.error('It seems no data to display. If you see data, make sure your search box is empty');

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
    //options = {pageSize,pageOrientation,titleColor} 
    this.htmlToPdf = (elementId, option = {}) => {
        option= option?option:{};
        //set default title
        if(!option.title) option.title ='List of Pickups';
        //const  html2canvas =  new html2canvas();
        html2canvas(document.getElementById(elementId), {
            Scale: 5, // scale, default is 1
            Allowtaint: false, // allow cross domain images to contaminate the canvas
            Usecors: true, // do you want to use CORS to load images from the server
            Width: '500', // width of canvas
            Height: '500', // height of canvas
            BackgroundColor: '× 000000', // the background color of the canvas, which is transparent by default
        }).then((canvas) => {
            let rpt_title = { 'text': option.title, 'style': 'rpt_title' };
            let img = canvas.toDataURL("image/png"); //base64
            //let img = canvas.toDataURL(); //base64
            let docDefinition = {
                // header:function(currentPage, pageCount, pageSize) {
                //         return [
                //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                //         ]
                // },
                pageSize: option.pageSize ? option.pageSize : 'A4',
                pageOrientation: option.pageOrientation ? option.pageOrientation : 'Portrait',
                content: [
                    rpt_title,
                    {
                        image: img,
                        width: 500
                    }],
                styles: {
                    rpt_title:
                    {
                        //font: 'Khmer',
                        fontSize: 15,
                        bold: true,
                        color: option.titleColor ? option.titleColor : '#2441B8',
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