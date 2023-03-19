'use strict'
let StringSanitizer=new function(){let mThis=this;this.reverse_char_codes=[{"'&U01;'":'-'},{'&U02;':'$'},{'&U03;':'('},{'&U04;':')'},{'&U05;':'@'},{'&U06;':'/'},{'&U07;':'%'},{'&U08;':'!'},{'&U09;':':'},{'&U10;':'\''},{'&U11;':'#'},{'&U12;':';'},{'&U13;':'\\'},{'&U14;':'='},{'&U16;':'.'},{'&U17;':','},{'&U18;':'?'},{'&U19;':'['},{'&U20;':']'},{'&U21;':'+'},{'&U23;':'&'},{'&U24;':';'}];this.sanitizeOut=(text,itemName,allowedChars)=>{if(!text)return text;if($.isNumeric(text))return text;let num=(text+'').replace(',','');if($.isNumeric(num))return num;text=[text,''].join('');let len=text.length;let mayBeDate=false;if(len>=10&&len<=11)mayBeDate=true;if(mayBeDate===true){if(DateHelper.isDate(text))return text;}
let c=undefined,i=0;let encodes=[];if(itemName){allowedChars=[];if(itemName==='currency'||itemName==='currency_symbol'){return text.slice(0,4);}
else if(itemName==='email'){if(this.isEmail(text))return text.slice(0,150);}}else{if(Array.isArray(allowedChars)){i=0;do{c=allowedChars[i];if(!c)break;encodes.push(this.getEncodedChar(c));i++;}while(c);}else{allowedChars=['-','(',')','#',':','@','/',';','=','.',','];encodes=['&U01;','&U03;','&U04;','&U11;','&U09;','&U05;','&U06;','&U12;','&U14;','&U16;','&U17;'];}}
let badChars=['?','[',']','+','.',',','-','(',')','@','/','#',':',"~","^","&","&amp;","!","$","*",";","%","=","\"","'","\\","<",">","&quot;","&lt;","&gt;","&#x27;","&#x2F;","&#60;","&#62;","&#34;",".fromCharCode","{","}","[","]","?"];let st=text.split('');i=0;c=null;do{c=st[i];if(!c)break;if(c==='|'&&itemName==='nodeTag'){if(st[i+1]==='|')
i=i+1;else
st[i]='';}
else if(c==='|'&&itemName!='nodeTag'){if(itemName==='answerSet')
i=i+1;else
st[i]='';}
else if(c==='#'&&itemName==='nodeTag'){if(st[i+1]=='#')
i=i+1;else
st[i]='';}
else if(c==='#'&&itemName!='nodeTag'){i=i+1;}
else if(c==='+'&&i>0&&itemName==='grade'){st[i]}
else if(c==='&'){if(st[i+1]==='U'&&st[i+4]===';'){let e=[st[i],st[i+1],st[i+2],st[i+3],st[i+4]].join('');st[i]='';st[i+1]='';st[i+2]='';st[i+3]='';let index=encodes.indexOf(e);if(index>=0){st[i+4]=allowedChars[index];badChars.splice(badChars.indexOf(st[i+4]),1);}else
st[i+4]='';i=i+4;}else st[i]='';}
else if(c===';'){if(encodes.indexOf(';')<0)st[i]='';}
else if(c==='-'){if(st[i-4]){let a=String(st[i-4]).toLowerCase();let b;if(a==='p'||a==='f'){a=[st[i-4],st[i-3],st[i-2],st[i-1]].join('');b=[st[i+1],st[i+2],st[i+3],st[i+4]].join('');if(a&&b){a=a.toLowerCase();if((a==='part'||a==='full')&&b.toLowerCase()==='time'){i=i+4;}}}}}
else if(badChars.indexOf(c)>=0){st[i]='';}
i++;}while(c);return st.join('');};this.isEmail=function(email){let re=/\S+@\S+\.\S+/;return re.test(email);};this.sanitizeIn=function(text,allowedChars){if($.isNumeric(text)||!text){return text;}else if(DateHelper.isDate(text)){return text;}
else{text=[text,''].join('');let c=undefined,i=0;let badChars=["?","[","]","+",".",",","~","^","(",")","@","&","&amp;","!","$","#","*",";","/","-","%","=","\"","'","\\",":","<",">","&quot;","&lt;","&gt;","&#x27;","&#x2F;","&#60;","&#62;","&#34;",".fromCharCode","{","}","[","]","?"];if(allowedChars)
do{c=allowedChars[i];if(!c)break;badChars.splice(badChars.indexOf(c),1);i++;}while(c!=undefined);c=undefined;i=0;do{c=badChars[i];if(!c)break;text=text.split(c).join('');i++;}while(c!=undefined);return text;}};this.item_names={"email":"email","currency":"currency","currency_symbol":"currency","cur_symbol":"currency","usd":"currency","rield":"currency","KHR":"currency","khr":"currency","notes":"remarks","description":"remarks"}
this.getItemName=(property)=>{let prop=(property+'').toLowerCase();let val=mThis.item_names[prop];return val?val:null;}
this.sanitizeObject=function(obj,allowedChars,except_props=[]){if(Array.isArray(obj)){let i=0,myObj;do{myObj=obj[i];if(!myObj)break;for(let property in myObj){if(myObj.hasOwnProperty(property))
if(except_props.indexOf(property)===-1){if(Array.isArray(myObj[property]))
myObj[property]=this.sanitizeObject(myObj[property]);else myObj[property]=this.sanitizeOut(myObj[property],this.getItemName(property),allowedChars);}}
i++;}while(myObj);}
else{for(let property in obj){if(obj.hasOwnProperty(property)){if(except_props.indexOf(property)===-1){if(Array.isArray(obj[property])){obj[property]=this.sanitizeObject(obj[property]);}else obj[property]=this.sanitizeOut(obj[property],this.getItemName(property),allowedChars);}}}}
return obj;};this.getDecodeChar=(e)=>{return mThis.reverse_char_codes[e]?mThis.reverse_char_codes[e]:'';};this.getEncodedChar=function(ch){var chars=['\'','"',']','[','?','+',',','.','-','(',')','#',':','/','=','\\','@','%','!','$'];var encodes=['&U10;','&U22;','&U20','&U19;','&U18;','&U21;','&U17;','&U16;','&U01;','&U03;','&U04;','&U11;','&U09;','&U06;','&U14;','&U13;','&U05;','&U07;','&U08;','&U02;'];return encodes[chars.indexOf(ch)];};this.encodeSpecialChars=function(text,chars){var i=0,c;text=[text,''].join('');if(!chars)return text;do{c=chars[i];if(!c)break;text.split(c).join(this.getEncodedChar(c));i++;}while(c);return text;};};