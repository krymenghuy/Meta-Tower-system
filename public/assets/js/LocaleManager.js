    //##### begin:: Translater | Translator| Locale|
        let LocaleManager = new function(){
            let mThis = this;
            this.base_url = window.location.origin; //$('#__base_url').val();
            this.app_content_id = '_app_content';
            this.lang = "en"; //default langauge code
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
                    icon_image:'english.png',
                    is_loading:false,
                    start_time:null
                    //icon_url is not used due to problem with relative Assets directory in Development and Production
                    //,icon_url:`${mThis.asset_url}/images/icons/english.png`  
                },
                'km':{
                    name:'ខ្មែរ',
                    icon_image:'khmer.png',
                    is_loading:false,
                    start_time:null
                    //icon_url is not used due to problem with relative Assets directory in Development and Production
                    //,icon_url:`${mThis.asset_url}/images/icons/khmer.png`
                }
            }
 
        this.checkIsNotLoading = (lang,callback,max_wait_mili_seconds=3000) =>{
                if (!lang) lang ="en";
                if(!max_wait_mili_seconds) max_wait_mili_seconds=3000;
                if (!mThis.langs[lang].is_loading) {
                  // Do something when is_loading is false
                  //console.log('OK: lang loaded');
                  callback();
                } else //if (Date.now() - mThis.loadingInfo.startTime < max_wait_mili_seconds) 
                {
                    //Check again in 100 milliseconds. The maximum waiting time is 3000 miliseconds or 3 seconds
                    setTimeout(()=>{
                        mThis.checkIsNotLoading(lang,callback,max_wait_mili_seconds);
                    }, 100); 
                    //console.log('waiting 100 ms');
                } 
                // else {
                //   // Handle the case when the maximum time limit is reached
                //   console.log('max wait time reached');
                //    callback();
                // }
        }
         
          //load langauge from json file from server through api
          this.loadLang = (lang, onFinish=null)=>{
            //if lang is not specified => use default language set within class "LocaleManager"    
            //lang =lang?lang:mThis.lang; 
            if(!lang) lang="en";
     
            // if (mThis.lang_data_last_loading_time) {
            //         let time_diff_ms = (new Date()) - mThis.lang_data_last_loading_time;
            //         if (time_diff_ms <3000 && mThis.lang === lang){
            //             //This function can be called again within 3 seconds
            //             return null; 
            //         }
            // }

            mThis.lang_data_last_loading_time = new Date();
            let langContent = mThis.langContents[lang]; 
            if(langContent){
               if(typeof onFinish==='function') onFinish(langContent);
               return;
            }

            if (!mThis.base_url) mThis.base_url = $('meta[name="base_url"]').attr('content');     
            const params = new URLSearchParams();
            params.append('lang', lang);
            
            mThis.langs[lang].is_loading =true;
            mThis.langs[lang].start_time = Date.now();
            
            //console.log('Fresh loaded lang content =' +lang );
            //console.log(JSON.stringify(langContent));
            fetch([mThis.base_url,'/api/settings/lang?',params].join(''))
            .then(response =>response.json())
            .then(res =>{
                //res.data | res.status_code ===200?
                if(res instanceof Error || res.status ==='Error'){
                     console.error(JSON.stringify(res));
                     return;
                }
                if(!res.data) alert('Language data not found! This is usually caused by missing language files');
                            let b = {};
                            console.log('fresh load lang =>' + lang);
                            try{
                              b = JSON.parse(res.data);
                            }catch(e){
                                console.error(`Error in converting langContent to JSON object\r\n ${res.data}`);
                                return;
                            }
                            mThis.langContent = b;
                            mThis.lang = b?b.code:lang;
                            mThis.langContents[lang] = b;

                            //The following line is to set LocaleManager.currentlanguage, that is, if no language content found => then it is defaulted to "en","Egnlish"
                            mThis.currentLanguage = {'code':b?b.code:'en','name':b?b.name:'English'};  
                            
                            mThis.langs[lang].is_loading =false;
                            //mThis.langs[lang].start_time =null;
                            if (typeof onFinish==='function') onFinish(mThis.langContent);
            })
            .catch(error =>{
                mThis.langs[lang].is_loading = false; 
                console.error(['Error at LocaleManager.loadLang(). System reported error: ',error].join(''));
            });
      }

      //Execute loadLang() function on Page load on default langauge   
      this.loadLang(mThis.currentLanguage.code);

            this.translateZone = (div_id = null,options={"lang":null,"hide":false,"loaderClass":""},onFinish = null)=>{
                translateZone_internal(div_id,options,onFinish);
                // if(!options) options = {"lang":mThis.currentLanguage.code,"hide":false,"loaderClass":""};
                // //if langauge content is being loaded => then wait 3 milisecond
                // mThis.checkIsNotLoading(options.lang?options.lang:mThis.currentLanguage.code,()=>{ 
                   
                // },null);

            }
            
            /** options = {'lang':"kh",'hide':true,"loaderClass":"loading"} 
             * **/
            function translateZone_internal (div_id = null,options={"lang":null,"hide":false},onFinish = null){
                if(!options) options = {"lang":mThis.currentLanguage.code,"hide":false,"loaderClass":"loading"};
                let lang = options.lang;
                let div = null;
                let loader = null;
                if (Object.prototype.toString.call(div_id) === '[object String]'){
                  div = $(`#${div_id}`);
                }else div = div_id;
  
                if(options.hide){
                    div.hide();
                    if(options.loaderClass){
                        loader = div.find(`.${options.loaderClass}`);
                        loader.show();
                    }
                }
                    if(!mThis.langContents[lang]) {
                            //alert('need loading');
                            mThis.loadLang(lang, content=>{
                                mThis.langContent = content;
                                div.find('.trans-text').each(function(){
                                    let el = $(this);
                                    let f = el.data('langprop');
                                  
                                    let parts = (f+'').split('.');
                                    let section = parts[0];
                                    let field = parts[1];
                                    let sectionContent = content[section];
                                    //console.error('LOADED ' + JSON.stringify(sectionContent));
                                    if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                                    let text = sectionContent?sectionContent[field]:`${section} unknown text`;
                                    //console.error(`${section}.${field} | ${text}`);
                                    el.text(text?text:field);
                                });
                                  if(options.hide) div.show();
                                  if(loader) loader.hide();
                                  if(typeof onFinish==='function') onFinish();
                                //  //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                //  mThis.languageChangeHandlers.map((f)=>{
                                //      f(lang);
                                //  });
                            });

                        }else {

                            let b = mThis.langContents[lang];
                            div.find('.trans-text').each(function(){
                                let el = $(this);
                                let f = el.data('langprop');
                                let parts = (f+'').split('.');
                                let section = parts[0];
                                let field = parts[1];
                               
                                let sectionContent = b?b[section]:null;
                                if (field === '{text}') field = (el.text() || 'undefined').toLowerCase(); // or .val()???
                                let text = sectionContent?sectionContent[field]:`${section} unknown text`; 
                                el.text(text?text:field);
                            });
                            if(options.hide) div.show();
                            if(loader) loader.hide();
                            
                            if(typeof onFinish==='function') onFinish(); 
                                // //Call to callbacks's handlers() for langaugeChange events to refresh other dynamic element's lang such as dataTable language
                                // mThis.languageChangeHandlers.map((f)=>{
                                //     f(lang);
                                // });                          

                        }
 
                }

                this.translateAll = (lang="en")=>{
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
            
            this.trans = (prop,section= 'general',lang=null)=>{
                if(!section) section ='general';
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
    
                        vsapi.call(`${mThis.base_url}/api/settings/lang-all`,p,null).then((res)=>{
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
 
            //Save language's choice setting for the current user
            //onFinish = onSuccess()
            this.saveLang = (lang,onFinish=null)=>{
                    let p = {'lang':lang};
                    if (!mThis.base_url) document.querySelector('meta[name="base_url"]').getAttribute('content');

                    vsapi.call(`${mThis.base_url}/api/settings/save-lang`,p,null,false).then((res)=>{
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