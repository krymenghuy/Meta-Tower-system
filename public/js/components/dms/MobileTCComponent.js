"use strict";
var MobileTCComponent = new function () {
    const mThis = this;
    this.title_prop = "Terms and Conditions";
    this.self = main_view.appContent.children('#_main_mobileTCComponent');
    this.elFilter_app = this.self[0].querySelector('#_mtc_filter_app');
    this.btnPrint = this.self[0].querySelector('#_mtc_btnPrint');
    this.btnSave = this.self[0].querySelector('#_mtc_btnSave');
    this.divEditor = this.self[0].querySelector('div.ql-editor');

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.elFilter_app.onchange = e =>{
             e.preventDefault();
             mThis.displayContent();
        }

        mThis.btnSave.onclick = e =>{
            e.preventDefault();
            mThis.saveContent();
        }

        mThis.initAlready = true;
    }
    
    this.saveContent = ()=>{
        let app_id = mThis.elFilter_app.value;
        this.divEditor = this.divEditor  || this.self[0].querySelector('div.ql-editor');
        let p = {"app_id":app_id, "content": mThis.divEditor.innerHTML };
        vsapi.call(`${main_view.base_url}/dms/mobile-settings/save-terms-and-conditions`,p,null,null,null).then(res =>{
           if(res.status_code ===200){
               cv_interact.success('Content has been saved!');
           }else cv_interact.error(res.error_message);
        }); 

    }

    this.prepareFormOptions = (onFinish) =>{
        vsapi.call(`${main_view.base_url}/dms/settings/options-mobile-app `,null,null,null,false).then(res =>{
            if(res.status_code ===200){
                let apps = res.status_code ==200 ? res.data : [];
                const def_app_id = apps[0]? apps[0].app_id: null;
                VSUtil.setComboItems(mThis.elFilter_app,apps,'app_id','app_name',null,null,def_app_id);
                onFinish(apps);
            }
         }); 
    }

    this.displayContent = ()=>{
      let app_id =   mThis.elFilter_app.value;
      vsapi.call(`${main_view.base_url}/dms/mobile-settings/terms-and-conditions`,{"app_id":app_id},null,null,null).then(res =>{
         if(res.status_code ===200){
            // mThis.quillEditor.setContents(res.data);
            //const div = mThis.self[0].querySelector('div.ql-editor');
            this.divEditor = this.divEditor  || this.self[0].querySelector('div.ql-editor');
            mThis.divEditor.innerHTML = res.data;
         }
      }); 
    }

    //Init Text Editor
    this.initHtmlEditor = ()=>{
        if (mThis.quillEditor) return;

        let toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean'],                                         // remove formatting button

            ['link', 'image', 'video']                         // link and image, video
         ];

         mThis.quillEditor = new Quill('#_tc_content', {
            modules: {
            toolbar: toolbarOptions
            },
            theme: 'snow'
         });
    }

    /** load required CSS and js files */
    function prepareResources(onFinish){
       let css_url = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
       let js_url = 'https://cdn.quilljs.com/1.3.6/quill.js';
       
       //Load Script for Html Text Editor using quill.js
       VSRoute.loadStyle(css_url).then(()=>{
            VSRoute.loadScript(js_url).then(()=>{
                onFinish();
            }).catch(e =>{
                //error loading css resource
                 console.error(`Failed to load script for text editor at ${js_url}`);
             });

       }).catch(e =>{
          //error loading css resource
           console.error(`Failed to load css for text editor at ${css_url}`);
       });
    }

    this.show = (options) => {   
        prepareResources(()=>{
            mThis.prepareFormOptions((apps) =>{
                mThis.initHtmlEditor();
                mThis.init(); //init MobileTCComponent once only
                if (!options) options = {};
                main_view.setTitle(mThis.title_prop);
                mThis.elFilter_app.dispatchEvent(new Event('change'));
                mThis.self.siblings().hide();
                mThis.self.fadeIn(200);
            });  
        });
    }


}