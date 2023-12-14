"use strict";
var RemarksComponent = function() {
  const title_prop = "Driver Remarks";
  const module_id = 219;
  const base_url = main_view.base_url;
  const self = main_view.appContent.find('#_main_remarksComponent')[0];
  const btnSave = self.querySelector('#_rmk_btnNew');

  const columns = [
    {
      title: "description",
      data: (data,index,tr) => {
        return `<span class="fw-semibold">${data.description}</span>`;
      },
    },
    {
      title: "Category",
      data: (data,index,tr) => {
        return `<i class="la la-mobile text-success fs-4"></i><span class="ml-2 fw-semibold">${data.category}</span>`;
      },
    },
    // {
    //   title: "Fee Charge",
    //   data: (data,index,tr) => {
    //     return `<span class="fw-semibold">${data.fee_eligible==1? 'Yes':'No'}</span>`;
    //   },
    // },
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
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.description}" class="btn-remark-modify">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                  </a>
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.decription}" class="btn-remark-delete">
                    <i class="fa-solid fa-trash-can text-danger fs-5"></i>
                  </a>
                </div>`;
      },
    },
  ];

  const remarkListView = new ListView('div_remark_list', {
    fetchApi: `${base_url}/api/remarks/list-paginate`,
    columns: columns,
    tableClass: "table header-light-blue header-uppercase",
    rowCreated: (data, index, tr) => {
      tr.dataset.id = data.id;
    },
    beforeRender: () => {},
  });

  const tblRemarks = remarkListView.getTable();

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    const op = {
      id: 0,
      onClose: (e) => {
        if (e) {
          remarkListView.showPage();
        }
      }
    }
      RemarkDialog.show(op);
  });

  tblRemarks.addEventListener('click', (e) => {
    let lnk = e.target.closest('.btn-remark-modify');
    if (lnk) {
      e.preventDefault();
      const op = {
        id: lnk.getAttribute('data-id'),
        description: lnk.getAttribute('data-name'),
        onClose: (e) => {
          remarkListView.showPage();
        },
      };
      console.log(op);
      RemarkDialog.show(op);
      return;
    } 

    lnk = e.target.closest('.btn-remark-delete');
    if (lnk) {
      e.preventDefault();
      const p = {
        id: lnk.getAttribute('data-id'),
        description: lnk.getAttribute('data-name'),
      };
      cv_interact.confirm('Delete this remarks?', {
        title: 'Delete Remarks',
        context: 'delete',
      }, (confirmed) => {
        if (confirmed) {
          vsapi.call(`${base_url}/api/remarks/delete`, p)
            .then((res) => {
              if (res.status_code === 200) {
                remarkListView.showPage();
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

      remarkListView.showPage();
      self.style.display = 'block';
      main_view.setTitle(title_prop);
    },
  };
}();

class RemarkDialog {
  // constructor() {
       //Put init code here if any
   
  // }

  static show(option){
    this.formUntil = new FormUntil({
      "itemName": "Remarks",
      "formId": '_rmk_dlgRemarks',
      "instance": this,
      "apiSave": `${main_view.base_url}/api/remarks/save`,
      "apiGet": `${main_view.base_url}/api/remarks/details`,
      "modifyTitle": "Modify Remarks",
      "createTitle": "New Modify Remarks",
      "identityProps": ['id'],
      'use_alert_error': false
    });
    this.formUntil.show(option);
  }
}