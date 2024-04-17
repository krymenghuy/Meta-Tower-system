"use strict";
var ProductCategoriesComponent = function() {
  const title_prop = "Product Categories";
  const base_url = main_view.base_url;
  const self = main_view.appContent.find('#_main_productCategoriesComponent')[0];
  const btnSave = self.querySelector('#_pdc_btnNew');

  const columns = [
    {
      title: "Category",
      data: (data) => {
        return `<span class="fw-semibold">${data.name}</span>`;
      },
    },
    {
      title: "Last Updated",
      data: (data) => {
        return `<span class="d-block p-1 fw-semibold">${data.update_user ? data.update_user : 'Unknown'}</span>
                <span class="d-block p-1 text-left text-muted"><small>${data.updated_at}</small></span>`;
      },
    },
    {
      title: "Action",
      data: (data) => {
        return `<div class="d-flex align-items-center gap-2">
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-pdc-modify">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                  </a>
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-pdc-delete">
                    <i class="fa-solid fa-trash-can text-danger fs-5"></i>
                  </a>
                </div>`;
      },
    },
  ];

  const categoryListView = new ListView('div_category_list', {
    fetchApi: `${base_url}/dms/category/list-paginate`,
    columns: columns,
    tableClass: "table header-light-blue header-uppercase",
    rowCreated: (data, index, tr) => {
      tr.dataset.id = data.id;
    },
    beforeRender: () => {},
  });

  const tblProductCategory = categoryListView.getTable();

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    const op = {
      id: 0,
      onClose: (e) => {
        if (e) {
          categoryListView.showPage();
        }
      }
    }
      ProductCategoryDialog.show(op);
  });

  tblProductCategory.addEventListener('click', (e) => {
    let lnk = e.target.closest('.btn-pdc-modify');
    if (lnk) {
      e.preventDefault();
      const op = {
        id: lnk.getAttribute('data-id'),
        name: lnk.getAttribute('data-name'),
        onClose: (e) => {
          categoryListView.showPage();
        },
      };
      ProductCategoryDialog.show(op);
      return;
    } 

    lnk = e.target.closest('.btn-pdc-delete');
    if (lnk) {
      e.preventDefault();
      const p = {
        id: lnk.getAttribute('data-id'),
        name: lnk.getAttribute('data-name'),
      };
      cv_interact.confirm('Delete this product?', {
        title: 'delete product',
        context: 'delete',
      }, (confirmed) => {
        if (confirmed) {
          vsapi.call(`${base_url}/dms/category/delete`, p)
            .then((res) => {
              if (res.status_code === 200) {
                categoryListView.showPage();
              } else {
                cv_interact.error(res.error_message);
              }
            });
        }
      });
    }
  });

  return {
    show: (options = null) => {
      options = options ? options : {};
      Array.from(self.parentElement.children).forEach((div) => {
        if (div.style.display !== 'none') {
          div.style.display = 'none';
        }
      });

      categoryListView.showPage();
      self.style.display = 'block';
      main_view.setTitle(title_prop);
    },
  };
}();

class ProductCategoryDialog {
  // constructor() {
       //Put init code here if any
   
  // }

  static show(option){
    this.formUntil = new FormUntil({
      "itemName": "Product Category",
      "formId": '_pdc_dlgProductCategory',
      "instance": this,
      "apiSave": `${main_view.base_url}/dms/category/save`,
      "apiGet": `${main_view.base_url}/dms/category/details`,
      "modifyTitle": "Modify Product type",
      "createTitle": "New Product Type",
      "identityProps": ['id'],
      'use_alert_error': false
    });
    this.formUntil.show(option);
  }
}