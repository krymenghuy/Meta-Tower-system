"use strict";
var StudentInformationComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Information";
    this.self = $('#_main_studentInformationComponent');

    this.elSearch = mThis.self.find('#el_sin_search');
    this.elFilter = mThis.self.find('#el_sin_filter');

    this.cols = [{
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "Student ID",
        className: 'align-middle',
        data: "student_code"
    },
    {
        title: "Full Name",
        className: "text-capitalize align-middle",
        data: "name"
    },
    {
        title: "Full Name (KH)",
        className: "text-capitalize align-middle",
        data: "name_kh"
    },
    {
        title: "Sex",
        className: 'align-middle',
        data: (data, a, b) => {
            return [`${data.sex === 'M' ? 'Male' : 'Female'}`].join('');
        }
    },
    {
        title: "Date of Birth",
        className: 'align-middle',
        data: (data, a, b) => {
            let dob = data.date_of_birth ? data.date_of_birth : '';
            return new Date(dob).toLocaleDateString('km-KH',{
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Family ID",
        className: 'align-middle',
        data: "family_id"
    },
    {
        title: "Action",
        className: 'align-middle',
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-sin-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                </a>
                <a href="javascript:void(0)" class="btn-sin-audio" data-id="${data.id}">
                    <i class="fa-solid fa-music fs-5 text-info"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl--sin',{
            'fetchApi':`${main_view.base_url}/api/student/information`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-id',data.id);
            },
            'beforeRender':()=>{}
        });

        mThis.tblStudent = $(mThis.itemView.getTable());
        new SearchData(mThis.elSearch,mThis.tblStudent);

        mThis.cfg = new ExpandableRowConfig('tbl--sin_table',{
            'dontExpandByClickingOn': ['btn-sin-modify','btn-sin-audio'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                if(id > 0)
                    mThis.displayStudentInformationDetails(detail_tr,id);
            }
        });

        mThis.tblStudent.on('click','a.btn-sin-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            StudentInfoDialog.show(op);
        });

        mThis.tblStudent.on('click','a.btn-sin-audio',function(e){
            e.preventDefault();
            const tr = $(this).closest('tr');
            let op = {
                'id': $(this).data('id'),
                'code': tr.find('.Student-ID').text(),
                'name': tr.find('.Full-Name').text(),
                'photo': tr.find('.image-student-tbl').prop('src'),
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            StudentAudioDialog.show(op);
        });
    }

    this.prepareAcademic = () => {
        vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elFilter,d,'id','academic_year',null,null,null);
        });
    }

    this.displayStudentInformationDetails = (tr, id) => {
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.empty();
        let html = null;

        vsapi.call(`${main_view.base_url}/api/student/enrollment-details`,{'student_id': id},null,false).then(res => {
            let d = [], cur_symbol = '$';
            if(res.status_code === 200){
                d = res.data;
            }
            
            d && d.map(enroll => {
                let cls = enroll.status === 'pending' ? 'text-danger' : enroll.status === 'surcharge' ? 'text-warning' : enroll.status === 'verified' ? 'text-primary' : 'text-success';

                html = [html, `<div class="d-flex w-50 rounded-3 bg-light gap-2 min-width-box-enroll">
                    <div class="w-50 p-3 text-nowrap">
                        <p>
                            <span class="text-primary-emphasis">Campus</span>
                            <span>:</span>
                            <span>${enroll.campus}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Session</span>
                            <span>:</span>
                            <span>${enroll.session}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Level</span>
                            <span>:</span>
                            <span>${enroll.level}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Academic Year</span>
                            <span>:</span>
                            <span>${enroll.academic_year}</span>
                        </p>
                    </div>
                    <div class="w-50 p-3">
                        <p>
                            <span class="text-primary-emphasis">Tuition</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Tuition Due</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition_due}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Tuition Paid</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition_paid}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Status</span>
                            <span>:</span>
                            <span class="text-capitalize ${cls}">${enroll.status}</span>
                        </p>
                    </div>
                </div>`].join('');
            });

            if(d && d.length > 0){
                div_wrapper.addClass(['gap-2','on-hover-to-scroll']);
                div_wrapper.html(['<div class="position-absolute d-flex gap-2">',html,'</div>'].join(''));
                div_wrapper.on('wheel',function(e){
                    const event = e.originalEvent;
                    this.scrollLeft += event.deltaY;
                });
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.prepareAcademic();
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let StudentInfoDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_sin_');
    this.options = {};

    this.btnSave = mThis.self.find('#dlg_sin_btn_save');
    this.elImage = mThis.self.find('#dlg_sin_choose_image');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        const p = mThis.getDataForm();
        if(e.originalEvent.detail < 2){
            vsapi.call(`${main_view.base_url}/api/student/update-info`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function')
                        mThis.options.onClose();
                }
                else
                    cv_interact.error(res.error_message);
            });
        }
        else{
            cv_interact.loading();
        }
    });

    mThis.elImage.on('click',function(e){
        e.preventDefault();
        FileChooser.chooseFile(null,(d) => {
            if(d){
                const parent = $(this).parent();
                mThis.setImage(parent,d.dataUrl);
            }
        });
    });

    this.setImage = (div,image_url) => {
        if(image_url){
            const html = [`<img class="w-100 h-100 object-fit-contain rounded-3 data-input" src="${image_url}" alt="" data-field="photo"/>
            <div class="dlg-container-image-icon">
                <a href="javascript:void(0)" class="dlg-sin-delete">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
            div.html(html);
            mThis.deleteImage(div);
        }
    }

    this.deleteImage = (div) => {
        const delete_btn = div.find('.dlg-sin-delete');
        delete_btn.on('click',function(e){
            e.preventDefault();
            const html = [`<div id="dlg_sin_choose_image" class="dlg-sin-clickable">
                <i class="fa-regular fa-image fs-2 text-muted"></i>
            </div>`].join('');
            div.html(html);

            const choose_btn = div.find('#dlg_sin_choose_image');
            choose_btn.on('click',function(e){
                e.preventDefault();
                FileChooser.chooseFile(null,(d) => {
                    if(d){
                        mThis.setImage(div,d.dataUrl);
                    }
                });
            });
        });
    }

    this.getDataForm = () => {
        const div = mThis.self;
        let p = {
            'id': mThis.options.id
        };

        div.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            if(el.is('img'))
                p[f] = el.prop('src');
            else
                p[f] = el.val();
        });

        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        const div = mThis.self;
        if(!($.isEmptyObject(d))){
            const container_image = div.find('.image-dialog-container');
            mThis.setImage(container_image, d.image_url);
        }
        else{
            const container_image = div.find('.image-dialog-container'),
            html = [`<div id="dlg_sin_choose_image" class="dlg-sin-clickable">
                <i class="fa-regular fa-image fs-2 text-muted"></i>
            </div>`].join('');
            container_image.html(html);
            container_image.find('#dlg_sin_choose_image').on('click',function(e){
                e.preventDefault();
                FileChooser.chooseFile(null,(d) => {
                    if(d){
                        mThis.setImage(container_image,d.dataUrl);
                    }
                });
            });
        }

        div.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.loadFormDetails = (op,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/student/details-info`,{'id': op.id},null).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                mThis.setDataForm(d);
            }
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.loadFormDetails(options,() => {
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

let StudentAudioDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_sin_audio');
    this.options = {};

    this.btnAudio = mThis.self.find('#dlg_sin_audio_choose');
    this.containerAudio = mThis.self.find('#dlg_sin_audio_show');
    this.btnSave = mThis.self.find('#dlg_sin_audio_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        const p = mThis.getDataForm(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/student/save-audio`,p,mThis.btnSave).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                cv_interact.success('Audio File Uploaded Successfully!');
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    mThis.btnAudio.on('click',function(e){
        e.preventDefault();
        FileChooser.chooseFile({
            'accept': 'audio/*'
        },(d) => {
            if(d){
                const div = mThis.containerAudio;
                mThis.setAudio(div,d);
            }
        });
    });

    this.setAudio = (div,d) => {
        if((d.file_url || d.dataUrl)){
            const html = [`<audio class="w-100" controls controlsList="nodownload">
                <source class="data-audio" src="${d.dataUrl ? d.dataUrl : d.file_url}" type="audio/${d.file_type ? d.file_type : d.extensions}">
                <source class="data-audio" src="${d.dataUrl ? d.dataUrl : d.file_url}" type="audio/mpeg">
                <source class="data-audio" src="${d.dataUrl ? d.dataUrl : d.file_url}" type="audio/ogg">
            </audio>`].join('');
            div.removeClass('p-4').addClass('p-2').html(html);
        }
        else{
            div.removeClass('p-2').addClass('p-4').empty();
        }
    }

    this.getDataForm = (silent=false) => {
        const div = mThis.self;
        let audio_data = div.find('.data-audio').prop('src');
        if(!audio_data){
            if(!silent){
                cv_interact.warning('There is no audio file input yet');
                return null;
            }
        }
        let p = {
            'student_id': mThis.options.id,
            'base64': audio_data.split(',')[1]
        };
        return p;
    }

    this.setInitialStudent = (d) => {
        d = d ? d : {};
        const div = mThis.self;
        div.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            if(el.is('img'))
                el.prop('src',d[f]);
            else
                el.text(d[f]);
        });
    }

    this.loadFormDetails = (op, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/student/audio`,{'student_id': op.id},null).then(res => {
            if(res.status_code === 200){
                let d = res.data;
                d.extensions = mThis.getFileExtension(d.file_url);
                const div = mThis.containerAudio;
                mThis.setAudio(div,d);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.getFileExtension = (url) => {
        if(url && mThis.isValidUrl){
            const path = url.split('/').pop(),
            filename = path.split('?')[0],
            extensions = filename.split('.').pop();
            return extensions;
        }
    }

    this.isValidUrl = (url) => {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        mThis.loadFormDetails(options,() => {
            mThis.setInitialStudent(options);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentInformationComponent.init();
});