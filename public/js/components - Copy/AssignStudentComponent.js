'use strict';
var AssignStudentComponent = new function(){
    let mThis = this;
    this.title_prop = 'Assign Student To Group';
    mThis.self = $('#_main_assignStudentComponent');

    this.init = () => {}

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        let x = mThis.self.siblings(':visible');
        x.hide(0,function(){
            mThis.self.hide().fadeIn(200);
        });
    }
}