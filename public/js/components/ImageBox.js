//begin::ImageBox
class ImageBox {
    constructor(div_preview_id, options = {}) {
      options = options ? options : {};
      this.options = options;
      this.options.altText = this.options.altText ? this.options.altText : "Photo";
      this.options.chooseButtonText = this.options.chooseButtonText ? this.options.chooseButtonText : "Choose Image";
      if (typeof this.options.onImageChoose !== 'function') this.options.onImageChoose = () => { return null; };
      if (typeof this.options.onImageDelete !== 'function') this.options.onImageDelete = () => { return null; };
      this.div_image_view = $(`#${div_preview_id}`);
    }
    getImage() {
      return ImageHelper.urlToBase64(this.div_image_view.find('img').prop('src'));
    }
    getImageSRC() {
      return this.div_image_view.find('img').prop('src');
    }
    
    saveImage(data, onFinish) {
      if (this.options.apiSave) {
        const that = this;
        let p = (typeof this.options.apiSave.params === 'function') ? this.options.apiSave.params(data) : this.options.apiSave.params;
        console.error(this.options.apiSave.endpoint);
        console.error(p);
        if (!this.options.apiSave.endpoint) throw `ImageBox with id ${div_preview_id} provided apiSave, but did not specify the endpoint`;
        vsapi.call(this.options.apiSave.endpoint, p, null, false).then(res => {
          if (typeof that.options.apiSave.callback === 'function') that.options.apiSave.callback(res);
          if (res.status_code === 200) {
            onFinish(res);
          } else cv_interact.warning(res.error_message);
        });
      } else {
        //In case: there is no apiSave provided => just preview image
        onFinish(null);
      }
    }
  
    //set image preview | or clearImage by calling setImage(null)
    setImage(image = null, altText = null) {
      if (altText) this.options.altText = altText;
      const that = this;
      if (!image || image.trim() == "") {
        this.div_image_view.html(`<div class="btn-choose-image d-flex align-items-center justify-content-center flex-column w-100 h-100" role="button">
              <i class="fa-regular fa-file fs-4 text-muted"></i>
              <p class="text-muted mt-4" style="font-size:12px">${that.options.chooseButtonText}<p>
              </div>`);
  
        //begin:: set event handlers for Choose Image buttons
        that.div_image_view.find('.btn-choose-image').off('click').on('click', function (e) {
          e.preventDefault();
          FileChooser.chooseFile(null, (d) => {
            if (d) {
              that.options.onImageChoose(d);
  
              //saveImage() will check if there is apiSave provided or no. If there is apiSave then it will commit save image and then handle the callback onFinish(),
              //if there is no apiSave provided then saveImage() method will only handle the callback onFinish directly
              that.saveImage(d, (api_response) => {
                that.div_image_view.html(`<img class="img-thumbnail w-100 h-100 data-input" src="${d.dataUrl}" alt="" data-field="${altText}"/>
                <a href="javascript:void(0)" class="btn--close btn position-absolute" style="right:10px;top:5px">
                <i class="fa-solid fa-xmark fs-5 text-danger"></i>
                </a>`);
  
                //Set event hanler for Clear image
                that.div_image_view.find('.btn--close').off('click').on('click', function (e) {
                  e.preventDefault();
                  //$(this).parent().empty();
                  that.options.onImageDelete(image);
                  if (that.options.apiDelete) {
                    cv_interact.confirm("Delete this image?", { 'title': 'Delete Image', "context": "delete" }, e => {
                      if (e) {
                        let p = (typeof that.options.apiDelete.params === 'function') ? that.options.apiDelete.params(image) : that.options.apiDelete.params;
                        vsapi.call(that.options.apiDelete.endpoint, p, null, false).then(res => {
                          if (typeof that.options.apiDelete.callback === 'function') that.options.apiDelete.callback(res);
                          if (res.status_code === 200) {
                            that.setImage(null, that.options.altText);
                          } else cv_interact.warning(res.error_message);
                        });
                      }
                    })
                  } else
                    that.setImage(null, that.options.altText);
                });
              });
            }
          });
        });
        //end set event handlers for Choose Image button
  
      } else {
        that.div_image_view.html(`<img class="img-thumbnail w-100 h-100 data-input" src="${image}" alt="" data-field="${altText}"/>
              <a href="javascript:void(0)" class="btn--close btn position-absolute" style="right:10px;top:5px">
                  <i class="fa-solid fa-xmark fs-5 text-danger"></i>
              </a>`);
      }
  
      that.div_image_view.on('mouseenter', function (e) {
        e.preventDefault();
        $(this).find('.btn--close').css('display', 'block');
      }).on('mouseleave', function (e) {
        e.preventDefault();
        $(this).find('.btn--close').css('display', 'none');
      });
  
      //Set event hanler for Clear image
      that.div_image_view.find('.btn--close').off('click').on('click', function (e) {
        e.preventDefault();
        that.options.onImageDelete(image);
        if (that.options.apiDelete) {
          let p = (typeof that.options.apiDelete.params === 'function') ? that.options.apiDelete.params(image) : that.options.apiDelete.params;
          vsapi.call(that.options.apiDelete.endpoint, p, null, false).then(res => {
            if (res.status_code === 200) {
              if (typeof that.options.apiDelete.callback === 'function') that.options.apiDelete.callback(res);
              that.setImage(null, that.options.altText);
            } else cv_interact.warning(res.error_message);
          });
        } else
          that.setImage(null, that.options.altText);
      });
    }
  };