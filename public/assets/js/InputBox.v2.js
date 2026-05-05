'use strict';
/**
 * InputBox.v2.js
 * Persistent DOM shell, two modes:
 *  - Single-field (text OR select) → lightweight, reused
 *  - Custom layout (fields / createContent) → keyed, initialized once per app cycle
 *
 * NEW LOCKED RULES:
 * - InputBoxStore caches per instanceKey (instanceKey == container id)
 * - If container exists in store, DO NOT re-mount / DO NOT re-collect controls
 * - Mount + configSelect init only once per instanceKey
 * - Single-field uses fixed instanceKey: "_vsinputbox_8889991"
 */

const InputBox = (() => {

  /* =====================================================
   * Context definitions
   * ===================================================== */
  const CONTEXTS = {
    delete:    { class: 'ctx-delete',    confirmText: 'Delete',    shortcut: 'Shift+Enter' },
    update:    { class: 'ctx-update',    confirmText: 'Update',    shortcut: 'Enter' },
    authorize: { class: 'ctx-authorize', confirmText: 'Authorize', shortcut: 'Shift+Enter' },
    warning:   { class: 'ctx-warning',   confirmText: 'Proceed',   shortcut: 'Enter' },
    question:  { class: 'ctx-question',  confirmText: 'Confirm',   shortcut: 'Enter' },
    success:   { class: 'ctx-authorize', confirmText: 'OK',        shortcut: 'Enter' },
    error:     { class: 'ctx-delete',    confirmText: 'Close',     shortcut: 'Enter' },
    primary:   { class: 'ctx-update',    confirmText: 'OK',        shortcut: 'Enter' }
  };

  const INPUT_TYPES = new Set([
    'text',
    'number',
    'numeric',
    'decimal',
    'money',
    'textarea',
    'email',
    'phone',
    'date',
    'daterange'
  ]);

  /* =====================================================
   * InputBoxStore (GLOBAL)
   * ===================================================== */
  const InputBoxStore = new Map();
  // instanceKey => { container, mounted, controls, schemaKey }

  const SINGLETON_KEY = '_vsinputbox_8889991';

  /* =====================================================
   * Internal state
   * ===================================================== */
  let _inited = false;
  let _root, _backdrop;
  let _type = null;
  let _valueKey = null;
  let _labelKey = null;
  let _opts = {};
  let _asyncResolve = null;
  let _asyncReject  = null;
  let _asyncTimer   = null;

  const dom = {};

  /* =====================================================
   * Public instance (exposed to callbacks) - STABLE
   * ===================================================== */
  const me = {
    _loading: false,
    controls: Object.create(null),

    setReadOnly(readOnly = true, values = null) {
      vfc.form.setReadOnly?.(this.controls, readOnly, values);
    },
    setReadOnlyByNames(names = [], readOnly = true, values = null) {
      vfc.form.setReadOnlyByNames?.(this.controls, names, readOnly, values);
    },

    getValue() {
      /* --------------------------------------------------
       * 1️⃣ NOT single-field → delegate to form collector
       * -------------------------------------------------- */
      const isSingleField =
        !Array.isArray(_opts.fields) &&
        typeof _opts.createContent !== 'function';

      if (!isSingleField) {
        return this.getFormData();
      }

      /* --------------------------------------------------
       * 2️⃣ SINGLE-FIELD SELECT
       * -------------------------------------------------- */
      if (_type === 'select') {
        const el = this._singleSelectEl || dom.select;
        if (!el) return null;

        const value = el.value ?? '';
        if (!value) return '';

        const opt = el.selectedOptions?.[0];
        const item = opt?.__item ?? null;

        const vk = _valueKey || 'value';
        const lk = _labelKey || 'label';

        let label = '';
        const isLabelFunction = typeof lk === 'function';

        if (isLabelFunction) {
          try { label = item ? lk(item, this) : null; } catch { label = ''; }
        } else if (item && lk in item) {
          label = item[lk];
        } else {
          label = opt?.text ?? '';
        }

        return {
          [vk]: value,
          [isLabelFunction ? 'label' : lk]: label
        };
      }

      const el = this._singleInputEl || dom.input;
      if (!el) return '';

      return el.value ?? '';
    },

    on(field, event, handler) {
      if (!field || !event || !handler) return;

      const el = me.controls?.[field]; // ✅ use me, NOT this

      if (!el) {
        console.warn('[InputBox] on(): control not found:', field);
        return;
      }

      el.__ibListeners = el.__ibListeners || {};

      const key = `${event}`;

      if (el.__ibListeners[key]) {
        el.removeEventListener(event, el.__ibListeners[key]);
      }

      el.__ibListeners[key] = handler;

      el.addEventListener(event, handler);
    },
    getFormData(){
      return this.getData();
    },
    getData() {
      const p = {};
      const root = dom.custom || _root;

      root.querySelectorAll('.data-input').forEach(el => {
        const f = el.dataset.field;
        if (!f) return;

        if (el.type === 'checkbox') {
          p[f] = el.checked ? 1 : 0;
        } else if (el.type === 'radio') {
          if (el.checked) p[f] = el.value;
        } else {
          p[f] = el.value ?? '';
        }
      });

      return p;
    },
    setData(data = {}) {
        if (!data || typeof data !== 'object') return;

        const SelectConfig = vfc?.utils?.configSelect;

        Object.entries(data).forEach(([field, val]) => {

          const el = this.controls?.[field];
          if (!el) return;

          /* =====================================================
          * 1️⃣ NON-SELECT INPUTS
          * ===================================================== */
          if (el.tagName !== 'SELECT') {
            el.value = val ?? '';
            return;
          }

          /* =====================================================
          * 2️⃣ SELECT ELEMENTS
          * ===================================================== */

          /* 🔥 Normalize value */
          const normalized =
            val === undefined || val === null
              ? null
              : String(val);

          /* =====================================================
          * 2.1️⃣ NO VALUE (true empty)
          * ===================================================== */
          if (normalized === null) {

            // native clear
            el.selectedIndex = -1;

            // sync UI layer (Choices, etc.)
            if (SelectConfig?.syncValue) {
              SelectConfig.syncValue(el, null);
            }

            return;
          }

          /* =====================================================
          * 2.2️⃣ HAS VALUE
          * ===================================================== */

          // native assignment (your bridge handles UI sync internally)
          el.value = normalized;

          /* =====================================================
          * 3️⃣ DEPENDENCY TRIGGER (CRITICAL) This is already done by VSUtil.js
          * ===================================================== */
          // // Prefer configSelect trigger if available
          // const onchange =SelectConfig?.onchange || SelectConfig?.onChange;
          // if (onchange) {
          //   onchange(el, normalized, this);
          // } else {
          //   // fallback
          //   el.dispatchEvent(new Event('change', { bubbles: true }));
          // }

        });
    },  
    setError(message, showAnimation = true, seconds = 3) {
      if (!dom.error) return;

      dom.error.textContent = message ?? '';
      dom.error.style.display = message ? 'block' : 'none';

      if (!message) return;

      requestAnimationFrame(() => {
        scrollErrorIntoView();
      });

      if (!showAnimation) return;

      dom.error.classList.remove('inputbox-error-animate');
      void dom.error.offsetWidth;
      dom.error.classList.add('inputbox-error-animate');

      if (seconds > 0) {
        setTimeout(() => {
          dom.error.classList.remove('inputbox-error-animate');
        }, seconds * 1000);
      }
    },

    clearError() {
      if (!dom.error) return;
      dom.error.textContent = '';
      dom.error.style.display = 'none';
    },

    loading(state, text) {
      this._loading = !!state;
      dom.spinner.style.display = state ? '' : 'none';
      dom.btnOk.disabled = state;
      dom.btnCancel.disabled = state;
      if (text != null) dom.btnOkText.textContent = text;
    },

    resolve(val) {
      if (_asyncResolve) {
        _asyncResolve(val);
        clearAsync();
      }
      this.close(true);
    },

    close(silent = true) {
      this.loading(false);
      _root.style.display = 'none';
      _backdrop.style.display = 'none';

      if (silent === false && typeof _opts.onCancel === 'function') {
        try { _opts.onCancel(this); } catch {}
      }

      if (_asyncReject) {
        _asyncReject(silent === false ? 'cancel' : 'closed');
        clearAsync();
      }
    }
  };

    function renderButtons(options, me, dom) {
        const container = dom.footer;
        if (!container) return;

        container.innerHTML = '';

        const buttons = options.buttons;

        /* =====================================================
        * 1️⃣ CUSTOM BUTTONS (override)
        * ===================================================== */
        if (Array.isArray(buttons) && buttons.length) {

          buttons.forEach(btnCfg => {

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = btnCfg.class || btnCfg.cssClass || 'btn btn-primary';

            /* 🔥 SUPPORT label (HTML) + text (fallback) */
            if (btnCfg.label !== undefined) {
              btn.innerHTML = btnCfg.label;
            } else {
              btn.textContent = btnCfg.text || 'Button';
            }

            btn.addEventListener('click', async () => {

              if (btn.disabled) return;

              try {
                btn.disabled = true;
                const clickAction = btnCfg.action || btnCfg.click; 
                if (clickAction) {
                  await clickAction(me, btn);
                }

                if (btnCfg.close !== false) {
                  me.close();
                }

              } catch (err) {
                console.error('[InputBox] button action error:', err);
              } finally {
                btn.disabled = false;
              }

            });

            container.appendChild(btn);
          });

          return;
    }

        /* =====================================================
        * 2️⃣ DEFAULT BUTTONS (fallback)
        * ===================================================== */

        const btnOk = document.createElement('button');
        btnOk.className = 'btn btn-primary';

        const okLabel =
          options.confirmLabel ??
          options.confirmButtonText ??
          options.confirmText ??
          'OK';

        if (typeof okLabel === 'string' && okLabel.includes('<')) {
          btnOk.innerHTML = okLabel;
        } else {
          btnOk.textContent = okLabel;
        }

        btnOk.addEventListener('click', async () => {

          if (btnOk.disabled) return;

          try {
            btnOk.disabled = true;

            const value = me.getValue?.();

            if (options.onConfirm) {
              await options.onConfirm(value, btnOk, me);
            }

            me.close();

          } catch (err) {
            console.error('[InputBox] onConfirm error:', err);
          } finally {
            btnOk.disabled = false;
          }

        });

        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-secondary';

        const cancelLabel = options.cancelButtonText ?? 'Cancel';

        if (typeof cancelLabel === 'string' && cancelLabel.includes('<')) {
          btnCancel.innerHTML = cancelLabel;
        } else {
          btnCancel.textContent = cancelLabel;
        }

        btnCancel.addEventListener('click', () => {
          options.onCancel?.(me);
          me.close();
        });

        container.appendChild(btnCancel);
        container.appendChild(btnOk);
      }

  /* =====================================================
   * Resolve single-field type
   * ===================================================== */
 function resolveSingleFieldType(opts = {}) {
      const t = (opts.type || '').toLowerCase();

      if (INPUT_TYPES.has(t)) return { mode: 'input', inputType: t };
      if (t === 'select') return { mode: 'select' };

      if (opts.query) return { mode: 'select' };

      const d = opts.data;
      if (Array.isArray(d)) return { mode: 'select' };
      if (typeof d === 'string') return { mode: 'select' };
      if (opts.api || opts.fetchApi || opts.endpoint) return { mode: 'select' };

      return { mode: 'input', inputType: 'text' };
  }
 
  /* =====================================================
   * Init (DOM shell created ONCE)
   * ===================================================== */
  function init() {
    if (_inited) return;
    _inited = true;

    injectCSS();
    setDefaultTheme();

    _backdrop = document.createElement('div');
    _backdrop.className = 'inputbox-backdrop';
    _backdrop.style.display = 'none';
    document.body.appendChild(_backdrop);

    _root = document.createElement('div');
    _root.className = 'inputbox';
    _root.style.display = 'none';
    _root.innerHTML = `
      <div class="inputbox-card">
        <div class="inputbox-header">
          <div class="inputbox-title-wrap">
            <div>
              <div class="inputbox-title"></div>
              <div class="inputbox-context-line" style="display:none"></div>
            </div>
          </div>
          <button class="inputbox-close">×</button>
        </div>

        <div class="inputbox-body">
          <div class="inputbox-message"></div>
          <label class="inputbox-label" style="display:none"></label>

          <div class="input-wrapper" style="display:none">
            <input class="inputbox-input" type="text"/>
          </div>

          <div class="select-wrapper" style="display:none">
            <select class="inputbox-select"></select>
          </div>

          <div class="inputbox-custom" style="display:none"></div>
          <div class="inputbox-error"></div>
        </div>

        <div class="inputbox-footer">
          <button class="inputbox-btn cancel">Cancel</button>
          <button class="inputbox-btn ok">
            <span class="btn-text">OK</span>
            <span class="spinner" style="display:none"></span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(_root);

    const $ = sel => _root.querySelector(sel);

    Object.assign(dom, {
      title: $('.inputbox-title'),
      message: $('.inputbox-message'),
      label: $('.inputbox-label'),
      contextLine: $('.inputbox-context-line'),
      inputWrapper: $('.input-wrapper'),
      selectWrapper: $('.select-wrapper'),
      custom: $('.inputbox-custom'),
      input: $('.inputbox-input'),
      select: $('.inputbox-select'),
      error: $('.inputbox-error'),
      btnOk: $('.inputbox-btn.ok'),
      btnOkText: $('.btn-text'),
      btnCancel: $('.inputbox-btn.cancel'),
      spinner: $('.spinner'),
      btnClose: $('.inputbox-close')
    });

    dom.btnCancel.onclick = () => !me._loading && me.close(false);
    dom.btnClose.onclick  = () => !me._loading && me.close(false);
    dom.btnOk.onclick     = () => !me._loading && handleConfirm();

    _backdrop.onclick = () => {
      if (_opts.backdropClose === true && !me._loading) me.close(false);
    };

    dom.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dom.btnOk.click();
      }
    });

    document.addEventListener('keydown', e => {
      if (_root.style.display === 'none') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        me.close(false);
      }
    });
  }

  function _cssSize(v) {
    if (v == null) return '';
    if (typeof v === 'number') return `${v}px`;
    return String(v).trim();
  }

  function applyManualSize(options) {
    _root.style.width = '';
    _root.style.height = '';
    _root.style.maxWidth = '';
    _root.style.maxHeight = '';

    const card = _root.querySelector('.inputbox-card');
    if (card) {
      card.style.height = '';
      card.style.maxHeight = '';
    }

    const w = _cssSize(options.width ?? options.w);
    const h = _cssSize(options.height ?? options.h);
    const maxH = _cssSize(options.maxHeight ?? options.maxH);

    if (w) {
      _root.style.width = w;
      _root.style.maxWidth = '96vw';
    }

    if (h || maxH) {
      if (card) {
        if (h) card.style.height = h;
        if (maxH) card.style.maxHeight = maxH;
        if (!maxH && !h) card.style.maxHeight = '80vh';
      }
    }
  }

  /* =====================================================
   * Show
   * ===================================================== */
   function show(options = {}) {

  init();

  _opts = options || {};
  me.options = _opts;

  /* --------------------------------------------------
   * 🔥 Prevent async race (NEW)
  -------------------------------------------------- */
  me._showId = (me._showId || 0) + 1;
  const currentShowId = me._showId;

  /* --------------------------------------------------
   * 🔥 Normalize mode + formData
  -------------------------------------------------- */
  const hasFormData =
    _opts.formData &&
    Object.keys(_opts.formData).length > 0;

  _opts.mode = hasFormData ? 'edit' : 'create';
  _opts.formData = hasFormData ? _opts.formData : null;

  /* --------------------------------------------------
   * 🔑 Normalize select keys
  -------------------------------------------------- */
  _valueKey =
    _opts.valueField ??
    _opts.valueKey ??
    _opts.valueMember ??
    'value';

  _labelKey =
    _opts.textField ??
    _opts.textKey ??
    _opts.labelKey ??
    _opts.textMember ??
    'label';

  /* --------------------------------------------------
   * 🎨 Size + UI reset
  -------------------------------------------------- */
  _root.classList.remove('ib-sm','ib-md','ib-lg');
  _root.classList.add(`ib-${_opts.size || 'md'}`);
  applyManualSize(_opts);

  me.clearError();
  me.loading(false);

  if (dom.custom) {
    vfc.form.clearError?.(dom.custom);
  }

  dom.title.textContent = _opts.title ?? '';
  dom.message.innerHTML = _opts.message ?? '';

  resetContext();
  applyContext(_opts);

  dom.btnOkText.textContent =
    _opts.confirmText ??
    _opts.confirmButtonText ??
    (_opts.context && CONTEXTS[_opts.context]?.confirmText) ??
    'OK';

  dom.btnCancel.textContent =
    _opts.cancelButtonText ?? 'Cancel';

  dom.label.style.display = 'none';
 
  /* --------------------------------------------------
  * 🧠 ALWAYS derive configSelect from fields
  -------------------------------------------------- */
    /* --------------------------------------------------
    * 🧠 Derive configSelect (FIXED)
    -------------------------------------------------- */
    let derivedConfigSelect = null;

    if (Array.isArray(_opts.fields)) {
      derivedConfigSelect =
        vfc.utils.configSelect
          ?.deriveFromFields
          ?.call(null, _opts.fields) || null;
    }

    /* 🔥 assign FIRST */
    _opts._effectiveConfigSelect =
      _opts.configSelect || derivedConfigSelect;

    /* 🔍 debug */
    if (!_opts._effectiveConfigSelect) {
      console.warn('[InputBox] No effective configSelect');
    } else {
      console.log('[InputBox] effective configSelect:', _opts._effectiveConfigSelect);
    }

   /* 🔥 explicit configSelect overrides derived */
    _opts._effectiveConfigSelect =
    _opts.configSelect ?? derivedConfigSelect;

  /* --------------------------------------------------
   * 🧱 Render content
  -------------------------------------------------- */
  initCustomContent.call({ options: _opts, dom, me });

  /* --------------------------------------------------
   * 🎬 Show UI FIRST (better UX + lifecycle)
  -------------------------------------------------- */
  _backdrop.style.display = '';
  _root.style.display = '';

  /* --------------------------------------------------
   * 🚀 Async SELECT INIT
  -------------------------------------------------- */
  requestAnimationFrame(async () => {

    try {

      /* 🔥 Abort if newer show() called */
      if (currentShowId !== me._showId) return;

     const scope =
      dom.custom && dom.custom.children.length
        ? dom.custom
        : _root;

      const SelectConfig = vfc?.utils?.configSelect;

      if (SelectConfig) {

        /* ==========================================
         * 1️⃣ MULTI-FIELD
         * ========================================== */         
        if (_opts._effectiveConfigSelect) {

          await SelectConfig.reloadAll(
            scope,
            _opts._effectiveConfigSelect,
            me,
            _opts
          );
        }

        /* ==========================================
         * 2️⃣ SINGLE SELECT
         * ========================================== */
        else if (me._singleSelectEl) {

          await SelectConfig.loadSelect(
            me._singleSelectEl,
            {
              name: me._singleSelectEl.name,
              data: _opts.data,
              api: _opts.api || _opts.fetchApi || _opts.endpoint,
              query: _opts.query,

              valueField: _valueKey,
              textField: _labelKey,
              firstOption: _opts.firstOption,
              defaultValue: _opts.defaultValue
            },
            me,
            _opts,
            null
          );
        }

        /* ==========================================
         * 3️⃣ WAIT READY
         * ========================================== */
        if (typeof SelectConfig.waitReady === 'function') {
          await SelectConfig.waitReady(scope);
        }
      }

      /* 🔥 Abort again after async */
      if (currentShowId !== me._showId) return;

      /* ==========================================
       * 🎯 onReady (DATA READY + UI visible)
       * ========================================== */
      if (typeof _opts.onReady === 'function') {
          _opts.onReady(me);
      }

      /* ==========================================
       * 🎯 onOpen (UI FINAL) OR onShow OR onPrepareForm
       * ========================================== */
      const onShow = _opts.onOpen || _opts.onShow || _opts.onPrepareForm;
      onShow?.(me);

    } catch (err) {
      console.warn('[InputBox] select load failed:', err);
    }

  });
}

  function scrollErrorIntoView() {
    if (!dom.error) return;
    try { dom.error.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch {}
  }

  /* =====================================================
   * Confirm handler
   * ===================================================== */
  function handleConfirm() {
    const isFieldsLayout =
      Array.isArray(_opts.fields) ||
      typeof _opts.createContent === 'function';

    const value = isFieldsLayout
      ? (typeof _opts.getData === 'function'
          ? _opts.getData(me)
          : me.getFormData())
      : me.getValue();

    if (isFieldsLayout) {
      const errors = vfc.form.validateFields(dom.custom);
      if (errors.length) {
        const err = errors[0];
        me.setError(err.message);
        requestAnimationFrame(() => {
          err.element?.focus?.();
        });
        return;
      }
    } else {
      if (!_opts.allowBlankValue && isEmpty(value)) {
        me.setError(_opts.requiredMessage || 'Required');
        return;
      }
    }

    _opts.onConfirm?.(value, dom.btnOk, me);
  }

  /* =====================================================
   * Context helpers
   * ===================================================== */
  function resetContext() {
    Object.values(CONTEXTS).forEach(c => _root.classList.remove(c.class));
    dom.contextLine.style.display = 'none';
  }

  function applyContext(options) {
    const ctx = options.context;
    if (!ctx || !CONTEXTS[ctx]) return;
    _root.classList.add(CONTEXTS[ctx].class);
    dom.contextLine.style.display = '';
  }

  /* =====================================================
   * schemaKey (for singleton safety)
   * ===================================================== */
  function buildSchemaKey(opts, resolvedMode) {
    // Only used to detect if singleton needs rebuild.
    // Keep it stable and cheap.
    const name = opts.name || 'value';
    const type = (opts.type || '').toLowerCase();
    const hasFields = Array.isArray(opts.fields) || typeof opts.createContent === 'function';

    if (hasFields) {
      // For keyed layouts, schema is the instanceKey itself — no need.
      return 'layout';
    }

    // Single-field:
    // include mode + name + inputType + select keys + source hints
    const srcHint = (() => {
      if (opts.api?.endpoint) return String(opts.api.endpoint);
      if (opts.endpoint) return String(opts.endpoint);
      if (opts.fetchApi) return String(opts.fetchApi);
      if (Array.isArray(opts.data)) return `arr:${opts.data.length}`;
      if (typeof opts.data === 'string') return `key:${opts.data}`;
      return '';
    })();

    return [
      'single',
      resolvedMode?.mode || '',
      resolvedMode?.inputType || '',
      name,
      String(_valueKey || ''),
      String(typeof _labelKey === 'function' ? 'fn' : (_labelKey || '')),
      type,
      srcHint
    ].join('|');
  }

  /* =====================================================
   * initCustomContent (WITH STORE)
   * ===================================================== */
  function initCustomContent() {
  const { options: opts, dom, me } = this;

  const isFieldsLayout =
    Array.isArray(opts.fields) ||
    typeof opts.createContent === 'function';

  const instanceKey = isFieldsLayout
    ? (opts.instanceKey || null)
    : SINGLETON_KEY;

  if (isFieldsLayout && !instanceKey) {
    console.warn(
      '[InputBox] fields/createContent used WITHOUT instanceKey. DOM will be recreated every time.'
    );
  }

  /* =====================================================
   * 0️⃣ Reset state
  ===================================================== */
  dom.inputWrapper.style.display  = 'none';
  dom.selectWrapper.style.display = 'none';
  dom.custom.style.display        = 'none';

  me._singleInputEl  = null;
  me._singleSelectEl = null;
  me._controlsReady  = false;

  /* =====================================================
   * 1️⃣ Reuse cached instance
  ===================================================== */
  if (instanceKey && InputBoxStore.has(instanceKey)) {

    const cached = InputBoxStore.get(instanceKey);

    if (!isFieldsLayout) {

      const resolved = resolveSingleFieldType(opts);
      const schemaKey = buildSchemaKey(opts, resolved);

      if (cached.schemaKey && cached.schemaKey !== schemaKey) {
        InputBoxStore.delete(instanceKey);
      } else {

        dom.custom.style.display = 'block';
        dom.custom.innerHTML = '';
        dom.custom.appendChild(cached.container);

        me.controls = cached.controls;
        me._controlsReady = true;

        _type = resolved.mode;

        if (_type === 'select') {
          me._singleSelectEl =
            cached.container.querySelector('select.data-input') || null;
        } else {
          me._singleInputEl =
            cached.container.querySelector('input.data-input') || dom.input || null;
        }

        /* 🔥 contentCreated (ONCE PER INSTANCE) */
        if (!cached._contentCreatedFired && typeof opts.contentCreated === 'function') {
          try {
            opts.contentCreated(me);
            cached._contentCreatedFired = true;
          } catch (e) {
            console.warn('[InputBox] contentCreated error:', e);
          }
        }

        return;
      }

    } else {

      dom.custom.style.display = 'block';
      dom.custom.innerHTML = '';
      dom.custom.appendChild(cached.container);

      me.controls = cached.controls;
      me._controlsReady = true;

      /* 🔥 contentCreated (ONCE PER INSTANCE) */
      if (!cached._contentCreatedFired && typeof opts.contentCreated === 'function') {
        try {
          opts.contentCreated(me);
          cached._contentCreatedFired = true;
        } catch (e) {
          console.warn('[InputBox] contentCreated error:', e);
        }
      }

      return;
    }
  }

  /* =====================================================
   * 2️⃣ Create NEW container
  ===================================================== */
  const container = document.createElement('div');
  if (instanceKey) container.id = instanceKey;

  let rendered = false;

  /* =====================================================
   * 3️⃣ fields[]
  ===================================================== */
  if (Array.isArray(opts.fields)) {

    vfc.form.renderFields(container, opts.fields, {
      layout:  opts.layout  || 'grid',
      columns: opts.columns || 1,
      gap:     opts.gap     || '12px',
      classes: opts.classes || {
        input:'inputbox-input',
        select:'inputbox-select'
      }
    });

    rendered = true;
  }

  /* =====================================================
   * 4️⃣ createContent()
  ===================================================== */
  else if (typeof opts.createContent === 'function') {

    const content = opts.createContent(me);

    if (typeof content === 'string') {
      container.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      container.appendChild(content);
    }

    rendered = true;
  }

  /* =====================================================
   * 5️⃣ SINGLE FIELD
  ===================================================== */
  else {

    const resolved = resolveSingleFieldType(opts);
    _type = resolved.mode;

    if (_type === 'select') {

      const select = document.createElement('select');

      select.className = 'inputbox-select data-input';
      select.name = opts.name || 'value';
      select.dataset.field = select.name;
      select.dataset.type = 'select';

      if (!opts.allowBlankValue) {
        select.dataset.required = '1';
      }

      container.appendChild(select);
      me._singleSelectEl = select;

    } else {

      const input = document.createElement('input');

      input.type = 'text';
      input.className = 'inputbox-input data-input';
      input.name = opts.name || 'value';
      input.dataset.field = input.name;
      input.dataset.type = resolved.inputType || 'text';

      if (!opts.allowBlankValue) {
        input.dataset.required = '1';
      }

      input.value = opts.defaultValue ?? opts.value ?? '';

      container.appendChild(input);
      me._singleInputEl = input;
    }

    rendered = true;
  }

  if (!rendered) return;

  /* =====================================================
   * 6️⃣ Attach
  ===================================================== */
  dom.custom.style.display = 'block';
  dom.custom.innerHTML = '';
  dom.custom.appendChild(container);

  /* =====================================================
   * 7️⃣ Mount controls
  ===================================================== */
  const controls = vfc.form.mount(container, opts);
  me.controls = controls;
  me._controlsReady = true;

  /* =====================================================
   * 8️⃣ contentCreated (ONCE)
  ===================================================== */
  let contentCreatedFired = false;

  if (typeof opts.contentCreated === 'function') {
    try {
      opts.contentCreated(me);
      contentCreatedFired = true;
    } catch (e) {
      console.warn('[InputBox] contentCreated error:', e);
    }
  }

  /* =====================================================
   * 9️⃣ configSelect init
  ===================================================== */
  const effectiveConfigSelect =
    opts.configSelect ||
    opts._effectiveConfigSelect ||
    null;

  //Silient and Nasty Error all selects are empty without traces. So DO NOT initialize twice. reloadAll() in this.show() already  
  // if (effectiveConfigSelect) {
  //   vfc.utils.configSelect.initConfig(
  //     container,   // 🔥 FIX: real DOM
  //     effectiveConfigSelect,
  //     me,
  //     opts
  //   );
  // }

  /* =====================================================
   * 🔟 Cache
  ===================================================== */
  const schemaKey = isFieldsLayout
    ? 'layout'
    : buildSchemaKey(opts, resolveSingleFieldType(opts));

  if (instanceKey) {
    InputBoxStore.set(instanceKey, {
      container,
      mounted: true,
      controls,
      schemaKey,
      _contentCreatedFired: contentCreatedFired
    });
  }
}

  /* =====================================================
   * Helpers
   * ===================================================== */
  function resetInstance(instanceKey) {
    if (!instanceKey) return false;
    if (InputBoxStore.has(instanceKey)) {
      InputBoxStore.delete(instanceKey);
      return true;
    }
    return false;
  }

  function clearAsync() {
    if (_asyncTimer) clearTimeout(_asyncTimer);
    _asyncTimer = null;
    _asyncResolve = null;
    _asyncReject = null;
  }

  const isEmpty = v =>
    v == null ||
    (typeof v === 'string' && v.trim() === '') ||
    (typeof v === 'object' && Object.keys(v).length === 0);

  /* =====================================================
   * CSS injection (UNCHANGED)
   * ===================================================== */
  function injectCSS() {
    if (document.getElementById('inputbox-base-css')) return;

    const style = document.createElement('style');
    style.id = 'inputbox-base-css';
    style.textContent = `
 /* =====================================================
   InputBox Base CSS
   Purpose: structure, layout, safety (NO theming)
   ===================================================== */

   /* Context color variables */
  .ctx-delete    { --ctx-color: #dc2626; }
  .ctx-update    { --ctx-color: #2563eb; }
  .ctx-authorize { --ctx-color: #16a34a; }
  .ctx-warning   { --ctx-color: #f59e0b; }
  .ctx-question  { --ctx-color: #0ea5e9; }

/* Backdrop */
.inputbox-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 9998;
}

/* Root */
.inputbox{
  position: fixed;
  left: 50%;
  top: 16%;
  transform: translateX(-50%);
  z-index: 9999;
  font-family: system-ui, 'Poppins', 'Khmer OS Battambang';
}

/* Sizes (default = sm) */
.ib-sm{ width: min(92vw, 460px); }
.ib-md{ width: min(92vw, 620px); }
.ib-lg{ width: min(96vw, 780px); }

/* Card */
.inputbox-card{
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 16px 50px rgba(0,0,0,.22);

  /* 🔥 CRITICAL FIX: allow dropdown escape */
  overflow: visible;

  /* 🔒 keep layout stable */
  position: relative;
}

/* optional: clip only inner content */
.inputbox-body{
  overflow-y: auto;
}
/* Header */
.inputbox-header{
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px 10px;
}

/* Title */
.inputbox-title{
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.25;
}

/* Close button */
.inputbox-close{
  position: absolute;
  top: 14px;
  right: 14px;
  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}
.inputbox-close:hover{ opacity:.75; }

/* Body */
.inputbox-body{
  padding: 0 18px 12px;
  /* 🔥 CRITICAL: allow dropdown to overflow */
  overflow: visible;

  /* 🔒 keep layout behavior */
  overscroll-behavior: contain;
  flex: 1 1 auto;
  min-height: 0;
}
  
/* Message */
.inputbox-message{ margin-bottom: 10px; font-size: .95rem; }

/* Inputs */
.inputbox-input,
.inputbox-select{
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: .95rem;
}

/* Error slot */
.inputbox-error{
  min-height: 18px;
  margin-top: 6px;
  font-size: .85rem;
}

/* Footer */
.inputbox-footer{
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px 18px;
}

/* Buttons */
.inputbox-btn{
  padding: 9px 16px;
  border-radius: 14px;
  font-weight: 700;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
}
.inputbox-btn:disabled{ opacity:.6; cursor:not-allowed; }
.inputbox-btn.ok{ border:none; }

/* Context gradient line */
.inputbox-context-line{
  width: 60%;
  height: 2px;
  border-radius: 999px;
  margin-top: 8px;
  background: linear-gradient(
    90deg,
    var(--ctx-color) 0%,
    var(--ctx-color) 35%,
    color-mix(in srgb, var(--ctx-color) 65%, transparent) 60%,
    color-mix(in srgb, var(--ctx-color) 35%, transparent) 80%,
    transparent 100%
  );
}

/* Spinner */
.spinner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  animation: inputbox-spin .7s linear infinite;
}
@keyframes inputbox-spin{ to{ transform: rotate(360deg); } }

/* Error animation */
.inputbox-error-animate{
  animation: inputboxErrorPulse 0.45s ease-in-out 0s 2,
             inputboxErrorGlow 3s ease-out;
}
@keyframes inputboxErrorPulse{
  0%{ transform:translateX(0); }
  20%{ transform:translateX(-3px); }
  40%{ transform:translateX(3px); }
  60%{ transform:translateX(-2px); }
  80%{ transform:translateX(2px); }
  100%{ transform:translateX(0); }
}
@keyframes inputboxErrorGlow{
  0%{ text-shadow:0 0 0 rgba(220,38,38,0); }
  20%{ text-shadow:0 0 8px rgba(220,38,38,.45); }
  100%{ text-shadow:0 0 0 rgba(220,38,38,0); }
}
`;
    document.head.appendChild(style);
  }

  function setDefaultTheme() {
    if (document.getElementById('inputbox-default-theme')) return;

   const s = document.createElement('style');
    s.id = 'inputbox-default-theme';
    s.textContent = `
/* Default Theme */
.inputbox-title-wrap{ width:100%; }
.inputbox-card{
  display:flex;
  flex-direction:column;
  border-radius:18px;
  box-shadow:0 18px 60px rgba(0,0,0,.25);
  background:#fff;
  font-family:system-ui,'Poppins','Khmer OS Battambang';
}
.inputbox-header{
  padding:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.inputbox-title{ font-size:1.1rem; font-weight:800; }
.inputbox-message{ color:#6b7280; margin-bottom:10px; }
.inputbox-error{
  margin-top:8px;
  font-size:0.95rem;
  font-weight:600;
  color:#dc2626;
  line-height:1.35;
  display:none;
}
.inputbox-footer{
  padding:14px 16px;
  display:flex;
  justify-content:flex-end;
  gap:10px;
}
.inputbox-btn{ padding:10px 16px; border-radius:12px; font-weight:700; cursor:pointer; }
.inputbox-btn.ok{ background:#2563eb; color:#fff; border:none; }
.inputbox-btn.cancel{ background:#f3f4f6; color:#111827; border:1px solid #e5e7eb; }
.ctx-delete    .inputbox-btn.ok{ background:#dc2626; }
.ctx-update    .inputbox-btn.ok{ background:#2563eb; }
.ctx-authorize .inputbox-btn.ok{ background:#16a34a; }
.ctx-warning   .inputbox-btn.ok{ background:#f59e0b; }
.ctx-question  .inputbox-btn.ok{ background:#0ea5e9; }
.ctx-success   .inputbox-btn.ok{ background:#16a34a; }
`;
    document.head.appendChild(s);
  }

  /* =====================================================
   * Public API
   * ===================================================== */
  return {
    show,
    resetInstance,
    _store: InputBoxStore, // debug only
    showAsync(options = {}) {
      return new Promise((resolve, reject) => {
        clearAsync();
        _asyncResolve = resolve;
        _asyncReject = reject;

        const timeout = Number(options.timeout);
        if (timeout > 0) {
          _asyncTimer = setTimeout(() => {
            reject('timeout');
            clearAsync();
            me.close(false);
          }, timeout);
        }

        show({
          ...options,
          onConfirm(value, btn, me) {
            if (typeof options.onConfirm === 'function') {
              options.onConfirm(value, btn, me);
            } else {
              me.resolve(value);
            }
          }
        });
      });
    }
  };

})();

/**
 * to test InputBox.js
 * [DONE] configSelct => dedendents => multiple dependents with differtent apis
 * [DONE] chain dependents => A -> B-> C 
 * [IP] query:(me)=> { columns:'id,name as driver_name,code,phone_number', from:'driver as d',whereRaw:['name is not NULL', 'd.id > 0'],where[{branch_id:me.controls.branch_id.value}], limit:10, orderBy:[name:'asc']}
 * [IP] field validation , not yet work!
 * [DONE] Verify to avoid duplicate hydration
*/