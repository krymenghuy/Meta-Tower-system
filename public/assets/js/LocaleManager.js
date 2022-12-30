    //##### begin:: Translater | Translator| Locale|
        let LocaleManager = new function(){
            let mThis = this;
            this.base_url = window.location.origin; //$('#__base_url').val();
            this.app_content_id = '_app_content';
            this.lang = 'en'; //default langauge code
            this.currentLanguage = {name:'English',code:'en'};
            this.langContent = null;
            this.langContents ={};

            //this.onLanguageChange = null;
            this.languageChangeHandlers = [];

            if (!this.base_url) this.base_url = document.querySelector('meta[name="base_url"]').getAttribute('content');
            if (!this.asset_url) this.asset_url = document.querySelector('meta[name="asset_url"]').getAttribute('content');

            this.langs ={
                'en':{
                    name:'English',
                    icon_image:'english.png'
                    //icon_url is not used due to problem with relative Assets directory in Development and Production
                    //,icon_url:`${mThis.asset_url}/images/icons/english.png`  
                },
                'km':{
                    name:'ខ្មែរ',
                    icon_image:'khmer.png'
                    //icon_url is not used due to problem with relative Assets directory in Development and Production
                    //,icon_url:`${mThis.asset_url}/images/icons/khmer.png`
                }
            } 

            this.translateZone = (div_id = null,lang=null)=>{
                if (!lang) lang = mThis.lang;

                    if(!mThis.langContents[lang]) {
                            mThis.loadLang(lang,(content)=>{
                                //mThis.langContent = content;
                                mThis.langContents[lang] = content;

                                ($(`#${div_id}`).find('.trans-text') || []).each(function(){
                                    let el = $(this);
                                    let f = el.data('langprop');
                                    let parts = (f+'').split('.');
                                    let section = parts[0];
                                    let field = parts[1];
                                    let sectionContent = content[section];
                                    if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                                    let text = sectionContent?sectionContent[field]:`${section} undefined`;
                                    el.text(text?text:field);
                                });
 
                                //  //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                //  mThis.languageChangeHandlers.map((f)=>{
                                //      f(lang);
                                //  });
                            });

                        }else {

                            let b = mThis.langContents[lang];
                            ($(`#${div_id}`).find('.trans-text') || []).each(function(){
                                let el = $(this);
                                let f = el.data('langprop');
                                let parts = (f+'').split('.');
                                let section = parts[0];
                                let field = parts[1];
                               
                                let sectionContent = b?b[section]:null;
                                if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                                let text = sectionContent?sectionContent[field]:`${section} undefined`; 
                                el.text(text?text:field);
                            });

                                // //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                // mThis.languageChangeHandlers.map((f)=>{
                                //     f(lang);
                                // });                          

                        }
 
                }

                this.translateAll = (lang)=>{
                  //Use default language
                 
                  if (!lang) lang = mThis.lang;
                  if (!mThis.langContents[lang]){
                            mThis.loadLang(lang,(content)=>{
                               
                                //mThis.langContent = content;
                                mThis.langContents[lang] = content;
                                ($(document).find('.trans-text') || []).each(function(){
                                    let el = $(this);
                                    let f = el.data('langprop');
                                    let parts = (f+'').split('.');
                                    let section = parts[0];
                                    let field = parts[1];
                                    let SectionContent = content[section];
                                    if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                                    let text = SectionContent?SectionContent[field]:`${section} undefined`;
                                    el.text(text?text:field);
                                });

                                // //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                // mThis.languageChangeHandlers.every((f)=>{
                                //    f(lang);
                                // });
                            
                            });
                 }else{
                    //display language based on local storage mThis.langContent
                     
                    let b = mThis.langContents[lang];
                     //let div = $(`#${mThis.app_content_id}`);
                     ($(document).find('.trans-text') || []).each(function(){
                        let el = $(this);
                        let f = el.data('langprop');
                        let parts = (f+'').split('.');
                        let section = parts[0];
                        let field = parts[1];                       
                        let sectionContent = b?b[section]:null;
                        if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                        let text = sectionContent?sectionContent[field]:`${section} undefined`;
                        el.text(text?text:field);
                    });

                    //  //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                    //  mThis.languageChangeHandlers.every((f)=>{
                    //     f(lang);
                    //  });

                 }
            }

            this.setLanguageChangeHandler = (handler)=>{
                // mThis.cnt=mThis.cnt?mThis.cnt:0;
                // mThis.cnt++;
                // alert(mThis.cnt);
                if(typeof handler ==='function') mThis.languageChangeHandlers.push(handler);
            }

            //translate array of objects, by specifiying which field or prop to be translated
            this.trans_object_array = (obj_array,target_fields = [],langSection='js')=>{
                if (!obj_array) obj_array = [];

                obj_array.map((obj)=>{
                        for (let prop in obj) {
                            if (target_fields.indexOf(prop) >=0){
                                obj[prop] = mThis.trans(obj[prop],langSection);
                            }
                        }
                });
                return obj_array; 
            }
            
            //this.translate(). by default section ="js", which means that trans() will ONLY looks for "langprop" under the parent property "js" in locale file such as en.json
            this.trans = (prop,section= null,lang=null)=>{
                if(!section) section ='js';
                //let parts = (prop+'').split('.');
                //let section = parts[0];
                //let field = parts[1];
                //console.log(section+' | ' + field + '\r\n');
                if(!lang) lang = mThis.lang;
                let langContent = mThis.langContents[lang];
                if(!langContent) return null;
                let sectionContent = langContent[section];
                let text = sectionContent?sectionContent[prop]:prop; //if the langSection is not defined in en.json or km.json => display the original text or prop
                //let text = b?b[prop]:`${section} undefined`; //if the langSection is not defined in en.json or km.json => display "section undefined" to inform programmer to correct transaction data
                return text?text:prop;
            }

            //load contents of all avaialbile langauges specified in array mThis.langs
            this.loadAllLangs = (onFinish=null)=>{
                        //if lang is not specified => use default language set within class "LocaleManager"    
                        //lang =lang?lang:mThis.lang; 
                        let p = {'langs':['en','km']};
    
                        if (mThis.lang_data_last_loading_time) {
                        let time_diff_ms = (new Date()) - mThis.lang_data_last_loading_time;
                        if (time_diff_ms <3000 && mThis.lang === lang){
                            //This function can be called more than once to load the same language code within 3 seconds
                            return null; 
                        }
                        }
                        mThis.lang_data_last_loading_time = new Date();
    
                        if (!mThis.base_url) mThis.base_url = $('meta[name="base_url"]').attr('content');
    
                        window.vsapi.call(`${mThis.base_url}/api/settings/lang-all`,p,'POST').then((res)=>{
                                if (res.status_code === 200){
                                        let bs = [];
                                        try{
                                        bs = JSON.parse(res.data);
                                        }catch(e){
                                            console.error(`Error in converting langContent to JSON object\r\n ${res.data}`);
                                            return;
                                        }

                                        bs.every((b)=>{
                                            mThis.langContents[b.code] =b;
                                        });

                                        //mThis.lang = b?b.code:'en';
                                        mThis.langContent = mThis.langContents[mThis.lang];
                                        //The following line is to set LocaleManager.currentlanguage, that is, if no language content found => then it is defaulted to "en","Egnlish"
                                        //mThis.currentLanguage = {'code':b?b.code:'en','name':b?b.name:'English'};  
                                        if(typeof onFinish === 'function') onFinish(mThis.langContents);
                                }
                        });
                }

            //load langauge from json file from server through api
            this.loadLang = (lang, onFinish=null)=>{
                    //if lang is not specified => use default language set within class "LocaleManager"    
                    //lang =lang?lang:mThis.lang; 
                    let p = {'lang':lang};

                    if (mThis.lang_data_last_loading_time) {
                            let time_diff_ms = (new Date()) - mThis.lang_data_last_loading_time;
                            if (time_diff_ms <3000 && mThis.lang === lang){
                                //This function can be called again within 3 seconds
                                return null; 
                            }
                    }
                    mThis.lang_data_last_loading_time = new Date();
                    if (!mThis.base_url) mThis.base_url = $('meta[name="base_url"]').attr('content');              
                    window.vsapi.call(`${mThis.base_url}/api/settings/lang`,p,'POST').then((res)=>{
                            if (res.status_code === 200){
                                    let b = {};
                                    try{
                                      b = JSON.parse(res.data);
                                    }catch(e){
                                        console.error(`Error in converting langContent to JSON object\r\n ${res.data}`);
                                        return;
                                    }
                                    mThis.langContent = b;
                                    mThis.lang = b?b.code:'en';
                                    mThis.langContents[mThis.lang] = b;
 
                                    //The following line is to set LocaleManager.currentlanguage, that is, if no language content found => then it is defaulted to "en","Egnlish"
                                    mThis.currentLanguage = {'code':b?b.code:'en','name':b?b.name:'English'};  
                                    //if(typeof onFinish === 'function')
                                    if (typeof onFinish==='function') onFinish(mThis.langContent);
                            }else console.error('Error at LocaleManager.loadLang() => ' + res.error_message);
                    });
            }

            //Save language's choice setting for the current user
            //onFinish = onSuccess()
            this.saveLang = (lang,onFinish=null)=>{
                    let p = {'lang':lang};
                    if (!mThis.base_url) document.querySelector('meta[name="base_url"]').getAttribute('content');

                    window.vsapi.call(`${mThis.base_url}/api/settings/save-lang`,p,'POST').then((res)=>{
                    if (res.status_code === 200){
                    //    if (mThis.lang != lang)
                    //    {
                       
                                let b = null;
                                    try{
                                        b = JSON.parse(res.data.lang_content);
                                    }catch(e){
                                        return; //todo catch if any error here
                                    }

                                    if (b){
                                        //mThis.langContent = b;
                                        mThis.langContents[lang] = b;
                                        //example=> b.code is "en", and b.name ="English"
                                        mThis.currentLanguage = {code:b.code,name:b.name};
                                        
                                        // if (mThis.lang != lang) {
                                        //     mThis.lang = lang; //This is line must be above the mThis.onLanguageChange() called, so that the onChange event fires abd behave properly
                                        //     //if (typeof mThis.onLanguageChange ==='function'){
                                        //         //mThis.onLanguageChange(lang);
                                        //         mThis.languageChangeHandlers.map((f)=>{
                                        //             //if(typeof f ==='function')
                                        //                 f(lang);
                                        //         });
                                        //     //}
                                        // }
                                        
                                        //// Only save language setting, Do not translate on screen
                                        //mThis.translateAll(lang);

                                        /** set htm's language correctly to new @lang <htm lang ="$lang"> **/
                                        ////document.getElementsByTagName('html')[0].getAttribute('xml:lang');
                                        document.getElementsByTagName("html")[0].setAttribute('lang',lang);
 
                                         
                                            //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                            mThis.languageChangeHandlers.map((f)=>{
                                               f(lang);
                                           });
                                           mThis.lang = lang; 
                                        
                                        if(typeof onFinish ==='function') onFinish(b);
                                        
                                    }else console.error('Problem when trying to convert langContent to JSON object as follows: \r\n' + res.lang_content);
                                    
                                
                            // mThis.loadLang(lang,()=>{
                            //     //ususally mThis.app_content_id ='_app_content'
                                
                                
                            // });
                            
                    //    }
 
                    }else console.error(res.error_message);
                    });
            }
        }
        //###### end:: Translater