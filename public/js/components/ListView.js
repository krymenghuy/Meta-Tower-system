"use strict";
class ListView {
	/**
	options = {
		'api_get':'',
		'per_page':5,
		'renderItems':function(items,list_container),
		'renderComplete':function(res.data){ ... },
		'columns':[{title:'',data:function|object,className:'',width:'250px'}]
		'listContainerClass':'',
		'pagingActiveClass':'active',

		NOTE: that prop "itemEvents" is not yet used
		'itemEvents':[
			'class':'btn-view-profile',
			'event':'click',
			'handler' or 'function'
			'handler':(element,row_container)=>{
				do something with the row_container or element in this row
			}
		]
		'beforeRender':()=>{}
	}

	dependency:
	1. vsapi.js for api call
	2. vs-pagination.css for pagination style
	**/
	constructor(container_id, options = {}) {
		this.container_id = container_id;
		options.perPage = options.perPage ? options.perPage : options.per_page;
		//options.abortController =abortController?abortController:null;
		options.fetchApi = options.fetchApi ? options.fetchApi : options.api_get;
		options.pagingActiveClass = options.pagingActiveClass ? options.pagingActiveClass : 'active';

		this.current_page = this.current_page > 0 ? this.current_page : 1;
		if (typeof options.beforeRender !== 'function') options.beforeRender = () => { return; };
		////if (typeof options.processResponse !== 'function') options.processResponse = () => { return; };
		if (typeof options.renderComplete !== 'function') options.renderComplete = () => { return; };
		if (typeof options.rowCreated !== 'function') options.rowCreated = () => { return; };

		this.card_options = options;
		this.card_options.api_params = this.card_options.api_params ? this.card_options.api_params : this.card_options.apiParams;
		this.container = document.getElementById(container_id);
		if (!this.container) throw `container ID ${container_id} does not exist`;

		this.list_container = document.createElement('div');
		this.list_container.classList.add('listview-container');
		if (this.card_options.listContainerClass) this.list_container.classList.add(this.card_options.listContainerClass);
		this.container.innerHTML = '';
		this.container.appendChild(this.list_container);

		const div_pg = document.createElement('div');
		div_pg.setAttribute('id',`${container_id}_pagination_container`);
		div_pg.classList.add('pagination-container', 'paging_simple_numbers');
		div_pg.innerHTML = `<ul id="${container_id}_paginator" class="pagination"></ul>`;
		//this.container.insertAdjacentHTML('beforeend', `<div id="${container_id}_pagination_container" style="margin-top:5px;" class="pagination-container paging_simple_numbers"><ul id="${container_id}_paginator" class="pagination"></ul></div>`)
		
		if(this.card_options.paginationContainer){
			const x = this.card_options.paginationContainer.querySelector('ul.pagination');
			if(!x) this.card_options.paginationContainer.innerHTML =`<ul id="${container_id}_paginator" class="pagination"></ul>`;
			this.pagination_container = this.card_options.paginationContainer.querySelector('ul.pagination');
		}else{
			div_pg.style.marginTop ="5px";
			this.pagination_container = this.container.appendChild(div_pg.querySelector('ul.pagination'));
		}

		if (this.card_options.columns) {
			this.display = 'table';
			if (!this.card_options.tableClass) this.card_options.tableClass = 'table';
			this.list_container.innerHTML = [`<table class="${this.card_options.tableClass}" id="${this.container_id}_table"><thead></thead><tbody></tbody></table>`].join('');
			this.table = this.list_container.querySelector(`#${this.container_id}_table`);
		}
		else {
			if (typeof this.card_options.renderItems !== 'function')
				this.display = 'table';
			else
				this.display = 'custom';
		}
	}

	// initEventsPerItem(){
	//    const that = this;	
	//    this.card_options.rowEvents.map(e=>{
	// 	  that.list_container.addEventListener();
	//    });
	// }

	getListContainer() {
		return this.list_container;
	}

	getDefaultColumns(items) {
		let first_item = items[0];
		if (!first_item) return [];
		let cols = [];
		for (let prop in first_item) {
			let title = prop.replace(/_/g, " ");
			cols.push({ title: title, data: prop });
		}
		return cols;
	}

	getTable() {
		return this.table;
	}
	
	generateTableHeader(cols = []) {
		let html = '';
		cols.map(c => {
			let col_class = (c.title + '').replace(/\s/g, "-");
			html = [html, `<th class="${col_class}">`, c.title, `</th>`].join('');
		});
		return [`<tr>`, html, `</tr>`].join('');
	}

