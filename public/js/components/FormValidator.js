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
            let phone = el.data('phone') == true ? el.data('phone') : false;
            let field_required = el.data('required') == false ? el.data('required') : true;

            if(el.is('select') && (el.val() === '') && field_required){
                let parent = el.parent();
                parent.next().remove();
                parent.after(`<span class="text-danger pt-3">${parent.prev().text()} is required!</span>`);
                required = 'error';
            }
            else if(el.is('input') && (el.attr('type') === 'text') && field_required && (!phone)){
                el.next().remove();
                if(el.val() === ''){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                    required = 'error';
                }
            }
            else if(el.is('input') && (el.attr('type') === 'number') && field_required){
                el.next().remove();
                if(el.val() === ''){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                    required = 'error';
                }
                else if(!($.isNumeric(el.val()))){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} must be number!</span>`);
                    required = 'error';
                }
            }
            else if(el.is('textarea') && (el.val() === '') && field_required){
                el.next().remove();
                el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                required = 'error';
            }
            else if(el.is('input') && (el.attr('data-select') === 'datepicker') && field_required){
                el.next().remove();
                if(el.val() === ''){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                    required = 'error';
                }
            }
            else if(el.is('input') && (el.attr('type') === 'email') && field_required){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                el.next().remove();

                if(el.val() === ''){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                    required = 'error';
                }
                else if(!(emailRegex.test(el.val()))){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is not correct!</span>`);
                    required = 'error';
                }
            }
            else if(el.is('input') && (el.attr('type') === 'text') && field_required && phone){
                const phoneRegex = /^\d{9,12}$/;
                el.next().remove();

                if(el.val() === ''){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is required!</span>`);
                    required = 'error';
                }
                else if(!($.isNumeric(el.val()))){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is must be number!</span>`);
                    required = 'error';
                }
                else if(!(phoneRegex.test(el.val()))){
                    el.after(`<span class="text-danger pt-3">${el.prev().text()} is not correct!</span>`);
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
            let phone = el.data('phone') == true ? el.data('phone') : false;

            if(el.is('select') && (el.val() !== '')){
                let parent = el.parent();
                if(parent.next().length > 0){
                    parent.next().remove();
                }
            }
            else if(el.is('input') && (el.attr('type') === 'text') && (!phone)){
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
            else if(el.is('input') && (el.attr('type') === 'email')){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if(el.val() !== '' && emailRegex.test(el.val())){
                    el.next().length > 0 ? el.next().remove() : false;
                }
            }
            else if(el.is('input') && (el.attr('type') === 'text') && phone){
                const phoneRegex = /^\d{9,12}$/;
                if(($.isNumeric(el.val())) && (phoneRegex.test(el.val())) && el.val() !== ''){
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
            else if(el.is('input') && (el.attr('type') === 'email')){
                el.next().length > 0 ? el.next().remove() : false;
            }
        });
    }
}