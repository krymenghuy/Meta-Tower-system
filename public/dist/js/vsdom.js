"use strict";let VSDOM=new function(){this.insertAfter=(newNode,existingNode)=>{existingNode.parentNode.insertBefore(newNode,existingNode.nextElementSibling);}
this.getClosestParentByType=(el,elementType='',try_count=null)=>{if(!try_count||try_count<=0)try_count=100;if(!el)return null;if(el.nodeName===elementType)return el;let p=el.parentNode;if(p){if(p.nodeName===elementType)
return p;else{let i=0;for(i=0;i<try_count;i++){p=p.parentNode;if(p){if(p.nodeName===elementType)return p;}else return null;}
return null;}}else return null;}
this.getClosestParentByClass=(el,className='',try_count=null)=>{if(!try_count||try_count<=0)try_count=100;if(!el||el.nodeType===Node.TEXT_NODE)return null;if(el.classList.contains(className))return el;let p=el.parentNode;if(p){if(p.classList.contains(className))
return p;else{let i=0;for(i=0;i<try_count;i++){p=p.parentNode;if(p&&p.nodeType!==Node.TEXT_NODE){if(p.classList)if(p.classList.contains(className))return p;}else return null;}
return null;}}else return null;}}