	/** returns 0 if "There are no data to display", return 1 if there are some data, so that to show pagination buttons */
	renderTable(items =[]) {
		const columns = (!this.card_options.columns || !this.card_options.columns[0]) ? this.getDefaultColumns(items) : this.card_options.columns;
		this.table.querySelector('thead').innerHTML = this.generateTableHeader(columns);
		const tbody = this.table.querySelector('tbody');
		if (tbody) tbody.innerHTML = ``;
		const first_item = (items || [])[0];
		if (!first_item) {
			if (tbody) tbody.innerHTML = `<tr><td colspan="100%"><span class="d-flex align-items-center justify-content-center p-2 w-100">${this.card_options.emptyInfo ? this.card_options.emptyInfo : 'No data to display'}</span></td></tr>`;
			return 0;
		}

		//if(!this.card_options.tableClass) this.card_options.tableClass='table'; 
		//list_container.innerHTML=[`<table class="${this.card_options.tableClass}" id="${this.container_id}_table"><thead><tr>`,this.generateTableHeader(columns),`</tr></thead><tbody></tbody></table>`].join('');
		let row_index = 0, d = null;
		//this.table =list_container.querySelector(`#${this.container_id}_table`);
		do {
			d = items[row_index];
			if (!d) break;
			let html_row = null;
			let tr = document.createElement('tr');
			columns.map(c => {
				let val = null;
				if (typeof c.data === 'function') val = c.data(d, row_index, tr);
				else val = d[c.data];
				let col_class = (c.title + '').replace(/\s/g, "-");
				html_row = [html_row, `<td class="${c.className ? c.className : ''} ${col_class}">`, val, `</td>`].join('');
			});
			tr.innerHTML = html_row;
			tbody.appendChild(tr);
			this.card_options.rowCreated(d, row_index, tr);
			row_index++;
		} while (d);
		return 1;
		////this.createPaginationPanel(data);
	}

	// clickOnClass(target,cssClass){
	// 	if(target.classList.contains(cssClass)) return target;
	// 	if(target.parentNode.classList.contains(cssClass)) return target.parentNode; 
	// }
    
	/** options = {"current_page":null, "columns":[], fetchApi:"", ... }*/
	show(filter = null,options=null, onFinish = null) {
		options = options || {"current_page":1};
		this.showPage(filter, options, onFinish);
	}

	search(filter = null, onFinish = null) {
		this.showPage(filter, null, onFinish);
	}

	setParams(jsonObject) {
		this.card_options.api_params = jsonObject;
	}

	getDefaultData(){
      return {
				"status": "OK",
				"status_code": 200,
				"data": {
					"current_page": 1,
					"data": [],
					"first_page_url": "/?page=1",
					"from": null,
					"last_page": 1,
					"last_page_url": "/?page=1",
					"links": [
						{
							"url": null,
							"label": "&laquo; Previous",
							"active": false
						},
						{
							"url": "/?page=1",
							"label": "1",
							"active": true
						},
						{
							"url": null,
							"label": "Next &raquo;",
							"active": false
						}
					],
					"next_page_url": null,
					"path": "/",
					"per_page": 10,
					"prev_page_url": null,
					"to": null,
					"total": 0
				}
			};
	}

	processResponse(res){
      if(typeof this.card_options.processResponse ==='function')
	  {
		const d = this.card_options.processResponse(res);
		if(!d){
			if(this.card_options.clientSidePagination) return []; else return this.getDefaultData();
		} else return d; 
	  }
      else{
		 return res.data;
		//  if(this.card_options.clientSidePagination) return res.data;
		//  else res.data;
	  }
	}

