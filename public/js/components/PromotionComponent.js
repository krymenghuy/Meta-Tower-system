'use strict';
let PromotionComponent = new function () {
  let mThis = this;
  this.self = $('#_main_promotionComponent');
  this.title_prop = "Promotion";
  this.base_url = $('#__base_url').val();

  this.img_container = $('#promo_img_container');

  this.elFilter_app = $('#_mobile_promo_app');
  this.btnNewPromo = $('#promo_btnNewPromo');

  this.init = () => {
    mThis.elFilter_app.on('change', (e) => {
      mThis.displayPromotionList();
    });

    mThis.btnNewPromo.on('click', (e) => {
      e.preventDefault();

      let op = { 'title': 'New Promotion', 'user_class': mThis.elFilter_app.val() };
      PromoDialog.show(op);
    });

  } //end:: init()

  mThis.img_container.on('click', '.mobile-promo-delete', function (e) {
    e.preventDefault();
    let x = $(this);
    let promo_id = x.data('id');
    let user_class = mThis.elFilter_app.val();

    mThis.deletePromotion(promo_id, user_class);
  });

  mThis.img_container.on('click', '.mobile-promo-edit', function (e) {
    e.preventDefault();
    let x = $(this);
    let promo_id = x.data('id');
    if (!promo_id) {
      cv_interact.aerlt('Invalid Promotion id!');
      return;
    }
    let op = { 'title': 'Modify Promotion', 'user_class': mThis.elFilter_app.val(), 'promo_id': promo_id };
    PromoDialog.show(op);
  });

  this.deletePromotion = (promo_id, user_class) => {
    let p = { 'id': promo_id, 'user_class': user_class };
    cv_interact.confirm('Delete this promotion?', { title: 'Delete Promotion', context: 'delete' }, (e) => {
      if (e) {
        vsapi.call([mThis.base_url, '/api/deletePromotion'].join(''), p).then(res => {
          if (res.status_code !== 200) cv_interact.error(res.error_message);
          mThis.displayPromotionList();
        });
      }
    });
  }

  this.displayPromotionList = () => {
    let p = { 'user_class': (mThis.elFilter_app.val() + '').toLowerCase() };
    vsapi.call([mThis.base_url, '/api/getPromotionList'].join(''), p).then(res => {
      if (res.status_code === 200) {
        let imgs = res.data;
        let i = 0, c;
        mThis.img_container.empty();
        //sanitize all Json props except "image_url"
        //imgs = StringSanitizer.sanitizeObject(imgs,null,['image_url']); 
        do {
          c = imgs[i];
          if (!c) break;

          if (!c.description) c.description = 'No image description';
          c.image_url = DUtil.escapeHtml(c.image_url);
          c.description = DUtil.escapeHtml(c.description);
          let html_row = [
            '<div>',
            '<a href="javascript:void(0)" data-id="', c.id, '" class="mobile-promo-delete">Delete</a>&nbsp;&nbsp;',
            '<a href="javascript:void(0)" data-id="', c.id, '" class="mobile-promo-edit">Edit</a>',
            '<div class="thumbnail">',
            '<img class="promo-img" src="', c.image_url, '"></img>',
            '<div class="caption"><span class="promo-title" style="width:180px">', c.title, '</span><p class="promo-des-text" style="width:180px">', c.description, '</p></div>',
            '</div>',
            '</div>'].join('');

          mThis.img_container.append(html_row);
          i++;
        } while (c);
        if (i <= 0) {
          let html_row = '<span class="dms-mobile_brand_no_iamge">No promotion images yet</span>';
          mThis.img_container.append(html_row);
        }
      }
    });
  }

  this.show = (option) => {
    if (!option) option = {};
    main_view.setTitle(mThis.title_prop);
    mThis.elFilter_app.trigger('change');
    mThis.self.show().siblings().hide();
  }
}
//end::PromotionComponent

