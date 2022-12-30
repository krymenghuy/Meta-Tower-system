'use strict'
var MobileBrandImagesComponent= new function(){
    let mThis = this;
    this.self = $('#_main_mobileBrandImagesComponent');
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    //this.tblIamges = $('#_mobile_brand_tblIamges');
    //this.tblIamges_body = $('#_mobile_brand_tblIamges_body');

    this.img_container = $('#bi_img_container');

    this.elFilter_app = $('#_mobile_brand_app');
    this.btnAddImage = $('#_mobile_brand_btnAddImage');
    this.btnFileChoose = $('#_mobile_brand_fileChooser');

    this.init = ()=>{
      mThis.elFilter_app.on('change',(e)=>{
        mThis.displayIamges(); 
      });

      mThis.btnAddImage.on('click',function(e){
          mThis.btnFileChoose.trigger('click');
      });

        this.btnFileChoose.off('change').on('change', function () {
                var files = mThis.btnFileChoose.prop('files');
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

                //begin:: upload brand image
                        var p = {};
                        p.photo_data = base64result; /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                        p.file_type = fileType;
                        p.user_class = (mThis.elFilter_app.val()+'').toLowerCase();
                        post_ajax([mThis.base_url,'/api/saveBrandImage'].join(''),p,function(result) {
                            if (typeof result =='string') alert(result);  
                            if (result.status =='OK')
                            {
                                mThis.displayIamges(); 
                                //cv_interact.alert('Brand image uploaded');
                            }
                            else cv_interact.alert(result.error_message,'','error');
                        });
                //end::upload brand image
                mThis.btnFileChoose.val(null);
            }
    } //end:: init()

    mThis.img_container.on('click','.mobile_brand_image-delete',function(e){
        e.preventDefault();
        let x = $(this);
        let pic_id = x.data('id');
        let app_name  = mThis.elFilter_app.val();
        mThis.deleteBrandPicture(pic_id,app_name);
    });
    
    this.deleteBrandPicture = (pic_id, user_class)=> {
        let p = {'id':pic_id,'user_class':user_class};
        cv_interact.confirm('Delete this picture?','Delete Brand Picture',(e)=>{
          if(e){
            post_ajax([mThis.base_url,'/api/deleteBrandImage'].join(''),p,function(err){
                if (err) cv_interact.alert(err); 
                mThis.displayIamges();
            }); 
          }
        },'Delete','Close','delete'); 
    }

    this.displayIamges = ()=>{
       let p = {'user_class': (mThis.elFilter_app.val()+'').toLowerCase() };
       post_ajax([mThis.base_url,'/api/getMobileBrandImages'].join(''),p,function(imgs){
           if(imgs) {
             let i =0,c;
             mThis.img_container.empty();
              //sanitize all Json props except "image_url"
              //imgs = StringSanitizer.sanitizeObject(imgs,null,['image_url']); 
             do{
                 c = imgs[i];
                 if(!c) break;
                   
                   if (!c.description) c.description = 'No image description';
                   c.image_url = DUtil.escapeHtml(c.image_url);
                   c.description = DUtil.escapeHtml(c.description);
                   let html_row = ['<div class="thumbnail"><img class="brand-img" src="',c.image_url,'"></img>',
                   '<div class="caption"><p class="dms-brand-image-des">',
                   '<a href="javascript:void(0)" data-id="',c.id,'" class="mobile_brand_image-delete"><i class="fa fa-times"></i> Delete&nbsp;</a>',
                    c.description,
                   '</p>',
                   '</div></div>'].join('');

                  //  let html_row = ['<tr data-id="',c.id,'">',
                  //  '<td class="col-brand-image"><div class="thumbnail"><img class="brand-img" src="',c.image_data,'"></img>',
                  //  '<div class="caption"><p class="dms-brand-image-des">',c.description,'</p>',
                  //  '</div></div>',
                  //  '</td>',
                  //  '<td class="brand-image-des">',
                  //  '<div class="flat-box">',
                  //    '<button data-id="',c.id,'" class="btn btn-danger mobile_brand_image-delete"><i class="fa fa-times"></i> Delete Picture</button>',
                  //  '<div>',  
                  //  '</td>',
                  //  '</tr>'].join('');
                   mThis.img_container.append(html_row);
                 i++;
             }while(c);
             if (i<=0) {
                let html_row = '<span class="dms-mobile_brand_no_iamge">No brand images yet</span>'; 
                mThis.img_container.append(html_row);
             }
           }
       });
    } 

    this.show = (option)=>{
      if(!option) option= {};
      mThis.elScreenTitle.html(option.title);
      mThis.elFilter_app.trigger('change');
      mThis.self.show().siblings().hide();
    }
}

$(document).ready(()=>{
    MobileBrandImagesComponent.init();
});