	/** d_options = {"current_page":1,"columns":"",fetchApi:"", ...}*/
	showPage(filter = null, d_options=null, onFinish) {
		let current_page =null;
		if(d_options){
			for (let key of Object.keys(d_options)){
				this.card_options[key] = d_options[key];
			}
			current_page = d_options.current_page;
		}

		let has_filter = true;
		if (!filter) {
			filter = {};
			has_filter = false;
		}

		if (current_page > 0) this.current_page = current_page;
		else current_page = this.current_page ? this.current_page : 0;

		//current_page=current_page>0?current_page:1;
		const that = this;
		if (!has_filter) {
			filter = this.card_options.api_params ? this.card_options.api_params : {};
		}
		else {
			//NOTE: that.card_options.apiParams is also used if that.card_options.api_params is not provided 
			//Process and add attitional parameters to api's params "p"
			if (that.card_options.api_params) {
				for (let prop in that.card_options.api_params) {
					if (!filter[prop]) filter[prop] = that.card_options.api_params[prop];
				}
			}
		}

		filter.current_page = current_page;
		filter.per_page = this.card_options.perPage;

		//If user changes values of filters then set this.clientPageData to NULL so that the fetchAPI will be called again to refresh the data
		if (!Object.is(this.current_filter,filter)){
			this.clientPageData = null; /** in case of ClientSidePagination => setting this.clientPageData to NULL means to trigger calling api again forfresh data from server */
			filter.current_page =1; /** When user changed fillter or enter new Search_value then start from page 1, no skip_rows  */ 
		    this.current_page = 1; /** "this.current_page" must also be set to 1, for same purpose as above variable, BUT it serve the same puspose in case "options.ClientPagination" is TRUE */
		}
		//Remember current filter including search_value in case that user search for some items
		this.current_filter = filter;
 
		if(this.card_options.clientSidePagination){
			/** Process Client Side Pagination */
            if(this.clientPageData){
				this.card_options.beforeRender(this.clientPageData);
                this.renderPage_clientside(this.clientPageData,this.current_page);				  
			}else{
				const that = this;
				const apiCluster = this.card_options.apiCluster || this.card_options.api_cluster;
				vsapi.call(this.card_options.fetchApi,filter,null,apiCluster).then(res =>{
					//const data = res.status_code == 200 ? res.data : [];
					const rows = that.processResponse(res);
					//Prepare and cache the queried data for later client-side browsing through pages
					that.preparePagingData(rows);
					that.card_options.beforeRender(that.clientPageData);
                    that.renderPage_clientside(that.clientPageData,that.current_page);
				});
			}
			 
		}else{
			/** Process Server Side Pagination */
			const apiCluster = this.card_options.apiCluster || this.card_options.api_cluster;
			vsapi.call(this.card_options.fetchApi, filter, null, this.card_options.vs_loader, apiCluster).then(async (res) => {
				let res_data = [];
				if(res.status_code ===405){
                    res_data = that.getDefaultData();
				}else{
					res_data = that.processResponse(res);
				}
				that.card_options.beforeRender(res_data.data);
				this.renderPage(res_data);
				if(typeof onFinish ==='function') onFinish();
			});
		}
	}

	/** If "this.filter" has changed (i.e: when user change "filter" of when user enters new "search_value" ) then parameter currentPage must be 1 (page 1). Otherwise, the problem when user stands on second or third page, and start searching, there is always no result to display until user clicks on First page button to show the found items */
	async renderPage_clientside(data,currentPage=null){
		//currentPage = currentPage > 0? currentPage : this.current_page; 
		let d = data[currentPage];
		this.pagingInfo.current_page = currentPage || this.current_page;

		if (this.display === 'table') {
			const x = this.renderTable(d, this.list_container);
			this.createPaginationPanel(this.pagingInfo,x);
			////if(this.pagingInfo.last_page <this.pagingInfo.current_page ) this.pagingInfo.last_page = this.pagingInfo.current_page;
			this.card_options.renderComplete(d);
			
			//if (typeof onFinish === 'function') onFinish();
		}else{
           //Render cards or any custom display style
			const that = this;	 
			this.pagination_container.style.display = 'none';
			 new Promise(async (resolve) => {
				// Execute renderItems and wait for it to complete
				await that.card_options.renderItems(d, that.list_container);
				resolve(); // Resolve the Promise when renderItems is done
			});
 
			// Introduce a slight delay (e.g., 100ms) before calling createPaginationPanel
			setTimeout(() => {
				const item_count = d[0]? 1 : 0;
				that.createPaginationPanel(that.pagingInfo,item_count);
				that.pagination_container.style.display = 'flex';
				that.card_options.renderComplete(d);
				//if (typeof onFinish === 'function') onFinish();
			}, 300);
		}
	}

	async renderPage(res_data){
	   // else{
	   // 	//todo: sanitize res_data.data here
	   // }
       const that = this;
	   if (this.display === 'table') {
		   const x = this.renderTable(res_data.data, that.list_container);
		   this.createPaginationPanel(res_data,x);
		   this.card_options.renderComplete(res_data);
		   if (typeof onFinish === 'function') onFinish();
	   }
	   else {
		   this.pagination_container.style.display = 'none';
		   await new Promise(async (resolve) => {
			   // Execute renderItems and wait for it to complete
			   await that.card_options.renderItems(res_data.data, that.list_container);
			   resolve(); // Resolve the Promise when renderItems is done
		   });

		   // Introduce a slight delay (e.g., 100ms) before calling createPaginationPanel
		   setTimeout(() => {
			   let item_count = 0;
			   if(res_data.data) item_count = res_data.data[0]?1:0; 
			   that.createPaginationPanel(res_data,item_count);
			   that.pagination_container.style.display = 'flex';
			   that.card_options.renderComplete(res_data);
			   if (typeof onFinish === 'function') onFinish();
		   }, 300);
	   }
	}

