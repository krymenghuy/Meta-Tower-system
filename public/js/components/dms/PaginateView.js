"use strict";

class PaginateView {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.perPage = options.perPage || 5;
    this.fetchApi = options.fetchApi || "";
    this.renderItems = options.renderItems || null;
    this.renderComplete = options.renderComplete || null;
    this.columns = options.columns || [];
    this.listContainerClass = options.listContainerClass || "";
    this.pagingActiveClass = options.pagingActiveClass || "active";
    this.beforeRender = options.beforeRender || (() => {});

    this.current_page = 1;
    this.current_filter = {};

    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw `Container with ID ${containerId} does not exist.`;
    }

    this.listContainer = document.createElement("div");
    this.listContainer.classList.add("listview-container");

    if (this.listContainerClass) {
      this.listContainer.classList.add(this.listContainerClass);
    }

    this.container.appendChild(this.listContainer);

    this.container.insertAdjacentHTML(
      "beforeend",
      `<div id="${containerId}_pagination_container" style="margin-top:5px;" class="pagination-container paging_simple_numbers"><ul id="${containerId}_paginator" class="pagination"></ul></div>`
    );

    this.paginationContainer = this.container.querySelector(
      `#${containerId}_pagination_container>ul`
    );

    this.display = this.columns.length > 0 ? "table" : "custom";

    if (this.display === "table") {
      if (!this.tableClass) {
        this.tableClass = "table";
      }

      this.listContainer.innerHTML = `<table class="${this.tableClass}" id="${this.containerId}_table"><thead></thead><tbody></tbody></table>`;
      this.table = this.listContainer.querySelector(`#${this.containerId}_table`);
    }
  }

  getDefaultColumns(items) {
    const firstItem = items[0];
    if (!firstItem) return [];
    const cols = [];
    for (const prop in firstItem) {
      const title = prop.replace(/_/g, " ");
      cols.push({ title: title, data: prop });
    }
    return cols;
  }

  generateTableHeader(cols = []) {
    let html = "";
    cols.forEach((c) => {
      const colClass = c.title.replace(/\s/g, "-");
      html += `<th class="${colClass}">${c.title}</th>`;
    });
    return `<tr>${html}</tr>`;
  }

  renderTable(items) {
    const columns = this.columns.length > 0
      ? this.columns
      : this.getDefaultColumns(items);

    this.table.querySelector("thead").innerHTML = this.generateTableHeader(
      columns
    );

    const tbody = this.table.querySelector("tbody");

    if (!items || !items[0]) {
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="100%"><span class="d-flex align-items-center justify-content-center p-2 w-100">${this.emptyInfo || "No data to display"}</span></td></tr>`;
      }
      return;
    }

    let row_index = 0;
    let d = null;

    if (tbody) {
      tbody.innerHTML = "";
    }

    do {
      d = items[row_index];

      if (!d) {
        break;
      }

      let html_row = null;
      const tr = document.createElement("tr");

      columns.forEach((c) => {
        let val = null;
        if (typeof c.data === "function") {
          val = c.data(d, row_index, tr);
        } else {
          val = d[c.data];
        }

        const colClass = c.title.replace(/\s/g, "-");
        html_row += `<td class="${c.className || ""} ${colClass}">${val}</td>`;
      });

      tr.innerHTML = html_row;
      tbody.appendChild(tr);

      this.rowCreated(d, row_index, tr);

      row_index++;
    } while (d);
  }

  show(filter = null, current_page = null, onFinish = null) {
    this.showPage(filter, current_page, onFinish);
  }

  search(filter = null, onFinish = null) {
    this.showPage(filter, null, onFinish);
  }

  setParams(jsonObject) {
    this.current_filter = jsonObject;
  }

  showPage(filter = null, current_page = null, onFinish) {
    let has_filter = true;

    if (!filter) {
      filter = {};
      has_filter = false;
    }

    if (current_page > 0) {
      this.current_page = current_page;
    } else {
      current_page = this.current_page ? this.current_page : 1;
    }

    if (!has_filter) {
      filter = this.current_filter || {};
    } else {
      if (this.current_filter) {
        for (const prop in this.current_filter) {
          if (!filter[prop]) {
            filter[prop] = this.current_filter[prop];
          }
        }
      }
    }

    filter.current_page = current_page;
    filter.per_page = this.perPage;

    this.current_filter = filter;

    const that = this;

    vsapi.call(`${this.fetchApi}`, filter, null, false).then((res) => {
      if (res.status_code === 200) {
        that.beforeRender(res.data);

        if (that.display === "table") {
          that.renderTable(res.data.data);
        } else if (typeof that.renderItems === "function") {
          that.renderItems(res.data.data, that.listContainer);
        }

        that.createPaginationPanel(res.data);

        if (typeof onFinish === "function") {
          onFinish();
        }
      }
    });
  }

  createPaginationButton(currentPage = null, lastPage = 0, button_type = "page_button") {
    const li = document.createElement("li");
    let disabled = true;

    if (currentPage < 1) {
      currentPage = 1;
    }

    if (currentPage > lastPage) {
      currentPage = lastPage;
    }

    if (button_type === "previous") {
      disabled = currentPage == 1;
    } else if (button_type === "next") {
      disabled = currentPage == lastPage;
    }

    li.setAttribute("disabled", disabled);
    li.classList.add("paginate_button", "page_item");

    const button = document.createElement("a");
    button.classList.add("vs-btn-page");
    button.style.minWidth = "38px";
    button.style.height = "30.6px";

    if (button_type === "previous") {
      button.innerHTML = `<i class="la la-angle-left"></i>`;
      button.classList.add("previous-page");
    } else if (button_type === "next") {
      button.innerHTML = `<i class="la la-angle-right"></i>`;
      button.classList.add("next-page");
    } else if (button_type === "last") {
      button.dataset.page = lastPage;
      button.innerHTML = lastPage;
      button.classList.add("last-page");
    } else if (button_type === "first") {
      button.dataset.page = 1;
      button.innerHTML = 1;
      button.classList.add("first-page");
    } else {
      button.dataset.page = currentPage;
      button.innerHTML = currentPage;
    }

    li.appendChild(button);

    const that = this;
    that.current_page = parseInt(that.current_page);

    button.addEventListener("click", (e) => {
      e.preventDefault();

      let page_num = null;

      if (button.classList.contains("previous-page")) {
        page_num = that.current_page - 1 < 1 ? 1 : that.current_page - 1;
      } else if (button.classList.contains("next-page")) {
        page_num = that.current_page + 1 > lastPage
          ? lastPage
          : that.current_page + 1;
      } else {
        page_num = button.dataset.page;
      }

      const btn = this.paginationContainer.querySelector(".previous-page");
      if (btn) {
        btn.setAttribute("disabled", page_num == 1);
      }

      const btn = this.paginationContainer.querySelector(".first-page");
      if (btn) {
        btn.setAttribute("disabled", page_num == 1);
      }

      const btn = this.paginationContainer.querySelector(".last-page");
      if (btn) {
        btn.setAttribute("disabled", page_num == lastPage);
      }

      const btn = this.paginationContainer.querySelector(".next-page");
      if (btn) {
        btn.setAttribute("disabled", page_num == lastPage);
      }

      that.current_page = page_num;
      that.showPage(that.current_filter, page_num);
    });

    return li;
  }

  createPaginationPanel(data) {
    const currentPage = data.current_page;
    const lastPage = data.last_page;

    this.paginationContainer.innerHTML = "";

    if (!data.data[0]) {
      return;
    }

    this.paginationContainer.appendChild(
      this.createPaginationButton(currentPage, lastPage, "first")
    );

    let i = 1;
    do {
      if (i == lastPage - 3 && lastPage > 6) {
        this.paginationContainer.appendChild(
          this.createPaginationButton(currentPage, lastPage, "next")
        );
      } else if (i == 4 && lastPage > 6) {
        this.paginationContainer.appendChild(
          this.createPaginationButton(currentPage, lastPage, "previous")
        );
      } else if (i == 5 && lastPage == 7) {
        this.paginationContainer.appendChild(
          this.createPaginationButton(currentPage, lastPage, "previous")
        );
      }

      if (i < 4 || i > lastPage - 3) {
        if (i > 1 && i != lastPage) {
          this.paginationContainer.appendChild(
            this.createPaginationButton(i, lastPage, "page_button")
          );
        }
      } else {
        const cur_page_span = this.paginationContainer.querySelector(
          ".current-page"
        );

        if (!cur_page_span) {
          this.paginationContainer.insertAdjacentHTML(
            "beforeend",
            `<span style="display:flex;justify-content:center;align-items:center;font-weight:bold;min-width:35px;margin-left:3px;margin-right:3px;padding:3px;border:1.5px solid green;border-radius:25px;" class="current-page">${data.current_page}</span>`
          );
        }
      }

      i++;
    } while (i <= lastPage);

    if (lastPage > 1) {
      this.paginationContainer.appendChild(
        this.createPaginationButton(currentPage, lastPage, "last")
      );
    }

    if (data.per_page > data.total) {
      data.per_page = data.total;
    }

    this.paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<span style="display:flex;justify-content:center;align-items:center;color:#000;padding:3px;font-weight:bold;">${data.per_page} of ${data.total}</span>`
    );

    this.hilightLightButton(currentPage);
  }

  hilightLightButton(currentPage = null) {
    let found = false;
    const currentPageButton = this.paginationContainer.querySelector(
      ".current-page"
    );

    this.paginationContainer.querySelectorAll(".vs-btn-page").forEach((b) => {
      if (b.dataset.page == currentPage) {
        b.classList.add(this.pagingActiveClass);
        found = true;

        if (currentPageButton) {
          currentPageButton.classList.remove(this.pagingActiveClass);
        }
      }

      if (!found) {
        if (currentPageButton) {
          currentPageButton.classList.add(this.pagingActiveClass);
        }
      }
    });
  }
}
