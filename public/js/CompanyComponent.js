'use strict'
var CompanyComponent = new function(){
    let mThis = this;
	this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_companyComponent');
    this.btnSave = $('#_main_comp_btnSaveProfile');

      this.imgLogo = $('#com_imgLogo');
	  this.logoFileChooser = $('#com_logoFileChooser');
	  this.btnChooseLogo = $('#com_btnChooseLogo');
	  this.btnDeleteLogo = $('#com_btnDeleteLogo');
      this.fields =[];

	 this.btnSave.on('click',function(e){
	   let p = mThis.getData();	 
	   
       post_ajax([mThis.base_url,'/api/saveCompanyInfo'].join(''),p,function(err){
		   if(!err || err ==''){
             cv_interact.alert('Company information updated!','','info');
		   }else cv_interact.alert(err,'','error');
	   });
	 }); 

	 this.displayCompanyInfo = ()=>{
        post_ajax([mThis.base_url,'/api/getCompanyInfo'].join(''),null,function(d){
			if(d){
				d= StringSanitizer.sanitizeObject(d,'email');
				mThis.setData(d);
			}
		});
	 }
 
    this.init = ()=>{
            
		  mThis.self.find('.data-input').each(function(){
             mThis.fields.push({"element":$(this), "dataMember":$(this).data('field') });
		  });

         //##### begin:: managing logo upload
		    var reader = new FileReader();
            reader.onload = function (e) {
			  e.preventDefault();	
            // console.log(e.total); // file size 
            //Sanitize photo data or photo stream
            //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
            var photoData = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

            /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
            var base64result = photoData.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */

            /*Get file extention or fileType from the base64 String */
            var fileType = photoData.split('/')[1].split(';')[0];
            if (fileType == 'jpeg') fileType = 'jpg'; /* make file extension to 3 characters only */
            /* Display the selected photo image */
            //mThis.imgLogo.prop('src', photoData); // putting file in dom without server upload.

            //upload company's logo
           
                var p = {};
                p.photoData = base64result; /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                p.fileType = fileType;
				 
                post_ajax([mThis.base_url,'/api/saveCompanyLogo'].join(''),p,function(result) {
					if (typeof result =='string') alert(result); 
					 if (result.status =='OK')
					 {
						 mThis.imgLogo.prop('src',photoData);
						 cv_interact.alert('Logo uploaded');
					 }
					 else cv_interact.alert(result.error_message,'','error');
					 mThis.logoFileChooser.val(null);//clear to ensure second time it works for same file chosen
				});
        };
		
		   this.btnDeleteLogo.off('click').on('click',function(e) {
			   e.preventDefault();
			   cv_interact.confirm('Delete this logo?','Delete Logo',function(e) {
				    if(e)
					{
					      post_ajax([mThis.base_url,'/api/deleteCompanyLogo'].join(''),null,function(err) {				 
							 if (!err || err =='')
							 {
								 mThis.imgLogo.prop('src',null);
								 cv_interact.alert('Logo deleted!');
							 }
							 else cv_interact.alert(err,'','error');
						}); 
					}
			   });

		   });
		   
		   this.btnChooseLogo.off('click').on('click',function(e) {
			   e.preventDefault();
			   mThis.logoFileChooser.trigger('click');
		   });
		   
		   this.logoFileChooser.off('change').on('change', function () {
				var files = mThis.logoFileChooser.prop('files');
				//Note:  reader.readAsDataURL() triggers the reader.onLoad event above
				var file = files[0];
				if (file) {
					if (file.type.match(/^image\/.*/)) {
						//if (file.size >2000) {
						//    alertify.showWarning('The image file is too big');
						//} else {
						reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */

						//}


					} else {
						cv_interact.alert('The chosen image file is invalid!','','error');
					}

				}

			});
		
	  //#### End::Managing logo upload
	 

    }
    //end::init()

    this.show = (option)=>{
	  mThis.elScreenTitle.html(option.title);	
	  mThis.displayCompanyInfo();	
      mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }

    this.setData= function(com) 
	  {   
		 var i=0, c;
         do{
			 c = mThis.fields[i];
			 if (!c) break;
			  if (com.hasOwnProperty(c.dataMember)) c.element.val(com[c.dataMember]);  
			 i++;
		 }while(c);	
         mThis.displayLogo();	 
	  };
	  
	  this.displayLogo = function()
	  {
		  post_ajax([mThis.base_url,'/api/getCompanyLogo'].join(''),null,function(d) {
			   //d = StringSanitizer.sanitizeOut(d,'image');
			   mThis.imgLogo.prop('src',d);
		  });
	  }
      this.getData= function() 
	  {
		 var i=0, c;
		 var d = {};
         do{
			 c = mThis.fields[i];
			 if (!c) break;
			 d[c.dataMember] = c.element.val();   
			 i++;
		 }while(c);
		 
         return d;		 
	  };		  

 
}

$(document).ready(function() {
    CompanyComponent.init();
});