//corresponding html in packageListComponent.blade.php 
//begin::FindPersonDialog
var FindPersonDialog = new function () {
    let mThis = this;
    this.self = $('#dg_dlgFindPerson');
    this.base_url = $('#__base_url').val();
    this.tblPersons = $('#dg_tblPersons');
    this.tblPersons_body = $('#dg_tblPersons_body');
    this.elSearch = $('#dg_person_search');

    this.btnFind = $('#dg_btnFindPerson');
    this.btnOK = $('#dg_btnChoosePerson');
    this.btnClose = $('#dg_findperson_btnClose');
    this.elTitle = $('#dg_dlgFindPersonTitle');
    this.elInfo = $('#dg_lblInfo');

    this.btnOK.off('click').on('click', () => {
        let ps = mThis.getSelectedPersons();
        if (typeof mThis.onClose == 'function') mThis.onClose(ps);
        mThis.self.modal('hide');
    });

    mThis.btnClose.off('click').on('click', function () {
        mThis.self.modal('hide');
    });

    mThis.elSearch.on('keyup', function (e) {
        mThis.beginFindPersons();
    });

    mThis.btnFind.off('click').on('click', function () {
        mThis.beginFindPersons();
    });

    mThis.tblPersons.on('click', 'tr', function () {
        let tr = $(this);
        tr.toggleClass('selected-animate');
        if (tr.hasClass('selected-animate')) {
            if (mThis.option.singleSelect == true) {
                if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('selected-animate');
            }
            mThis.prev_selected_tr = tr;
        }
    });

    /** @option = {'title','role','findBy','signgleSelect','previousDialog'} **/
    this.show = (option, onClose) => {
        mThis.elInfo.text(null);
        mThis.tblPersons_body.empty();
        mThis.option = option;
        if (!mThis.option) mThis.option = {};

        mThis.onClose = onClose;
        if (option) {
            if (mThis.option.title) mThis.elTitle.html(mThis.option.title);
            if (mThis.option.previousDialog) {
                mThis.option.previousDialog.modal('hide');
            }
        }

        if (mThis.elSearch.val()) mThis.btnFind.trigger('click');

        mThis.self.modal({
            backdrop: 'static'
        }).off('hide.bs.modal').on('hide.bs.modal', function () {
            if (mThis.option.previousDialog) {
                mThis.option.previousDialog.modal({
                    backdrop: 'static'
                });
            }
        });
    }

    this.beginFindPersons = () => {
        let p = {
            'search_value': mThis.elSearch.val(),
            'role': mThis.option.role
        };
        post_ajax([mThis.base_url, '/api/person/find'].join(''), p, function (rows) {
            if (typeof rows == 'string') alert(rows);

            if (rows) {
                rows = StringSanitizer.sanitizeObject(rows);
                mThis.displayPersons(rows);
            }
        });
    }

    this.displayPersons = (rows) => {
        mThis.elInfo.text(null);
        let div = mThis.tblPersons;
        div.removeClass('animate-slide-zoomin').addClass('animate-slide-zoomin');
        mThis.tblPersons_body.empty();
        let i = 0, c;
        do {
            c = rows[i];
            if (!c) break;
            let html = ['<tr data-id="', c.id, '">',
                '<td>', (i + 1), '</td>',
                '<td class="col_code">', c.code, '</td>',
                '<td class="col_name">', c.name, '</td>',
                '<td class="col_role">', c.role, '</td>',
                '<td class="col_phone">', c.phone_number, '</td>',
                '</tr>'].join('');
            mThis.tblPersons_body.append(html);
            i++;
        } while (c);

        if (i <= 0) {
            mThis.elInfo.text('No persons found!');
        }
    }

    this.getSelectedPersons = (singleSelect = true) => {
        let ps = [];
        mThis.tblPersons_body.find('tr.selected-animate').each(function () {
            let tr = $(this);
            let person = {
                'id': tr.data('id'),
                'code': tr.find('td.col_code').text(),
                'name': tr.find('td.col_name').text(),
                'phone_number': tr.find('td.col_phone').text()
            }
            ps.push(person);
            if (singleSelect == true) return ps;
        });
        return ps;
    }
}
//endFindPersonDialog

