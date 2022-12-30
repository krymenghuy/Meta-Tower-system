//##### begin::PDFReceipt
var PDFReceipt = new function(){
    let mThis = this;
    // data:image/jpeg;base64
    this.logoBase64 =null;
    // this.getBase64Image = (img)=> {
    //     var canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     var ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0);
    //     var dataURL = canvas.toDataURL("image/png");
    //     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // }

    this.getReceiptContent = (d)=>{
        if(!d) d={};
        let i=0;
        let c;
        if(!d.currency) d.currency ='$';
        if(!d.cur) d.cur = d.currency;
        let items =[
            [{text:'No',style:'th_style'},{text:'Description',style:'th_style'},{text:'Payment Method',style:'th_style'},{text:'Amount',style:'th_style'}]
        ];

        do{
            if(!d.items[i]) break;
            c = d.items[i];
            let amount = [d.cur,c.amount].join('');
            items.push([{text:i+1,alignment:'center',style:'td_text'},{text:c.description,style:'td_text'},{text:c.pmt_method,style:'td_text'},{text: amount ,style:'td_text'}]); 
            i++;
        }while(c);

       content= [
            {
                image: mThis.logoBase64,
                width:80,
                height:80,
            }, 
            {text:'សាកលវិទ្យាលយ័បញ្ញាសាស្ត្រកម្ពុជា',fontSize:20,bold:true,alignment:'center',marginTop:-100},
            {text:'Pannasastra University of Cambodia',fontSize:17,bold:true,alignment:'center',marginTop:-3},
            {text:'Grant Loan Repayment Receipt',fontSize:12,bold:true,alignment:'center',marginTop:-5},
            {text:`NO: ${d.receipt_number}`,fontSize:12,bold:true,alignment:'center'},
            {
                table: {
                    body: [
                    [
                        {text:'Student Name',fontSize:10},
                        {text:`: ${d.payer_name}`},
                        {text:'Receipt No',fontSize:10,marginLeft:250},
                        {text:`: ${d.receipt_number}`,fontSize:10}
                    ],
                   [
                    {text:'Student ID',fontSize:10,marginTop:-5},
                    {text:`: ${d.payer_code}`,marginTop:-5},
                    {text:'Payment date',fontSize:10,marginLeft:250,marginTop:-5},
                    {text:`: ${d.payment_date}`,fontSize:10,marginTop:-5} 
                   ],
                   [
                    {text:'Phone number',fontSize:10,marginTop:-5},
                    {text:`: ${d.phone_number}`,marginTop:-5},
                    {text:'Issue date',fontSize:10,marginLeft:250,marginTop:-5},
                    {text:`: ${d.issue_date}`,fontSize:10,marginTop:-5} 
                   ]
                ]},layout:{defaultBorder:false}
            },

            [
                        {
                            width:"*", 
                            //layout: 'lightHorizontalLines', // optional
                            layout:{
                                                // fillColor: function (rowIndex, node, columnIndex) {
                                    //     return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                                    // },
                                    hLineWidth: function(i, node) {
                                        return 0.5;
                                    //return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                    },
                                    vLineWidth: function(i, node) {
                                        return 0.5;
                                        //return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                    },
                                    // hLineColor: function(i, node) {
                                    //         return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                                    // },
                                    vLineColor: function(i, node) {
                                        return 'grey';
                                        //return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                                    },
                                    hLineColor: function(i, node) {
                                        return 'grey';
                                        //return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                                    }
                                },
                            table: {
                                    // headers are automatically repeated if the table spans over multiple pages
                                    // you can declare how many rows should be treated as headers
                                    headerRows: 1,
                                    widths: ['auto','*','auto','auto'],           
                                    body: items 

                        }, 
                   },
                   {text:`total:${[d.cur,d.total].join('')}`,alignment:'right',marginRight:15,bold:true,fontSize:12}
             ],
            {text:'Receiver`s signature:......................................',alignment:'right',fontSize:11,marginRight:15,marginTop:5,bold:true},
            {text:`Name: ${d.create_user}`,alignment:'right',fontSize:11,marginRight:15,bold:true}
            //,{text:`(${d.create_date})`,alignment:'right',fontSize:9,marginRight:15,bold:true}
          ];
         
          return content; 
    }

    this.getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
          }
        });
    }

    // this.loadLogo = ()=>{
    //    post_ajax([mThis.base_url,'/api/getCompanyLogo'].join(''),null,(d)=>{
    //        mThis.logoBase64 = d;
    //        //$('#test_img').prop('src',mThis.logoBase64);
    //        //alert(mThis.logoBase64);
    //    });
    // }

    //  this.getImage = (base64)=>{
    //     let canvas = document.createElement('canvas');
    //     let img = document.createElement('img');
    //     img.src = base64;
    //     canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
    //                                     0, 0, canvas.width, canvas.height);                            
    //     let dataURL = canvas.toDataURL();
    //     //dataURL = dataURL.replace(`;base64,`,`;base64,`);
    //     //let fileType = dataURL.split('/')[1].split(';')[0];
    //     //alert(fileType);
    //     //dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //     //dataURL = [`data:image/${fileType};base64,/`,dataURL].join('');
    //     //dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //     return dataURL; //dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //   }

      this.init = (logoBase64, receiptInfo)=>{

        mThis.logoBase64 = logoBase64;
        mThis.data = receiptInfo;

        //get companyLogo image as base64 string and store it in mThis.logoBase64;
        //mThis.loadLogo();
        // mThis.getBase64FromUrl("http://127.0.0.1:8000/uploads/public/1_data/general/images/logo.png").then((d)=>{
        //     mThis.logoBase64 =d;
        //     alert(d);
        //     $('#test_img').prop('src',mThis.logoBase64); 
        // });
        
        let op = {'copies_per_page':1};
        mThis.show(op);
      }

    // this.getEncryptData = (qstring,onFinish)=>{
    //   let p = {'data':qstring};
    //   post_ajax([mThis.base_url,'/api/encryptData'].join(''),p,(d)=>{
    //       onFinish(d);
    //   }); 
    // }
 
    //Create PDF content for Receipt
    //d = {payment_date,receipt_number, payer_name, amount, principle_amount, interest_amount,client_remarks}
    //option.copies_per_page=2 
    this.createContent =(d,option)=> {
               /** NOTE: to keep clean code => the following pdfMake.fonts defintion is written in file vfs_fonts.js **/
              // //Define Khmer fonts for pdf doc 
              if(!option.copies_per_page) option.copies_per_page=1;

               pdfMake.fonts = {
                  DaunTep: {
                    //   normal: 'DaunTep.ttf',
                    //   bold: 'DaunTep.ttf',
                      normal: 'Roboto-Regular.ttf', //Khmer unicode font
                      bold: 'Roboto-Regular.ttf',
                      //italics: 'DaunTeav.ttf',
                      //bolditalics: 'DaunTeav.ttf'
                  },
                  Roboto:{
                      normal: 'Roboto-Regular.ttf', //Khmer unicode font
                      bold: 'Roboto-Regular.ttf',
                      italic:'Roboto-Italic.ttf'

                  }
              }   
    
          if (option.copies_per_page==2)    
             receipt_contents=[mThis.getReceiptContent(d),{'text':'',marginTop:15},mThis.getReceiptContent(d)]; 
          else receipt_contents=[mThis.getReceiptContent(d)];      
           
          let docDef = {
                          //page header / footer function
                          // header:function(currentPage, pageCount, pageSize) {
                          //         return [
                          //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                          //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                          //         ]
                          // },
                          pageSize: option.pageSize?option.pageSize:'A4', 
                          pageOrientation: option.pageOrientation?option.pageOrientation:'Portrait',
                          pageMargins:[30,30,30,30], 
                          content:receipt_contents,                  
                                   defaultStyle:{
                                      font:'Roboto',
                                      fontSize: 10,
                                      bold:false,
                                   },
                                   styles: {
                                      rpt_title: 
                                          {
                                              font:'Roboto',
                                              fontSize: 18,
                                              bold: true,
                                              color:option.title_color?option.title_color:'#2441B8',
                                              margin: [0, 3, 0, 0],
                                              alignment: 'center'
                                          },
                                          rpt_sub_title: 
                                          {
                                              font:'Roboto',
                                              fontSize: 12,
                                              bold: true,
                                              color:option.sub_title_color?option.sub_title_color:'grey',
                                              margin: [0, 0, 0, 2],
                                              alignment: 'center'
                                          },
                                          th_style: 
                                          {
                                              font:'Roboto',
                                              fontSize: 11,
                                              bold:true, 
                                              fillColor: option.header_back_color?option.header_back_color:'#fff',
                                              color: option.text_color?option.text_color:'#333435',
                                              margin:[2,2,2,2]
                                          },
                                          td_text:{
                                              font:'Roboto',
                                              fontSize: 11,
                                              color:option.text_color? option.text_color:'#5E5E61'
                                          }

                                  }  
            };
          
            return docDef;
  }
  
  this.resetLogo = (d)=>{
     mThis.logoBase64 = d;
  }

  this.show = (option)=>{ 
      let docDef = mThis.createContent(mThis.data, option);
      /**NOTE:  _vfs_fonts is "Virtual File System fonts" defined in javascript file "vfs_fonts.js" that is in the same directory with file pdfMake.min.js **/
      pdfMake.vfs = _vfs_fonts; // _vfs_fonts is built using node command. 'node build-vfs.js "./examples/fonts" '
      //if(option.styles) pdfMake.styles = option.styles;
 
      if (docDef) pdfMake.createPdf(docDef,null,null).open();
      else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');
      
    }

   this.download = (option)=>{ 
    let docDef = mThis.createContent(mThis.data,option); 
    /**NOTE:  _vfs_fonts is "Virtual File System fonts" defined in javascript file "vfs_fonts.js" that is in the same directory with file pdfMake.min.js **/
    pdfMake.vfs = _vfs_fonts; // _vfs_fonts is built using node command. 'node build-vfs.js "./examples/fonts" '
    //if(option.styles) pdfMake.styles = option.styles;
    if (docDef) pdfMake.createPdf(docDef,null,null).save();
    else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');
 }  
}

// window.addEventListener('DOMContentLoaded',(e)=>{
//     let logo = `<?php echo $logo; ?>`;
//     let receipt_data = `<?php echo $data; ?>`;
//     PDFReceipt.init(logo,receipt_data);
// });

//end::PDFReceipt