//begin::PromoDialog
var PromoDialog = new function () {
  let mThis = this;
  this.self = $('#promo_dlgPromo');
  this.base_url = $('#__base_url').val();

  this.btnOK = $('#promo_dlgPromo_btnOK');
  this.elDes = $('#promo_des');

  this.elCategory = $('#promo_category');
  this.elTitle = $('#promo_dlgPromoTitle');
  this.elPromoTitle = $('#promo_title');
  this.elDays = $('#promo_days_to_expire');
  this.preview_img = $('#promo_img_preview');

  this.elError = $('#promo_dlgPromo_error');
  this.image = {};
  this.elFileChooser = $('#_mobile_promo_fileChooser');
  this.btnSetImage = $('#promo_btnSetImage');

  this.lnkImg = $('#lnk-img-preview');
  this.btnSetImage.hide();

  this.lnkImg.on('click', (e) => {
    e.preventDefault();
    mThis.elFileChooser.trigger('click');
  });
  this.btnSetImage.on('click', (e) => {
    e.preventDefault();
    mThis.elFileChooser.trigger('click');
  });


  //begin:: create and init fileReader object
  this.fileReader = new FileReader();
  mThis.fileReader.onload = function (e) {
    e.preventDefault();
    // console.log(e.total); // file size 
    //Sanitize photo data or photo stream
    //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
    let photoData = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway

    /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
    var base64result = photoData.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */
    /*Get file extention or fileType from the base64 String */
    var fileType = photoData.split('/')[1].split(';')[0];
    if (fileType == 'jpeg') fileType = 'jpg'; /* make file extension to 3 characters only */
    /* Display the selected photo image */
    //mThis.imgLogo.prop('src', photoData); // putting file in dom without server upload.

    //begin:: store base64 image data as dialog's prop
    if (!mThis.image) mThis.image = {};
    mThis.image.photo_data = base64result; /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
    mThis.image.file_type = fileType;
    mThis.preview_img.prop('src', photoData);
    //end:: store base64 data as dialog 's prop
    mThis.elFileChooser.val(null);
  }
  //end:: create and initialize fileReader object

  //begin:: initialize fileChooser's onChange event
  this.elFileChooser.off('change').on('change', function () {
    var files = mThis.elFileChooser.prop('files');
    //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
    var file = files[0];
    if (file) {
      if (file.type.match(/^image\/.*/)) {
        mThis.fileReader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
      } else {
        cv_interact.warning('The chosen image file is invalid!');
      }

    }

  });
  //end:: initialize fileChooser's onChange event

  this.btnOK.on('click', (e) => {
    let p = mThis.getData();
    if (!p.description) {
      mThis.elError.text("Description is required");
      return;
    }
    if (!p.title) {
      mThis.elError.text("Title is required");
      return;
    }

    vsapi.call([mThis.base_url, '/api/savePromotion'].join(''), p).then(res => {
      if (res.status_code === 200) {
        if (typeof mThis.onClose == 'function') mThis.onClose(p);
        mThis.self.modal('hide');
        PromotionComponent.displayPromotionList();
      } else mThis.elError.text(res.error_message);
    });
  });

  this.getData = () => {
    if (!mThis.image) mThis.image = {};
    let p = {
      "id": mThis.promo_id,
      "Promo_id": mThis.promo_id,
      "user_class": "merchant",
      "description": mThis.elDes.val(),
      "category": mThis.elCategory.val(),
      "title": mThis.elPromoTitle.val(),
      "photo_data": mThis.image.photo_data,
      "file_type": mThis.image.file_type,
      "days_to_expire": mThis.elDays.val()
    }
    return p;
  }

  this.setData = (id, onFinish) => {
    mThis.elError.html(null);
    if (id > 0) {
      //note that user_class should be "merchant"
      let p = { 'id': id, 'user_class': mThis.user_class };
      vsapi.call([mThis.base_url, '/api/getPromotionInfo'].join(''), p).then(res => {
        if (res.status_code === 200) {
          let d = res.data;
          mThis.elCategory.val(d.category);
          mThis.elDays.val(d.days_to_expire);
          mThis.elDes.val(d.description);
          mThis.elPromoTitle.val(d.title);
          mThis.preview_img.prop('src', DUtil.decodeHtml(d.image_url));
          onFinish();
        }
      });
    } else {
      mThis.elDes.val(null);
      mThis.elPromoTitle.val(null);
      mThis.image = null;
      mThis.preview_img.prop('src', null);
    }

  }

  this.show = (op, onClose) => {
    mThis.elTitle.html(op.title);
    mThis.promo_id = op.promo_id;
    mThis.onClose = onClose;
    //if user_class is not correct => Modify Promotion, not display image preview
    mThis.user_class = op.user_class;
    mThis.preview_img.prop('src', null);

    if (mThis.promo_id > 0) {
      mThis.setData(mThis.promo_id, () => {
        mThis.self.modal({
          backdrop: "static"
        });
      });
    } else {
      mThis.setData(null);
      mThis.self.modal({
        backdrop: "static"
      });
    }
  }
}
//end::PromoDialog

$(document).ready(() => {
  PromotionComponent.init();
});