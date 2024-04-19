function FilterDialog(btn, op = {
    fields:{},
    end_point: ''
}, html = null, callback = null) {
    let mnuTimeOut = null;
    let isMouseOut = true;
    let isRemove = false;
    const pos = btn.currentTarget.getClientRects()[0];
    const prev_div = document.body.querySelector('#_dlg_filter_danymic');
    let selected_data = null;
    if(prev_div){
        prev_div.remove();
        return;
    }
    if(!html){
        for(let f in op.fields){
            const x = op.fields[f];
            if(x){
                html = [html, `<div class="form-group">
                    <div class="width--filter-inner">
                        <label for="${x.text_field}" class="form-label">${x.label}</label>
                        <select class="modal-select2 data-filter ${x.name}" data-field="${x.name}"></select>
                    </div>
                </div>` ].join('');
            }
        }
    }

    const div = document.createElement('div');
    div.classList.add('bg-white', 'd-flex', 'flex-column', 'position-absolute', 'shadow', 'p-3', 'rounded-3');
    // div.setAttribute('style',`top: ${pos.top+pos.height}px; left: ${pos.left}px; z-index: 99; right:10px;`);
    div.setAttribute('style',`top: ${pos.top+pos.height}px; right: ${80}px;z-index: 99;`);
    div.setAttribute('id','_dlg_filter_danymic');
    div.innerHTML = html || '';
    document.body.appendChild(div);


    const select2Elements = div.querySelectorAll('select.modal-select2');
    select2Elements.forEach(el =>{
        const jquery_el = $(el);
        jquery_el.select2();
        jquery_el.on('change', e =>{
            selected_data = getSelection();
            /** callback() carries selected data filter as returned parameter */
            if(typeof callback === 'function') callback(selected_data);
        });
        setParentEvent(el,Array.from(select2Elements));

    });

            if(op.end_point){
                vsapi.call(op.end_point,null,null,false).then(res => {
                    if (res.status_code === 200) {
                        let d = res.data;
                        select2Elements.forEach(el=>{
                            const f = op.fields[el.dataset.field];
                            if(!f){
                                console.error([`The data-field `,el.dataset.field,' is not found. Please check your options.fields for details'].join(''));
                            }
                            const def = op.default_values || {};

                            if(!f.depend_on) {
                                let data = d[f.data];
                                if(f.addAll){
                                    data.unshift({'id':null,[f.text_field]:'All'});
                                }
                                VSUtil.setComboItems(el,data,f.value_field,f.text_field,null,null,def[f.name]);
                            }
                        });
                    }
                });
              }


            /** For example term depends on academic_year. This function will set onchange event for academic_year element
                 * el: is, in this exampe, the elTerm
                 * select2Elements: is the array of all SELECT elements, each of which has attribute data-field
                 */
            /**
             * For example, term depends on academic_year. This function will set onchange event for academic_year element
             * el: is, in this example, the elTerm
             * select2Elements: is the array of all SELECT elements, each of which has attribute data-field
             */
            function setParentEvent(el, select2Elements) {
                let f = el.dataset.field;
                const x = op.fields[f];

                if (x?.depend_on) {
                    const elDepended = select2Elements.find(k => k.dataset.field == x.depend_on.field);

                    if (elDepended) {

                        const onParentChangeHandler = e => {
                            const endpoint = x.depend_on.endpoint;
                            if (endpoint) {
                                let p = {};
                                p[x.depend_on.field]=elDepended.value;
                                vsapi.call(endpoint, p, null, false).then(res => {
                                    const items = res.status_code == 200 ? res.data : [];
                                    const def = op.default_values || {};
                                    VSUtil.setComboItems(el, items, x.depend_on.value_field, x.depend_on.text_field, null, null, def[x.depend_on.value_field]);
                                });
                            }
                        };
                        $(elDepended).on('change',onParentChangeHandler);
                    }
                }
            }

   /** callback() does NOT carry selected data filter as returned parameter, BUT it carries "div" object as returned parameter */
    if(html && typeof callback === 'function'){
        callback(div);
    }
    /** returns selected filter data */
    function getSelection(){
       let p = {};
       div.querySelectorAll('.data-filter').forEach(el=>{
          const f = el.dataset.field;
          p[f] = el.value;
       });
       return p;
    }

    // if(typeof callback ==='function'){
    //     div.style.right = "unset";
    //     //callback(selected_data);
    // }

    document.onmouseout = (e) => {
        if (!div.contains(e.relatedTarget)) {
            isMouseOut = true;
            mnuTimeOut = setTimeout(() => {
                if(isMouseOut){
                    div.remove();
                }
            }, 1500);      
        } else {
            if (mnuTimeOut) {
                clearTimeout(mnuTimeOut);
                mnuTimeOut = null;
            }
            isMouseOut = false;
        }
    };
    document.onmousedown = function(e){
        if(!div.contains(e.target)){
            div.remove();
        }
    }

    return this;
    /** NOTE: when using  jquery Select2 by converting normal SELECT element to select2() then the issue with addEventListener('change'). The problem is that the change event is conflected with jquery library, and the event does not fire
     * But if we use el.onchange = (e)=>{ ... } it works by replacing all existing onchange handlers.
     */
}
