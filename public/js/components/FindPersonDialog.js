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