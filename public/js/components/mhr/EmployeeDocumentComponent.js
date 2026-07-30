"use strict";

var EmployeeDocumentComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._displayFileName = (doc) => {
        return (doc.file_name || "").trim() || "_";
    };

    mThis._typeLabel = (doc) => {
        const name = (doc.document_type || "").trim();
        return name !== "" ? name : "_";
    };

    mThis._fileExt = (doc) => {
        const name = mThis._displayFileName(doc);
        const parts = name.split(".");
        return parts.length > 1 ? parts.pop().toLowerCase() : "";
    };

    mThis._fileIconClass = (ext) => {
        if (ext === "pdf") return "fa-solid fa-file-pdf";
        if (["png", "jpg", "jpeg", "gif", "webp"].indexOf(ext) !== -1) {
            return "fa-solid fa-file-image";
        }
        return "fa-solid fa-file";
    };

    mThis._download = (docId) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/employee/documents/download`,
                { id: docId },
            )
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(
                        res.error_message || "Failed to download document.",
                    );
                    return;
                }
                const { data_url, file_name } = res.data || {};
                if (!data_url) {
                    cv_interact.error("Document URL is missing.");
                    return;
                }
                const a = document.createElement("a");
                a.href = data_url;
                a.download = file_name || "document";
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    };

    mThis._bindActions = (container, empId, documentList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_doc_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                DocumentDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-doc-action-btn--download").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                mThis._download(btn.dataset.docId);
            };
        });

        container.querySelectorAll(".emp-doc-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const docId = btn.dataset.docId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this document?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Document", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/documents/delete`,
                                { id: docId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, documents, empId, onRefresh) => {
        if (!container) return;

        const documentList = Array.isArray(documents) ? documents : [];

        const rowsHtml = documentList.length
            ? documentList
                  .map((doc, index) => {
                      const ext = mThis._fileExt(doc);
                      const description = (doc.description || doc.remarks || "").trim();
                      return `
                <div class="emp-doc-item" data-doc-id="${doc.id}">
                    <div class="emp-doc-item-card${index === 0 ? "" : " emp-doc-item-card--muted"}">
                        <div class="emp-doc-item-head">
                            <span class="emp-doc-file-badge emp-doc-file-badge--${ext || "file"}" aria-hidden="true">
                                <i class="${mThis._fileIconClass(ext)}"></i>
                            </span>
                            <div class="emp-doc-item-main">
                                <div class="emp-doc-title-row">
                                    <h4 class="emp-doc-type">${mThis._escapeHtml(mThis._typeLabel(doc))}</h4>
                                    ${
                                        ext
                                            ? `<span class="emp-doc-ext">${mThis._escapeHtml(ext.toUpperCase())}</span>`
                                            : ""
                                    }
                                </div>
                                <p class="emp-doc-file-name">${mThis._escapeHtml(mThis._displayFileName(doc))}</p>
                                ${
                                    description
                                        ? `<p class="emp-doc-remarks">${mThis._escapeHtml(description)}</p>`
                                        : ""
                                }
                            </div>
                            <div class="emp-doc-actions">
                                <button type="button" class="emp-doc-action-btn emp-doc-action-btn--download" data-doc-id="${doc.id}" title="Download" aria-label="Download">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button type="button" class="emp-doc-action-btn emp-doc-action-btn--delete" data-doc-id="${doc.id}" title="Delete" aria-label="Delete">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-doc-empty">
                    <i class="fa-solid fa-folder-open emp-doc-empty-icon"></i>
                    <span class="emp-doc-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-doc-card">
                    <div class="emp-doc-header">
                        <div class="emp-doc-header-title">
                            <span class="emp-doc-header-icon">
                                <i class="fa-solid fa-folder"></i>
                            </span>
                            <span class="emp-doc-header-label" vslang="titles.Documents">Documents</span>
                        </div>
                        <button type="button" class="emp-doc-add-btn" id="_emp_doc_btn_add" title="Add" aria-label="Add document">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-doc-body">
                        <div class="emp-doc-list${documentList.length ? " emp-doc-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, documentList, onRefresh);
    };

    return mThis;
})();

const DocumentDialog = (() => {
    const self = {};
    let dialog = null;

    const bindFileChooser = (me) => {
        me.fileData = null;
        if (me.controls.btn_chooseFile) {
            me.controls.btn_chooseFile.onclick = () => {
                FileChooser.chooseFile(
                    { accept: ".pdf,.png,.jpg,.jpeg,.gif,.webp" },
                    (d) => {
                        me.fileData = d;
                        if (me.controls.documents) {
                            me.controls.documents.value = d.fileName || "";
                        }
                        if (me.controls.file_ext) {
                            me.controls.file_ext.value = d.ext || "";
                        }
                    },
                );
            };
        }
    };

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <select data-style="material" name="document_type" class="form-control data-input" placeholder="Document Type" data-field="document_type_id"></select>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold">${LocaleManager.trans("File", "labels")} <span class="text-danger">*</span></label>
                                <div class="emp-doc-file-picker d-flex gap-2 align-items-center">
                                    <button type="button" name="btn_chooseFile" class="btn btn-secondary">${LocaleManager.trans("Choose File", "buttons")}</button>
                                    <input type="text" name="documents" class="form-control" disabled placeholder="No file chosen" />
                                    <input type="hidden" name="file_ext" class="data-input" data-field="ext" />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label>Remarks</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    bindFileChooser(me);
                },
                configSelect: [
                    {
                        name: "document_type",
                        data: "document_types",
                        textField: "document_type",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            if (me.fileData) {
                                p.data = me.fileData.dataUrl;
                                p.ext = me.fileData.ext;
                            }

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/documents/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("Updated document successfully");
                                        } else {
                                            cv_interact.success("Set document successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Set Document",
                    modifyTitle: "Edit Document",
                    targetProp: "document_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/documents/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
    };

    return self;
})();
