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

		 //NOTE: that prop "itemEvents" is not yet used
		 //'itemEvents':[
			//'class':'btn-view-profile',
			// 'event':'click',
			// //'handler' or 'function'
			// 'handler':(element,row_container)=>{
			// 	//do something with the row_container or element in this row
			// }
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
		options.fetchApi = options.fetchApi ? options.fetchApi : options.api_get;
		options.pagingActiveClass = options.pagingActiveClass ? options.pagingActiveClass : 'active';

		this.current_page = this.current_page > 0 ? this.current_page : 1;
		if (typeof options.beforeRender !== 'function') options.beforeRender = () => { return; };
		if (typeof options.renderComplete !== 'function') options.renderComplete = () => { return; };
		if (typeof options.rowCreated !== 'function') options.rowCreated = () => { return; };

		this.card_options = options;
		this.card_options.api_params = this.card_options.api_params ? this.card_options.api_params : this.card_options.apiParams;
		this.container = document.getElementById(container_id);
		if (!this.container) throw `container ID ${container_id} does not exist`;

		this.list_container = document.createElement('div');
		this.list_container.classList.add('listview-container');
		if (this.card_options.listContainerClass) this.list_container.classList.add(this.card_options.listContainerClass);
		this.container.appendChild(this.list_container);
		this.container.insertAdjacentHTML('beforeend', `<div id="${container_id}_pagination_container" style="margin-top:5px;" class="pagination-container paging_simple_numbers"><ul id="${container_id}_paginator" class="pagination"></ul></div>`)
		this.pagination_container = this.container.querySelector(`#${container_id}_pagination_container>ul`);

		//If the columns array is provided => then use this array to render table display, and neglect the provided "renderItems" function
		if (this.card_options.columns) {
			this.display = 'table';
		} else {
			if (typeof this.card_options.renderItems !== 'function')
				this.display = 'table';
			else this.display = 'custom';
			// this.card_options = (items,l_container)=>{
			// 	//Default: if no "columns" and no renderItems function provided => then render items as table as default display format
			// 	//this.list_container.innerHTML ='';

			// }
		}

		if (this.display === 'table') {
			if (!this.card_options.tableClass) this.card_options.tableClass = 'table';
			this.list_container.innerHTML = [`<table class="${this.card_options.tableClass}" id="${this.container_id}_table"><thead></thead><tbody></tbody></table>`].join('');
			this.table = this.list_container.querySelector(`#${this.container_id}_table`);
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

	renderTable(items) {
		const columns = (!this.card_options.columns || !this.card_options.columns[0]) ? this.getDefaultColumns(items) : this.card_options.columns;
		this.table.querySelector('thead').innerHTML = this.generateTableHeader(columns);
		const tbody = this.table.querySelector('tbody');
		if (!items || !items[0]) {
			if (tbody) tbody.innerHTML = `<tr><td colspan="100%"><span class="d-flex align-items-center justify-content-center p-2 w-100">${this.card_options.emptyInfo ? this.card_options.emptyInfo : 'No data to display'}</span></td></tr>`;
			return;
		}

		//if(!this.card_options.tableClass) this.card_options.tableClass='table'; 
		//list_container.innerHTML=[`<table class="${this.card_options.tableClass}" id="${this.container_id}_table"><thead><tr>`,this.generateTableHeader(columns),`</tr></thead><tbody></tbody></table>`].join('');
		let row_index = 0, d = null;
		//this.table =list_container.querySelector(`#${this.container_id}_table`);
		if (tbody) tbody.innerHTML = ``;
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
		////this.createPaginationPanel(data);
	}

	// clickOnClass(target,cssClass){
	// 	return (target.parentNode.classList.contains(cssClass) || target.classList.contains(cssClass));
	// }

	show(filter = null, current_page = null, onFinish = null) {
		this.showPage(filter, current_page, onFinish);
	}

	search(filter = null, onFinish = null) {
		this.showPage(filter, null, onFinish);
	}

	setParams(jsonObject) {
		this.card_options.api_params = jsonObject;
	}

	showPage(filter = null, current_page = null, onFinish) {
		let has_filter = true;
		if (!filter) {
			filter = {};
			has_filter = false;
		}

		if (current_page > 0) this.current_page = current_page;
		else current_page = this.current_page ? this.current_page : 1;

		//current_page=current_page>0?current_page:1;
		const that = this;
		if (!has_filter) {
			filter = this.card_options.api_params ? this.card_options.api_params : {};
		} else {
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

		//remember current filter including earch_value in case that user search for items
		this.current_filter = filter;

		vsapi.call(`${this.card_options.fetchApi}`, filter, null, false).then(res => {
			if (res.status_code === 200) {
				that.card_options.beforeRender(res.data);
				//Here, we assume that api response is {data:{data:item_array}}. It means that data.data = items[]
				if (that.display === 'table')
					that.renderTable(res.data.data, that.list_container);
				else
					that.card_options.renderItems(res.data.data, that.list_container);
				that.createPaginationPanel(res.data);
				that.card_options.renderComplete(res.data);
				if (typeof onFinish === 'function') onFinish();
				//that.current_page = current_page;
			}
		});

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
		} else if (button_type === 'next') {
			//button.dataset.page = mThis.current_page +1 > lastPage? lastPage:(mThis.current_page +1);
			button.innerHTML = `<i class="la la-angle-right"></i>`;
			button.classList.add('next-page');
		} else if (button_type === 'last') {
			button.dataset.page = lastPage;
			button.innerHTML = lastPage;
			button.classList.add('last-page');
		} else if (button_type === 'first') {
			button.dataset.page = 1;
			button.innerHTML = 1;
			button.classList.add('first-page');
		} else {
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
			} else if (button.classList.contains('next-page')) {
				page_num = that.current_page + 1 > lastPage ? lastPage : (that.current_page + 1);
			} else {
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
			that.showPage(that.current_filter, page_num);
		});
		return li;
	}

	/**
	IMPORTANT: we assume that "data" has this props => 
	{
	 "current_page","last_page"	
	} 
	**/
	createPaginationPanel(data) {
		const currentPage = data.current_page;
		const lastPage = data.last_page;

		//NOTE: "this.pagination_container" references to List element "<ul>"
		this.pagination_container.innerHTML = ``;
		if (!data.data[0]) return;
		// Create "Previous" button
		this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'first'));

		// Create numbered page buttons
		let i = 1;
		do {
			if (i == lastPage - 3 && lastPage > 6)
				this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'next'));
			else if (i == 4 && lastPage > 6)
				this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'previous'));
			else if (i == 5 && lastPage == 7)
				this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'previous'));

			if (i < 4 || (i > lastPage - 3)) {
				if (i > 1 && i != lastPage) this.pagination_container.appendChild(this.createPaginationButton(i, lastPage, 'page_button'));
			} else {
				const cur_page_span = this.pagination_container.querySelector('.current-page');
				if (!cur_page_span) this.pagination_container.insertAdjacentHTML('beforeend', `<span style="display:flex;justify-content:center;align-items:center;font-weight:bold;min-width:35px;margin-left:3px;margin-right:3px;padding:3px;border:1.5px solid green;border-radius:25px;" class="current-page">${data.current_page}</span>`);
			}
			i++;
		} while (i <= lastPage);

		if (lastPage > 1) this.pagination_container.appendChild(this.createPaginationButton(currentPage, lastPage, 'last'));
		if (data.per_page > data.total) data.per_page = data.total;
		this.pagination_container.insertAdjacentHTML('beforeend', `<span style="display:flex;justify-content:center;align-items:center;color:#000;padding:3px;font-weight:bold;">${data.per_page} of ${data.total}</span>`);
		this.hilightLightButton(currentPage);
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