'use strict';
let FileChooser = new function(){
    let mThis = this;
    let id ='_file1111';
    mThis.fileInput = null;
    //jquery object
    mThis.fileInput1 = {};
    
    this.init = ()=>{
        let reader = new FileReader();

        mThis.fileInput = document.getElementById(id);
        if(!mThis.fileInput){
            mThis.fileInput = document.createElement('input');
            mThis.fileInput.type='file';
            mThis.fileInput.setAttribute('id',id);
            mThis.fileInput.setAttribute('accept',`image/*`);
            mThis.fileInput.style.display ='none';
            document.body.appendChild(mThis.fileInput);
            mThis.fileInput1 = $(mThis.fileInput);
        }
      
        mThis.fileInput1.off('change').on('change', function () {
            let files = mThis.fileInput1.prop('files');
            //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
            let file = files[0];
            if (file) {
                if (file.type.match(/^image\/.*/)) {
                    reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                } else {
                    cv_interact.error('The chosen image file is invalid!');
                }
            }
        });
    
        reader.onload = function (e) {
            e.preventDefault();
            //Sanitize photo data or photo stream
            //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
            let photoData = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway
    
            /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
            let base64result = photoData.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */
    
            /*Get file extention or fileType from the base64 String */
            let fileType = photoData.split('/')[1].split(';')[0];
            if (fileType == 'jpeg') fileType = 'jpg'; /* make file extension to 3 characters only */
            /* Display the selected photo image */
            //mThis.imgLogo.prop('src', photoData); // putting file in dom without server upload.
    
            //upload company's logo
    
            let p = {};
            p.dataUrl = photoData;
            p.photoData = base64result; /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
            p.file_type = fileType;
            p.ext = fileType;
            mThis.fileInput1.val(null);
            if(typeof mThis.onClose ==='function') mThis.onClose(p);
        }
    }

    //options = {accept,title}
    this.chooseFile =(options,onClose)=>{
        if(!options) options ={};
        mThis.onClose = onClose;
        if(!options.accept) options.accept =`image/*`; 
        mThis.fileInput1.attr('accept',options.accept);
        mThis.fileInput1.trigger('click');
    }
}
//FileChooser.js must be loaded with "defer" attribute or otherwise it can be loaded after DOM Content Loaded
//FileChooser.init();
window.addEventListener('DOMContentLoaded',e=>{
    FileChooser.init();
})