/** class that contains commonly used functions in DMS system **/
//begin::DUtil class
 let DUtil = new function(){

    // this.compressBase64Image = (base64String, quality)=>{
    //     // Create an Image object to convert the base64 string to an image
    //     let img = new Image();
    //     img.src = base64String;
      
    //     // Create a canvas element to draw the compressed image onto
    //     let canvas = document.createElement("canvas");
      
    //     // Set the canvas dimensions to the dimensions of the original image
    //     canvas.width = img.width;
    //     canvas.height = img.height;
      
    //     // Draw the original image onto the canvas
    //     let ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0);
      
    //     // Get the compressed base64 string from the canvas
    //     let compressedBase64String = canvas.toDataURL("image/jpeg", quality);
      
    //     return compressedBase64String;
    // }

    //process_statuses() is to remove unnecessary statuses for Completed Delviery View. For example, Filter statuses shoud be only "All Statuses", "Delivered","Returned" 
    this.process_statuses = (statuses, removes= [],first_item=null)=>{
      let i =0,c;
      let new_list = [];
      statuses = statuses || [];
      if (first_item) new_list.push(first_item);
      do{
         c = statuses[i];
         if(!c) break;
          if (removes.indexOf(c.id) < 0)  new_list.push(c);  
         i++;
      }while(c);
      return new_list;
    }

    //size-string returned from db example "2.5 30.3 80.0" becomes "25 303 800" because dot sign is removed by normal sanitization.
    //to avoid this problem = > sanitizePackageSize() is used
    this.sanitizePackageSize = (size, display = false)=>{
         //size = 12.3cm x 33.7cm X 10.00cm
        size = (size+'').split(' ').join('').toLowerCase();
        let sts = size.split('x');
        let size_nums = [];
        for(let i=0;i<=2;i++){
        if (!sts[i]) break;
        p = sts[i];
        if (p.slice(-2) ==='cm') p = p.slice(0,p.length -2);
        size_nums.push(p);   
        }
        return (size_nums.join(' '));
    }

  //does the same job as htmlspecialchars() PHP
  this.escapeHtml =(str="")=>
   {
       if(!str) str="";
        let map =
        {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, function(m) {return map[m];});
   }

    //decode string that is encoded by htmlspecialchars() in php
    this.decodeHtml = (str)=>
    {
        if(!str) str="";
        let map =
        {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'"
        };
        return (str+'').replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
    }

    //convert size string into json object
    this.processPackageSize = (size_str)=>{
        if (typeof size_str !== 'string') {
            size_str = String(size_str);
        }
        if(size_str =='') return {'length':0,'width':0,'height':0};
        size_str = size_str.trim();
       let parts = size_str.split(' ');
       if (!parts[0]) 
          return null;
       else if (isNaN(parts[2]) || isNaN(parts[1]) || isNaN(parts[0])) 
         return null;
       else {
           let length = parseFloat(parts[0]);
           let width =  parseFloat(parts[1]);
           let height =  parseFloat(parts[2]);
           return {'length':length,'width':width,'height':height};
       }
    }

    this.properCase = (text='')=>{
        text = text?text:'';
        return [text.slice(0,1).toUpperCase(),text.slice(1)].join('');
    }
    this.getFriendlySize = (size_str)=>{
            size_str = (size_str + '').trim();
            if(size_str =='') return null;
            let parts = size_str.split(' ');
            if (!parts[0]) 
            return false;
        if (!parts[0]) 
            return null;    
        else if (!$.isNumeric(parts[2]) || !$.isNumeric(parts[1]) || !$.isNumeric(parts[0])) 
            return null;
        else {
            let length = parseFloat(parts[0]);
            let width =  parseFloat(parts[1]);
            let height =  parseFloat(parts[2]);
            if(length==0 && width==0 && height ==0) return null;
            return [length,'cm X ',width,'cm X ',height,'cm'].join('');
        }
    }

    this.getStatusClass =(status_id)=>{
        if(status_id==8) return "btn btn-sm btn-outline-success ";
        else if (status_id==11) return "btn btn-sm btn-outline-danger ";
        else if(status_id ==9) return "btn btn-sm btn-outline-danger ";
        else if(status_id ==10) return "btn btn-sm btn-outline-warning ";
        else if(status_id ==6) return "btn btn-sm btn-outline-warning ";
        else return "btn btn-sm btn-outline-primary ";
    }
    
    this.createGUID = function(){
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

 }
//end::DUtil class
