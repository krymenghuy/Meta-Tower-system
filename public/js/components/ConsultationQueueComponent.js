"use strict";
//begin:: QueueComponent
let ConsultationQueueComponent = new function () {
    let mThis = this;
    this.title_prop = 'Queued Tickets';
    this.self = $('#_main_consultationQueueComponent');

    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.tblTickets = $('#_csq_tblTickets');
    this.elSearchAppt = $('#_csq_search_ticket');
    this.btnSearchAppt = $('#_csq_btnFindTicket');
    this.appt_filter_status = $('#_csq_filter_status');
    this.appt_filter_date = $('#_csq_filter_date');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.btnNewTicket = $('#_csq_btnNewTicket');
    this.col_titles = {
        "Ticket Number": "Ticket Date",
        "Client ID": "Client ID",
        "Client Name": "Client Name",
        "Sex": "Sex",
        "Client Phone": "Phone Number",
        "Date": "Date",
        "Priority": "Priority",
        "Schedule Type": "Schedule Type",
        "Status": "Status",
        "Action": "Action"
    };

    //Initialize langauge translation tasks (for dataTable columns headers)
    //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
    //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'ticket', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    //SetQueueStatus()
    this.setTicketStatus = (detail_tr, d = {}) => {
        let tr = detail_tr.prev();
        let btn = tr.find('a.btn_ticket_status');
        btn.text(d.status);
        btn.data('statusid', d.status_id);
        let btnQ = detail_tr.find('.btn-add-queue');
        if (d.status_id > 2) {
            btnQ.hide();
            tr.find('a.btn_ticket_modify').hide();
        } else {
            btnQ.show();
            tr.find('a.btn_ticket_modify').show();
        }
        btnQ.show();
    }

    this.init = () => {
        //This is to refresh Datatable's header texts when language changes
        LocaleManager.setLanguageChangeHandler((lang) => {
            mThis.displayTicketList();
        });

        //loadChiefComplaints() will retrieve list of chief complaints and stores them in "mThis.chief_complaints"
        mThis.loadOptions();

        mThis.btnSearchAppt.on('click', (e) => {
            e.preventDefault();
            mThis.displayTicketList();
        });

        //Search Appointment on Appointment List view
        mThis.elSearchAppt.on('keyup', (e) => {
            e.preventDefault();
            let d = mThis.elSearchAppt.val();
            if (!d) mThis.displayTicketList();
            else if (e.keyCode === 13) mThis.displayTicketList();
        });

        mThis.appt_filter_date.on('change', (e) => {
            mThis.displayTicketList();
        });

        mThis.appt_filter_status.on('change', (e) => {
            mThis.displayTicketList();
        });

        mThis.btnNewTicket.on('click', function (e) {
            e.preventDefault();

            let op = { 'identity_value': 0 };
            PatientDialog.show(op, (e) => {
                if (e) {
                    cv_interact.info('New Ticket has been created', null, true);
                    mThis.displayTicketList();
                }
            });
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_action', function (e) {
            e.preventDefault();
        });

        mThis.tblTickets.on('click', '.btn_ticket_status', function (e) {
            e.preventDefault();
            let btn = $(this);
            let status_id = btn.data('statusid');
            alert('Change status from ' + status_id);
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
        });

        this.cfg = new ExpandableRowConfig('_csq_tblTickets', {
            'dontExpandByClickingOn': ['btn_ticket_modify', 'btn_apt_delete', 'btn_ticket_action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let ticket_id = q_tr.data('id');
                //Show Expandable Details of each ticket (QTicket)
                TicketDetails.show($(detail_tr), {
                    'ticket_id': ticket_id,
                    'client_id': q_tr.data('clientid'),
                    'person_id': q_tr.data('personid'),
                    'status_id': q_tr.data('statusid')
                });
            }
        });

        mThis.tblTickets.on('click', 'a.btn_apt_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this ticket?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Dont Delete', title: null, 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/ticket/delete`, p).then((res) => {
                        if (res.status_code === 200) {
                            mThis.displayTicketList();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.createDropdownMenuHtml_loan = (items = [], data = null, data_props = []) => {
        if (!data_props) data_props = [];
        let str_props = "";
        data_props.map((prop_name) => {
            prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
            if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
        });

        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Review Application</span</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="#"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.getTicketStatusClass = (status_id) => {
        if (status_id == 0) return 'border-secondary';
        else if (status_id == 1) return 'border-warning';
        else if (status_id == 2) return 'border-success';
        else 'btn btn-outline-warning';
    }

    //displayCreditOfficerList()| displayCO|
    this.displayTicketList = (onFinish = null) => {
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchAppt.val(), 'date': mThis.appt_filter_date.val(), 'status_id': mThis.appt_filter_status.val() };
        window.vsapi.call(`${mThis.base_url}/api/ticket/list`, p).then((result) => {
            let data = [];

            if (result.status_code === 200) data = StringSanitizer.sanitizeObject(result.data, null, ['cur_symbol', 'arrival_time']);
            if (mThis.table) {
                mThis.tblTickets.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblTickets.empty();
                mThis.table = null;
            }
            //begin::Set up columns
            let my_columns = [
                {
                    data: function (data, a, b) {
                        return ['<span class="qul-ticket-number">', data.ticket_number, '</span>',
                        ].join('');
                    },
                    title: mThis.trans_title('Ticket Number')
                },
                {
                    title: mThis.trans_title('Client ID'),
                    data: 'client_code'

                },
                {
                    title: mThis.trans_title('Client Name'),
                    data: 'client_name'

                },
                {
                    title: mThis.trans_title('Sex'),
                    data: (data, a, b) => {
                        return data.client_sex;
                    }
                },
                {
                    title: mThis.trans_title('Schedule Type'),
                    data: (data, a, b) => {
                        return data.schedule_type;
                    }
                },
                {
                    title: mThis.trans_title('Priority'),
                    data: (data, a, b) => {
                        return data.priority;
                    }
                },
                {
                    title: mThis.trans_title('Status'),
                    data: (data, a, b) => {
                        return [`<a href="#" style="display:block;text-align:center;width:85px;padding:5px;" data-statusid="${data.status_id}" class="btn_ticket_status border rounded-pill ${mThis.getTicketStatusClass(data.status_id)}">`, data.status, `</a>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        let status_class = null; //mThis.getStatusClass(data.status_id);
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_co_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a style="display:${data.status_id > 2 ? 'none' : 'block'}" href="javascript:void(0)" class="btn_ticket_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_apt_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_apt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            if (!mThis.table)
                mThis.table = mThis.tblTickets.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    //dom: 'Bfrtip',
                    retrieve: true,
                    //scrollY:390,
                    //scrollX:500,
                    //pagingType:'numbers',
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    // rowReorder: {
                    // dataSrc: 'sequence'
                    // },
                    'processing': true,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    'data': data,
                    'columns': my_columns
                    , "createdRow": function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                        tr.data('tid', data.id);
                        //both of the above "tid" and "id" are the same. It is ticket ID
                        tr.data('statusid', data.status_id);
                        tr.data('clientid', data.client_id);
                        tr.data('personid', data.person_id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.loadOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((d) => {
            mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
        });

        window.vsapi.call(`${main_view.base_url}/api/settings/options-ticket-status`, null).then((res) => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.appt_filter_status, items, 'id', 'ticket_status', true, 'All Statuses', 0);
                if (onFinish) onFinish();
                mThis.form_data.departments = items;
            }
        });
    }

    this.show = (option = null) => {
        mThis.displayTicketList(() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}

$(document).ready(() => {
    TicketDetails.init('_csq_tblTickets');
    ConsultationQueueComponent.init();
});