	//returns <li> node element
	//button_type = {'page_button','first','previous','next','last'}
	createPaginationButton(currentPage = null, lastPage = 0, button_type = 'page_button') {
		let li = document.createElement("li");
		let disabled = true;
		//if(currentPage > 0 && currentPage == lastPage) button_type='last';

		if (currentPage < 1) currentPage = 1;
		if (currentPage > lastPage) currentPage = lastPage;

		if (button_type === 'previous')
			disabled = currentPage == 1;
		else if (button_type === 'next')
			disabled = currentPage == lastPage;

		li.setAttribute('disabled', disabled);

		li.classList.add('paginate_button', 'page_item');
		const button = document.createElement('a');
		button.classList.add('vs-btn-page');
		button.style.minWidth = '38px';
		button.style.height = '30.6px';

		if (button_type === 'previous') {
			//button.dataset.page = mThis.current_page -1 <=0? 1:(mThis.current_page -1);
			button.innerHTML = `<i class="la la-angle-left"></i>`;
			button.classList.add('previous-page');
		}
		else if (button_type === 'next') {
			//button.dataset.page = mThis.current_page +1 > lastPage? lastPage:(mThis.current_page +1);
			button.innerHTML = `<i class="la la-angle-right"></i>`;
			button.classList.add('next-page');
		}
		else if (button_type === 'last') {
			button.dataset.page = lastPage;
			button.innerHTML = lastPage;
			button.classList.add('last-page');
		}
		else if (button_type === 'first') {
			button.dataset.page = 1;
			button.innerHTML = 1;
			button.classList.add('first-page');
		}
		else if (button_type === '...') {
			//button.dataset.page = 1;
			button.innerHTML = '...';
			button.classList.add('vs-page-continum');
		}
		else {
			button.dataset.page = currentPage;
			button.innerHTML = currentPage;
		}

		li.appendChild(button);

		const that = this;
		that.current_page = parseInt(that.current_page);
		button.addEventListener("click", e => {
			// Handle "Previous" button click
			e.preventDefault();
			let page_num = null;

			if (button.classList.contains('previous-page')) {
				page_num = that.current_page - 1 < 1 ? 1 : (that.current_page - 1);
			}
			else if (button.classList.contains('next-page')) {
				page_num = that.current_page + 1 > lastPage ? lastPage : (that.current_page + 1);
			}
			else {
				page_num = button.dataset.page;
			}

			//alert(`${(page_num ==1)} page_num = ${page_num}`);
			let btn = this.pagination_container.querySelector('.previous-page');
			if (btn) btn.setAttribute('disabled', page_num == 1);
			btn = this.pagination_container.querySelector('.first-page');
			if (btn) btn.setAttribute('disabled', page_num == 1);

			btn = this.pagination_container.querySelector('.last-page');
			if (btn) btn.setAttribute('disabled', page_num == lastPage);
			btn = this.pagination_container.querySelector('.next-page');
			if (btn) btn.setAttribute('disabled', page_num == lastPage);

			// this.pagination_container.querySelectorAll('.vs-btn-page').forEach(b=>{
			// 	b.classList.remove(this.card_options.pagingActiveClass);
			// });

			// button.classList.add(this.card_options.pagingActiveClass);
			that.current_page = page_num;
			that.showPage(that.current_filter, {"current_page":page_num});
		});
		return li;
	}

	/**
	IMPORTANT: we assume that "data" has this props => 
	{
	 "current_page","last_page"	
	} 
	**/
	// createPaginationPanel(data) {
	// 	const currentPage = data.current_page;
	// 	const lastPage = data.last_page;

	// 	//NOTE: "this.pagination_container" references to List element "<ul>"
	// 	this.pagination_container.innerHTML = ``;
	// 	if (!data.data) data.data = [];
	// 	if (!data.data[0]) return;
	// 	// Create "Previous" button
	// 	//this.pagination_container.style.display='none';
	// 	this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'first'));

