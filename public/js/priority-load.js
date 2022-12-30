
let doc_lang =document.documentElement.lang;
LocaleManager.lang = doc_lang;
LocaleManager.currentLanguage.code = doc_lang;
LocaleManager.loadLang(doc_lang);