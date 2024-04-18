'use strict';
var PromotionComponent = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#_main_promotionComponent');
  this.title_prop = "Promotions";
  
  this.base_url = main_view.base_url;
  this.img_container = this.self.find('#promo_img_container');
  this.elFilter_app = this.self.find('#_mobile_promo_app');
  this.btnNewPromo = this.self.find('#promo_btnNewPromo');

  this.init = () => {
    if(mThis.initAlready) return;
        mThis.elFilter_app.on('change', (e) => {
          mThis.displayPromotionList();
        });

        mThis.btnNewPromo.on('click', (e) => {
          e.preventDefault();
          let op = { 'title': 'New Promotion', 'user_class': mThis.elFilter_app.val() };
          PromoDialog.show(op);
        });

    mThis.initAlready = true;
  }

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
    cv_interact.confirm('Delete this promotion?', { title: 'Delete Promotion', confirmButtonText: 'Delete', cancelButtonText: 'Close', context: 'delete' }, (e) => {
      if (e) {
        vsapi.call([mThis.base_url, '/dms/promotion/delete'].join(''), p).then(res => {
          if (res.status_code !== 200) cv_interact.error(res.error_message);
          mThis.displayPromotionList();
        });
      }
    });
  }

  this.displayPromotionList = () => {
    let p = { 'user_class': (mThis.elFilter_app.val() + '').toLowerCase() };
    vsapi.call([mThis.base_url, '/dms/promotion/list'].join(''), p).then(res => {
      console.log(res);
      if (res.status_code === 200) {
        let imgs = res.data;

        let i = 0, c;
        mThis.img_container.empty();
        do {
          c = imgs[i];
          if (!c) break;
          if (!c.description) c.description = 'No image description';
          c.image_url = DUtil.escapeHtml(c.image_url);
          c.description = DUtil.escapeHtml(c.description);
          let html_row = [
            '<div class="py-3">',
            '<a href="javascript:void(0)" data-id="', c.id, '" class="btn btn-danger text-white mobile-promo-delete">Delete</a>&nbsp;&nbsp;',
            '<a href="javascript:void(0)" data-id="', c.id, '" class="btn btn-primary mobile-promo-edit">Edit</a>',
            '<div class="thumbnail py-2">',
            '<img class="promo-img img-thumbnail" src="', c.image_url, '"></img>',
            '<div class="caption px-1 py-2"><span class="promo-title" style="width:180px">', c.title, '</span><p class="promo-des-text" style="width:180px">', c.description, '</p></div>',
            '</div>',
            '</div>'].join('');

          mThis.img_container.append(html_row);
          i++;
        }while (c);
        if (i <= 0) {
          let html_row = '<span class="dms-mobile_brand_no_iamge">No promotion images yet</span>';
          mThis.img_container.append(html_row);
        }
      }
    });
  }

  this.show = (option) => {
    mThis.init();
    if (!option) option = {};
    main_view.setTitle(mThis.title_prop);
    mThis.elFilter_app.trigger('change');
    mThis.self.siblings().hide();
    mThis.self.hide().fadeIn(250);
  }
}

const PromoDialog = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#promo_dlgPromo');
  this.base_url =main_view.base_url;

  this.btnOK = this.self.find('#promo_dlgPromo_btnOK');
  this.elDes = this.self.find('#promo_des');

  this.elCategory = this.self.find('#promo_category');
  this.elTitle = this.self.find('#promo_dlgPromoTitle');
  this.elPromoTitle = this.self.find('#promo_title');
  this.elDays = this.self.find('#promo_days_to_expire');
  this.preview_img = this.self.find('#promo_img_preview');

  this.elError = this.self.find('#promo_dlgPromo_error');
  this.image = {};
  this.btnSetImage = this.self.find('#promo_btnSetImage');

  this.lnkImg = this.self.find('#lnk-img-preview');
  this.btnSetImage.hide();
  
  this.lnkImg.on('click', (e) => {
    e.preventDefault();
    FileChooser.chooseFile(null,(d)=>{
      mThis.preview_img.prop('src', DUtil.escapeHtml(d.dataUrl));
      mThis.image.photo_data = d.dataUrl;
    }); 
  });

  // this.btnSetImage.on('click', (e) => {
  //   e.preventDefault();
  //   FileChooser.chooseFile(null,(d)=>{
  //     mThis.preview_img.prop('src', DUtil.escapeHtml(d.dataUrl));
  //   }); 
  // });
 
  this.btnOK.on('click', (e) => {
    let p = mThis.getData();
    if (!p.description) {
     cv_interact.warning("Description is required");
      return;
    }
    if (!p.title) {
      cv_interact.warning("Title is required");
      return;
    }
    console.log(p);
    vsapi.call([mThis.base_url, '/dms/promotion/save'].join(''), p,mThis.btnOK,false).then(res => {
      console.log(res);
      if (res.status_code === 200) {
        if (typeof mThis.onClose === 'function') mThis.onClose(p);
        mThis.self.modal('hide');
        PromotionComponent.displayPromotionList();
      }
      else cv_interact.warning(res.error_message);
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
      let p = { 'id': id, 'user_class': mThis.user_class };
      vsapi.call([mThis.base_url, '/dms/promotion/details'].join(''), p,null,null).then(res => {
        if (res.status_code === 200) {
          let d = StringSanitizer.sanitizeObject(res.data, ['.', '-', '?'], ['description', 'image_url']);
          mThis.elCategory.val(d.category);
          mThis.elDays.val(d.days_to_expire);
          mThis.elDes.val(d.description);
          mThis.elPromoTitle.val(d.title);
          mThis.preview_img.prop('src', DUtil.escapeHtml(d.image_url));
          onFinish();
        }
      });
    }
    else {
      mThis.elDes.val(null);
      mThis.elPromoTitle.val(null);
      mThis.image = null;
      mThis.preview_img.prop('src', null);
    }
  }

  this.show = (op, onClose) => {
    if (!op) op = {};
    let text1 = LocaleManager.trans(op.title);
    mThis.elTitle.html(text1);
    mThis.promo_id = op.promo_id;
    mThis.onClose = onClose;
    mThis.user_class = op.user_class;
    mThis.preview_img.prop('src', null);

    mThis.photo_data = null;
    if (mThis.promo_id > 0) {
      mThis.setData(mThis.promo_id, () => {
        mThis.self.modal({
          backdrop: "static"
        });
      });
    }
    else {
      mThis.setData(null);
      mThis.self.modal({
        backdrop: "static"
      });
    }
  }
}