	// 	// Create numbered page buttons
	// 	let i = 1;
	// 	do {
	// 		if (i == lastPage - 3 && lastPage > 6)
	// 			this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'next'));
	// 		else if (i == 4 && lastPage > 6)
	// 			this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'previous'));
	// 		else if (i == 5 && lastPage == 7)
	// 			this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'previous'));
	// 		if (i < 4 || (i > lastPage - 3)) {
	// 			if (i > 1 && i != lastPage) this.pagination_container.appendChild(this.createPaginationButton(i, lastPage, 'page_button'));
	// 		}
	// 		else {
	// 			const cur_page_span = this.pagination_container.querySelector('.current-page');
	// 			if (!cur_page_span) this.pagination_container.insertAdjacentHTML('beforeend', `<span style="display:flex;justify-content:center;align-items:center;font-weight:bold;min-width:35px;margin-left:3px;margin-right:3px;padding:3px;border:1.5px solid green;border-radius:25px;" class="current-page">${data.current_page}</span>`);
	// 		}
	// 		i++;
	// 	} while (i <= lastPage);

	// 	if (lastPage > 1) this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'last'));
	// 	if (data.per_page > data.total) data.per_page = data.total;
	// 	this.pagination_container.insertAdjacentHTML('beforeend', `<span style="display:flex;justify-content:center;align-items:center;color:#000;padding:3px;font-weight:bold;">${data.per_page} of ${data.total}</span>`);
	// 	this.hilightLightButton(currentPage);
	// 	//this.pagination_container.style.display='flex';
	// }

	preparePagingData(items =[]){
		let per_page = this.card_options.perPage;
		let item_count =0;
		let page_count =0;
		let total = 0;
		this.clientPageData = {};
		let per_page_items = [];
        let c = null, i =0;
		do{
			c = items[i];
			if(!c) break;
            per_page_items.push(c);
			item_count++;
			
			if(item_count >= per_page || !items[i+1]){
				page_count++;
				total +=item_count;
				this.clientPageData[page_count] = per_page_items; 
				per_page_items = [];
				item_count =0;
			}
			i++;
		}while(c);
		//last_page_item_count = (i+1) % page_count;
		this.pagingInfo = {
			"current_page":this.current_page,
			"last_page":page_count,
			//"last_page_item_count":item_count < per_page? item_count:per_page,
			"total":total,
			"per_page":per_page
		};
		//this.clientPageData = data;
	}

	/** data= {"current_page","per_page","total","last_page","last_page_item_count"}. "data" is like pagingInfo */
	createPaginationPanel(data,item_count = null) {
		const currentPage = data.current_page > 0? data.current_page: 0;
		const lastPage = data.last_page;
		//NOTE: "this.pagination_container" references to List element "<ul>"
		this.pagination_container.innerHTML = ``;
		if(item_count==0) return;
		// if (!data.data) data.data = [];
		// if (!data.data[0]) return;

		// Create "Previous" button
		//this.pagination_container.style.display='none';
		this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'previous'));

		// Create numbered page buttons
		let i = 1;
		let cnt = lastPage >= 5? 5:lastPage;
		do {
			this.pagination_container.appendChild(this.createPaginationButton(i, lastPage, 'page_button')); 
			i++;
		} while (i <= cnt);

		if(lastPage > cnt){
			if(lastPage > currentPage && currentPage > cnt)
			  this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'page_button'));
			else this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, '...'));
		}
        
		if(lastPage > 5) this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'last')); 
		this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'next'));
        
		let perPage = data.per_page;
		if (perPage > data.total) 
		    perPage = data.total;
		else if(currentPage == lastPage) {

			const last_page_item_count = data.total % data.per_page;
			if(last_page_item_count > 0 && last_page_item_count < data.per_page) perPage = last_page_item_count;  
		}
		this.pagination_container.insertAdjacentHTML('beforeend', `<span style="display:flex;justify-content:center;align-items:center;color:#000;padding:3px;font-weight:600; margin-left:5px;">${perPage} of ${data.total}</span>`);
		this.hilightLightButton(currentPage);
		//this.pagination_container.style.display='flex';
	}
 
	hilightLightButton(currentPage = null) {
		let found = false;
		const currentPageButton = this.pagination_container.querySelector('.current-page');
		this.pagination_container.querySelectorAll('.vs-btn-page').forEach(b => {
			if (b.dataset.page == currentPage) {
				b.classList.add(this.card_options.pagingActiveClass);
				found = true;
				if (currentPageButton) currentPageButton.classList.remove(this.card_options.pagingActiveClass);
			}
			if (!found) if (currentPageButton) currentPageButton.classList.add(this.card_options.pagingActiveClass);
		});
	}
}