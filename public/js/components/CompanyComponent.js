'use strict';
var CompanyComponent = new function(){
    let mThis = this;
	this.title_prop = "Company Profile";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_companyComponent');
    this.btnSave = this.self.find('#_main_comp_btnSaveProfile');

	this.imgLogo = this.self.find('#com_imgLogo');
	this.btnChooseLogo = this.self.find('#com_btnChooseLogo');
	this.btnDeleteLogo = this.self.find('#com_btnDeleteLogo');
	this.fields =[];

	this.btnSave.on('click',function(e){
		let p = mThis.getData();	 
		
		vsapi.call(`${mThis.base_url}/api/company/save-details`,p).then(res=>{
			if(res.status_code===200){
				cv_interact.success('Company information updated!','','info');
			}else cv_interact.error(res.error_message);
		});
	});

	this.displayCompanyInfo = ()=>{
		vsapi.call(`${mThis.base_url}/api/company/details`,null,null,false).then(res=>{
			
			if(res.status_code===200){
					let d= StringSanitizer.sanitizeObject(res.data,null,['email','logo_url']);
					mThis.setData(d);
			}
		});
	}
 
	//begin:: CompanyComponent.init()
    this.init = ()=>{
            
		  mThis.self.find('.data-input').each(function(){
             mThis.fields.push({"element":$(this), "dataMember":$(this).data('field') });
		  });
		 this.btnDeleteLogo.off('click').on('click',e=>{
			   e.preventDefault();
			   cv_interact.confirm('Delete this logo?',{title:'Delete Logo',context: 'delete'},e=> {
				    if(e)
					{
					      vsapi.call(`${mThis.base_url}/api/company/delete-logo`,null).then((res)=> {				 
							 if (res.status_code === 200)
							 {
								 mThis.imgLogo.prop('src','');
								 cv_interact.success('Logo deleted!');
							 }
							 else cv_interact.error(res.error_message);
						}); 
					}
			   });
		   });
		   
		   this.btnChooseLogo.off('click').on('click',function(e) {
			   e.preventDefault();
			   FileChooser.chooseFile(null,d=>{
					if(d){
						mThis.imgLogo.prop('src',d.dataUrl);
						let p = {'photo_data':d.dataUrl,'file_type':d.file_type};
						vsapi.call(`${main_view.base_url}/api/company/save-logo`,p,null,false).then(res=>{
							if(res.status_code ===200){
								let d = res.data;
								mThis.imgLogo.prop('src',d.logo_url);
								cv_interact.success('Logo has been saved');
							}else cv_interact.warning(res.error_message);
						});
					}
			   }); 
		   });
    }
    //end:: CompanyComponent.init()

    this.show = (option)=>{
	  main_view.setTitle(mThis.title_prop);	
	  mThis.displayCompanyInfo();	
      mThis.self.siblings(":visible").fadeOut("fast", function() {
		mThis.self.hide().fadeIn(200);
	  });
    }

    this.hide = ()=>{
        mThis.self.hide();
    }

    this.setData= function(com) 
	  {   
		 let i=0, c;
         do{
			 c = mThis.fields[i];
			 if (!c) break;
			  if(c.element.is('img')) c.element.prop('src',com.logo_url);
			  else if (c.element.is('select')) c.element.val(com[c.dataMember]).trigger('change');
			  else c.element.val(com[c.dataMember]);  
			 i++;
		 }while(c);	
        
	  };
 
	  //NOTE: getData() does NOT include logo data with its returned object.
      this.getData= function() 
	  {
		 let i=0, c;
		 let d = {};
         do{
			 c = mThis.fields[i];
			 if (!c) break;
			 d[c.dataMember] = c.element.val();   
			 i++;
		 }while(c);
		 
         return d;		 
	  };
}
window.addEventListener('DOMContentLoaded',(e)=>{
    CompanyComponent.init();
});