// //begin::JsonToExcel class
// var JsonToExcel = new function () {
//     let mThis = this;
//     this.in_array = (val, m_array = []) => {
//         let i = 0, c;
//         do {
//             c = m_array[i];
//             if (!c) break;
//             if ($.isNumeric(val)) if (parseFloat(val) == parseFloat(c)) return true;
//             else if ((val + '').toLowerCase() == (c + '').toLowerCase()) return true;
//             i++;
//         } while (c);
//         return false;
//     };

//     this.exportToExcel = function (JSONData, fileTitle, titles, first_row_label = false, exceptColNames = []) {
//         let filename = [fileTitle, '-', (new Date().getUTCMilliseconds()), '.xlsx'].join('');
//         var ws = XLSX.utils.json_to_sheet(JSONData);
//         var wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, fileTitle);
//         XLSX.writeFile(wb, filename);
//     }

//     this.exportToCSV = function (JSONData, FileTitle, titles, first_row_label = true, exceptColNames = []) {
//         //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
//         let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
//         let CSV = '';
//         let except_col_indexes = [];
//         //This condition will generate the Label/Header
//         if (Array.isArray(titles)) {
//             let row = "";
//             //This loop will extract the label from 1st index of on array
//             let row_index = 0;
//             for (let index in titles) {
//                 //Now convert each value to string and comma-seprated
//                 let col_name = titles[index];
//                 if (!mThis.in_array(col_name, exceptColNames)) {
//                     row = [row, col_name, ','].join('');
//                 } else except_col_indexes.push(index);
//             }
//             row_index++;
//             row = row.slice(0, -1);
//             //append Label row with line break
//             CSV = [CSV, row, '\r\n'].join('');
//         } else {
//             if (first_row_label) {
//                 let row = "";
//                 //This loop will extract the label from 1st index of on array
//                 for (let index in arrData[0]) {
//                     //Now convert each value to string and comma-seprated
//                     row += (index + '').replace('_', ' ') + ',';
//                 }
//                 row = row.slice(0, -1);
//                 //append Label row with line break
//                 CSV += row + '\r\n';
//             }
//         }

//         //1st loop is to extract each row
//         let i = 0, c;
//         do {
//             c = arrData[i]; //c is array of columns
//             if (!c) break;
//             let row = "";
//             for (let index in c) {
//                 let val = c[index];
//                 val = $.isNumeric(val) ? (val + ' ') : val; //To prevent Excel display Number in Cell not formmatted as Text
//                 if (!mThis.in_array(index, except_col_indexes)) row = [row, `"${val}"`]; //row += '"' + val + '",';
//             }
//             row.slice(0, row.length - 1);
//             //add a line break after each row
//             CSV = [CSV, row, '\r\n'].join('');
//             i++;
//         } while (c);

//         if (CSV == '' || !CSV) {
//             alert("Failed to create CSV file because the provided data is invalid");
//             return;
//         }

//         //Generate a file name
//         let filename = [FileTitle, '-', (new Date().getUTCMilliseconds())].join('');

//         //To ensure that blob and CSV file show Khmer unicode correctly
//         let blob = new Blob([["\uFEFF", CSV].join('')], {
//             type: 'text/csv; charset=utf-18'
//         });

//         if (navigator.msSaveBlob) { // IE 10+
//             navigator.msSaveBlob(blob, filename);
//         } else {
//             let link = document.createElement("a");
//             if (link.download !== undefined) { // feature detection
//                 // Browsers that support HTML5 download attribute
//                 let url = URL.createObjectURL(blob);
//                 link.setAttribute("href", url);
//                 link.style = "visibility:hidden";
//                 link.download = filename + ".csv";
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             }
//         }
//     };
// };
// //end::JsonToExcel class
 