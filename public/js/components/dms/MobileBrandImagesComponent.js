'use strict';
var MobileBrandImagesComponent= new function(){
    let mThis = this;
    this.self = main_view.appContent.find('#_main_mobileBrandImagesComponent');
    this.title_prop = "Mobile Brand Images";
    this.base_url = main_view.base_url;

    this.img_container = this.self.find('#bi_img_container');

    this.elFilter_app = this.self.find('#_mobile_brand_app');
    this.btnAddImage = this.self.find('#_mobile_brand_btnAddImage');
    this.btnFileChoose = this.self.find('#_mobile_brand_fileChooser');

    this.init = ()=>{
       if (mThis.initAlready) return;
       mThis.elFilter_app.on('change',(e)=>{
          mThis.displayIamges(); 
       });
 
        this.btnAddImage.off('click').on('click', function () {
               FileChooser.chooseFile(null,d=>{
                 if(d){
                   let p = {'photo_data':d.dataUrl,'file_type':d.file_type,'user_class':mThis.elFilter_app.val()};
                   vsapi.call(`${main_view.base_url}/dms/mobile-settings/save-brand-image`,p,null,main_view.apiCluster).then(res=>{
                     if(res.status_code ===200){
                         let imgs = res.data.imgs;
                         mThis.renderImages(imgs);
                     }else cv_interact.warning(res.error_message);
                   });
                 }
               });
        });
       
        mThis.initAlready = true;
    } 
    //end:: init()

    mThis.img_container.on('click','.mobile_brand_image-delete',function(e){
        e.preventDefault();
        let x = $(this);
        let pic_id = x.data('id');
        let app_name  = mThis.elFilter_app.val();
        mThis.deleteBrandPicture(pic_id,app_name);
    });
    
    this.deleteBrandPicture = (pic_id, user_class)=> {
        let p = {'id':pic_id,'user_class':user_class};
        cv_interact.confirm('Delete this picture?',{title:'Delete Brand Picture',context:"delete"},(e)=>{
          if(e){
            vsapi.call(`${mThis.base_url}/dms/mobile-settings/delete-brand-image`,p).then(res => {
                if (res.status_code === 200) 
                  {
                    let imgs = res.data.imgs;
                    mThis.renderImages(imgs);
                  }
                else cv_interact.error(res.error_message);
            }); 
          }
        }); 
    }

    this.renderImages = (imgs)=>{
            let i =0,c;
            mThis.img_container.empty();
            //sanitize all Json props except "image_url"
            //let imgs = StringSanitizer.sanitizeObject(res.data.imgs,null,['image_url']); 
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
            if(i<=0) {
              let html_row = '<span class="dms-mobile_brand_no_iamge">No brand images yet</span>'; 
              mThis.img_container.append(html_row);
            }
    }

    this.displayIamges = ()=>{
       let p = {'user_class': (mThis.elFilter_app.val()+'').toLowerCase()}; 
      vsapi.call(`${mThis.base_url}/dms/mobile-settings/brand-images`,p,null,false).then(res => {
           if(res.status_code === 200) {
              let imgs = StringSanitizer.sanitizeObject(res.data,null,['image_url']); 
              mThis.renderImages(imgs);
           }
       });
    } 

    this.show = (option)=>{
      mThis.init();
      if(!option) option= {};
      main_view.setTitle(mThis.title_prop);
      mThis.elFilter_app.trigger('change');
      mThis.self.siblings().hide();
      mThis.self.hide().fadeIn(250); 
    }
}