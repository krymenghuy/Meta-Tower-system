var RegistrationComponent = new function(){
    let mThis = this;
    this.title_prop = "Registration";
    this.self = $('#_main_registrationComponent');
    this.btnRegister = $('#_rgs_btnRegister');

    this.div_input = mThis.self.find('.st-register--input');
    this.div_list = mThis.self.find('.st-register--list');

    this.init = () => {
        mThis.btnRegister.on('click',function(e){
            e.preventDefault();
            mThis.div_input.show().siblings().hide();
        });

        mThis.div_input.on('click','i.back--rgs',function(e){
            e.preventDefault();
            mThis.div_list.show().siblings().hide();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RegistrationComponent.init();
});