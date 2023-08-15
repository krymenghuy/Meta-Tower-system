class FormValidator{
    constructor(form,options={
        'className': className
    }){
        this.form = form;
        this.className = options.className;
    }

    validator = (onFinish=null) => {
        let required = '';
        let div = this.form, className = this.className;

        div.find(`.${className}`).each(function(){
            let el = $(this);
            if(el.is('select') && (el.val() === '')){
                let parent = el.parent();
                if(parent.next().length > 0){
                    parent.next().remove();
                }
                $(`<span class="text-danger pt-3">${parent.prev().text()} is required!</span>`).insertAfter(parent);
                required = 'error';
            }
            else if(el.is('input') && el.attr('type') === 'text'){
                if(el.next().length > 0){
                    el.next().remove();
                }
                if(el.val() === ''){
                    $(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`).insertAfter(el);
                    required = 'error';
                }
            }
            else if(el.is('input') && el.attr('type') === 'number'){
                if(el.next().length > 0){
                    el.next().remove();
                }

                if(el.val() === ''){
                    $(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`).insertAfter(el);
                    required = 'error';
                }
                else if(!($.isNumeric(el.val()))){
                    $(`<span class="text-danger pt-3">${el.prev().text()} must be number!</span>`).insertAfter(el);
                    required = 'error';
                }
            }
            else if(el.is('textarea') && (el.val() === '')){
                if(el.next().length > 0){
                    el.next().remove();
                }
                $(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`).insertAfter(el);
                required = 'error';
            }
            else if(el.is('input') && (el.attr('data-select') === 'datepicker')){
                if(el.next().length > 0){
                    el.next().remove();
                }
                if(el.val() === ''){
                    $(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`).insertAfter(el);
                    required = 'error';
                }
            }
        });
        this.clearForm();
        if((required === '') && (typeof onFinish === 'function')) onFinish();
    }

    clearForm = () => {
        let div = this.form, className = this.className;

        div.find(`.${className}`).each(function(){
            let el = $(this);
            if(el.is('select') && (el.val() !== '')){
                let parent = el.parent();
                if(parent.next().length > 0){
                    parent.next().remove();
                }
            }
            else if(el.is('input') && el.attr('type') === 'text'){
                if(el.val() !== ''){
                    el.next().length > 0 ? el.next().remove() : false;
                }
            }
            else if(el.is('input') && el.attr('type') === 'number'){
                if(el.val() !== '')
                    el.next().length > 0 ? el.next().remove() : false;
                else if($.isNumeric(el.val()))
                    el.next().length > 0 ? el.next().remove() : false;
            }
            else if(el.is('textarea') && (el.val() !== '')){
                if(el.next().length > 0){
                    el.next().remove();
                }
            }
            else if(el.is('input') && (el.attr('data-select') === 'datepicker')){
                if(el.val() !== ''){
                    el.next().length > 0 ? el.next().remove() : false;
                }
            }
        });
    }

    resetForm = () => {
        let div = this.form, className = this.className;

        div.find(`.${className}`).each(function(){
            let el = $(this);
            if(el.is('select')){
                let parent = el.parent();
                if(parent.next().length > 0){
                    parent.next().remove();
                }
            }
            else if(el.is('input') && el.attr('type') === 'text'){
                el.next().length > 0 ? el.next().remove() : false;
            }
            else if(el.is('input') && el.attr('type') === 'number'){
                el.next().length > 0 ? el.next().remove() : false;
            }
            else if(el.is('textarea')){
                el.next().length > 0 ? el.next().remove() : false;
            }
            else if(el.is('input') && (el.attr('data-select') === 'datepicker')){
                el.next().length > 0 ? el.next().remove() : false;
            }
        });
    }
}