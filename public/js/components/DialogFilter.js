function DialogFilter(btn,op={
    select: 0,
    label: [],
    field: [],
    end_point: ''
},html=null,callback=null){
    let pos = btn.target.getClientRects()[0];
    let prev_div = document.getElementById('_dlg_filter_danymic');
    if(prev_div) prev_div.remove();

    if(!html){
        for(let i=0; i < op.select; i++){
            html = [html,`<div class="form-group">
                <div class="width--filter-inner">
                    <label for="${op.field[i]}" class="form-label">${op.label[i]}</label>
                    <select class="modal-select2 data-filter" data-field="${op.field[i]}"></select>
                </div>
            </div>`].join('');
        }
    }

    const div = document.createElement('div');
    div.classList.add('bg-white','d-flex','flex-column','position-absolute','shadow','p-3','rounded-3');
    div.setAttribute('style',`top: ${pos.top+pos.height}px; left: ${pos.left}px; z-index: 99`);
    div.setAttribute('id','_dlg_filter_danymic');
    div.innerHTML = html ? html : '';
    document.body.appendChild(div);
    $(div).find('select.modal-select2').select2();
    vsapi.call(op.end_point,null,null,false).then(res => {
        if(res.status_code === 200){
            let d = res.data;
            $(div).find('.data-filter').each(function(){
                let el = $(this);
                let f = el.data('field');
                let name = f.replace('_id','');
                let text = d[name] ? `${name}_name` : f+'s';
                VSUtil.setComboItems(el,(d[name] || d[text]),'id',`${text}`,null,null,null);
            });
        }
    });
    callback && callback(div);

    document.onmousedown = function(e){
        if(!div.contains(e.target)){
            $(div).hide('fast');
            div.remove();
        }
    }
}