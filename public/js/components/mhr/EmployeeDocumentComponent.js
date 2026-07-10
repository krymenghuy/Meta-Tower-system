"use strict";

var EmployeeDocumentComponent = (function () {
    const mThis = {};

    mThis.DOCUMENT_TYPES = [
        { id: 1, document_type: "Other" },
        { id: 2, document_type: "ID Card" },
        { id: 3, document_type: "Passport" },
        { id: 4, document_type: "CV" },
        { id: 5, document_type: "Contract" },
    ];

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._displayFileName = (doc) => {
        const original = (doc.original_file_name || "").trim();
        const ext = (doc.ext || "").trim();
        if (original && ext) return `${original}.${ext}`;
        if (original) return original;
        return (doc.file_name || "").trim() || "_";
    };

    mThis._typeLabel = (doc) => {
        const name = (doc.document_type || "").trim();
        if (name) return name;
        const found = mThis.DOCUMENT_TYPES.find(
            (t) => String(t.id) === String(doc.document_type_id),
        );
        return found ? found.document_type : "_";
    };

    mThis._fileExt = (doc) => {
        const ext = String(doc.ext || "")
            .trim()
            .toLowerCase()
            .replace(/^\./, "");
        if (ext) return ext;
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

    mThis._typeOptionsHtml = (selectedId) => {
        const selected = selectedId != null ? String(selectedId) : "";
        return mThis.DOCUMENT_TYPES.map((t) => {
            const isSelected =
                selected && selected === String(t.id) ? " selected" : "";
            return `<option value="${t.id}"${isSelected}>${mThis._escapeHtml(t.document_type)}</option>`;
        }).join("");
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
                      const remarks = (doc.remarks || "").trim();
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
                                    remarks
                                        ? `<p class="emp-doc-remarks">${mThis._escapeHtml(remarks)}</p>`
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
                <div class="emp-doc-card h-100">
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

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal emp-doc-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) =>
                    LocaleManager.trans(
                        me.dataOptions.id
                            ? "Modify Employee Document"
                            : "Add Employee Document",
                        "titles",
                    ),
                createContent: () => `
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Document Type", "labels")} <span class="text-danger">*</span></label>
                            <select name="document_type_id" class="form-control data-input" data-field="document_type_id">
                                <option value="">${LocaleManager.trans("Select", "labels")}</option>
                                ${EmployeeDocumentComponent._typeOptionsHtml()}
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Description", "labels")}</label>
                            <input type="text" name="remarks" class="form-control data-input" data-field="remarks" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("File", "labels")} <span class="text-danger">*</span></label>
                            <div class="emp-doc-file-picker d-flex gap-2 align-items-center">
                                <button type="button" name="btn_chooseFile" class="btn btn-secondary">${LocaleManager.trans("Choose File", "buttons")}</button>
                                <input type="text" name="documents" class="form-control" disabled placeholder="No file chosen" />
                                <input type="hidden" name="original_file_name" class="data-input" data-field="original_file_name" />
                                <input type="hidden" name="file_ext" class="data-input" data-field="ext" />
                            </div>
                        </div>
                    </div>`,
                contentCreated: (me) => {
                    me.fileData = null;
                    if (me.controls.btn_chooseFile) {
                        me.controls.btn_chooseFile.onclick = () => {
                            FileChooser.chooseFile(
                                { accept: ".pdf,.png,.jpg,.jpeg,.gif,.webp" },
                                (d) => {
                                    me.fileData = d;
                                    if (me.controls.documents) {
                                        me.controls.documents.value =
                                            d.fileName || "";
                                    }
                                    if (me.controls.original_file_name) {
                                        me.controls.original_file_name.value = (
                                            d.fileName || ""
                                        ).replace(/\.[^/.]+$/, "");
                                    }
                                    if (me.controls.file_ext) {
                                        me.controls.file_ext.value =
                                            d.ext || "";
                                    }
                                },
                            );
                        };
                    }
                },
                onPrepareForm: (me) => {
                    me.fileData = null;
                    if (me.controls.documents) {
                        me.controls.documents.value = "";
                    }
                    if (me.controls.document_type_id) {
                        me.controls.document_type_id.value = "";
                    }
                    if (me.controls.remarks) {
                        me.controls.remarks.value = "";
                    }

                    const document = me.dataOptions.document || null;
                    if (!document) return;

                    if (me.controls.remarks) {
                        me.controls.remarks.value = document.remarks || "";
                    }
                    if (me.controls.document_type_id) {
                        me.controls.document_type_id.value =
                            document.document_type_id || "";
                    }
                    if (document.original_file_name && me.controls.documents) {
                        const displayName = document.ext
                            ? `${document.original_file_name}.${document.ext}`
                            : document.original_file_name;
                        me.controls.documents.value = displayName;
                    }
                },
                buttons: [
                    {
                        label: LocaleManager.trans("Cancel", "buttons"),
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: LocaleManager.trans("Save", "buttons"),
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const typeEl =
                                me.controls.document_type_id ||
                                me.controls.document_type;
                            if (!typeEl || !typeEl.value) {
                                cv_interact.error(
                                    LocaleManager.trans(
                                        "select_document_type",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }
                            if (!me.fileData && !(me.dataOptions.id > 0)) {
                                cv_interact.error(
                                    LocaleManager.trans(
                                        "Please select a file",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }

                            const allowExt = [
                                "jpg",
                                "jpeg",
                                "png",
                                "gif",
                                "webp",
                                "pdf",
                            ];
                            if (
                                me.fileData &&
                                allowExt.indexOf(
                                    String(me.fileData.ext || "").toLowerCase(),
                                ) === -1
                            ) {
                                cv_interact.error(
                                    LocaleManager.trans(
                                        "Invalid file type",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }

                            const nameWithoutExt = me.fileData
                                ? String(me.fileData.fileName || "").replace(
                                      /\.[^/.]+$/,
                                      "",
                                  )
                                : me.controls.original_file_name?.value || "";

                            const p = {
                                id: me.dataOptions.id || null,
                                emp_id: me.dataOptions.emp_id,
                                document_type_id: typeEl.value,
                                remarks: me.controls.remarks
                                    ? me.controls.remarks.value
                                    : "",
                                ext: me.fileData
                                    ? me.fileData.ext
                                    : me.controls.file_ext?.value || "",
                                data: me.fileData
                                    ? me.fileData.dataUrl
                                    : null,
                                original_file_name: nameWithoutExt,
                            };

                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/employee/documents/save`,
                                    p,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, p);
                                        if (
                                            typeof me.dataOptions.onClose ===
                                            "function"
                                        ) {
                                            me.dataOptions.onClose();
                                        }
                                        cv_interact.success(
                                            me.dataOptions.id
                                                ? LocaleManager.trans(
                                                      "update_success",
                                                      "message_box_default",
                                                  )
                                                : LocaleManager.trans(
                                                      "create_success",
                                                      "message_box_default",
                                                  ),
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };

    return self;
})();
