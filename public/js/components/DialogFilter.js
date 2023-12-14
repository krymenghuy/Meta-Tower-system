function DialogFilter(btn, op = {
    select: 0,
    label: [],
    field: [],
    end_point: ''
}, html = null, callback = null) {
    const pos = btn.currentTarget.getClientRects()[0];
    const prev_div = document.getElementById('_dlg_filter_danymic');

    if(prev_div) prev_div.remove();
    if(!html){
        for(let i = 0; i < op.select; i++){
            html = [html, `<div class="form-group">
                <div class="width--filter-inner">
                    <label for="${op.field[i]}" class="form-label">${op.label[i] ? op.label[i] : ''}</label>
                    <select class="modal-select2 data-filter" data-field="${op.field[i]}"></select>
                </div>
            </div>` ].join('');
        }
    }

    const div = document.createElement('div');
    div.classList.add('bg-white', 'd-flex', 'flex-column', 'position-absolute', 'shadow', 'p-3', 'rounded-3');
    div.setAttribute('style',`top: ${pos.top+pos.height}px; left: ${pos.left}px; z-index: 99; right:10px;`);
    div.setAttribute('id','_dlg_filter_danymic');
    div.innerHTML = html ? html : '';
    document.body.appendChild(div);

    const select2Elements = div.querySelectorAll('select.modal-select2');
    select2Elements.forEach(function(el){
        $(el).select2();
    });

    if(op.end_point){
        vsapi.call(main_view.base_url+op.end_point,null,null,false).then(res => {
            if (res.status_code === 200) {
                const d = res.data;
                select2Elements.forEach(el => {
                    const field = el.dataset.field;
                    let name = field.replace('_id','');
                    let text = d[name] ?  `${name}_name`  : field + 's';
                    VSUtil.setComboItems($(el),(d[name] || d[text]),'id',`${text}`,null,null,null);
                });
            }
        });
    }

    callback && callback(div);
    document.onmousedown = function(e){
        if(!div.contains(e.target)){
            div.remove();
        }
    }
}