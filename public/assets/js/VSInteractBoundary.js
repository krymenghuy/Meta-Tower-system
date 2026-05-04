const VSInteractBoundary = (() => {

  const STACK = [];
  let ACTIVE_DROPDOWN = null;
  let _inited = false;

  /* ============================================================
     🔥 INIT
  ============================================================ */
  function init() {
    if (_inited) return;
    _inited = true;

    document.addEventListener('click', handleGlobalClick); // ✅ bubble phase
  }

  /* ============================================================
     🔥 GLOBAL CLICK HANDLER
  ============================================================ */
  function handleGlobalClick(e) {
    const path = e.composedPath ? e.composedPath() : [];

    for (let i = STACK.length - 1; i >= 0; i--) {
      const item = STACK[i];
      const el = item.el;

      if (!el || !document.contains(el)) {
        STACK.splice(i, 1);
        continue;
      }

      const ownerEl = document.getElementById(item.ownerId);

      if (isInside(e, path, el, ownerEl)) {
        break; // ✅ stop closing chain
      }

      setTimeout(() => safeClose(item), 0);
      STACK.splice(i, 1);
    }
  }

  /* ============================================================
     🔥 INSIDE DETECTION (CORE ENGINE)
  ============================================================ */
  function isInside(e, path, el, ownerEl) {

    /* 1️⃣ direct containment */
    if (path.includes(el)) return true;
    if (ownerEl && path.includes(ownerEl)) return true;

    /* 2️⃣ floating chain (portal-safe) */
    const floatingNode = path.find(node =>
      node?.getAttribute?.('data-vs-floating')
    );

    if (floatingNode) {
      const floatingOwnerId = floatingNode.getAttribute('data-vs-owner-id');
      const currentOwnerId = el.getAttribute('data-vs-owner-id');

      if (floatingOwnerId && floatingOwnerId === currentOwnerId) {
        return true;
      }
    }

    return false;
  }

  /* ============================================================
     🔥 ATTACH (REGISTER FLOATING)
  ============================================================ */
  function attach(floatingEl, ownerEl, options = {}) {
    if (!floatingEl || !ownerEl) return;

    init(); // ✅ ensure listener

    const ownerId = ensureOwnerId(ownerEl);

    floatingEl.setAttribute('data-vs-floating', '1');
    floatingEl.setAttribute('data-vs-owner-id', ownerId);

    /* ============================================================
       🔥 SINGLE DROPDOWN RULE
    ============================================================ */
    if (floatingEl.classList.contains('vs-dropdown')) {
      if (ACTIVE_DROPDOWN && ACTIVE_DROPDOWN !== floatingEl) {
        try {
          const prev = STACK.find(i => i.el === ACTIVE_DROPDOWN);
          prev?.close && prev.close();
        } catch {}
      }

      ACTIVE_DROPDOWN = floatingEl;
    }

    /* remove existing */
    const idx = STACK.findIndex(i => i.el === floatingEl);
    if (idx !== -1) STACK.splice(idx, 1);

    STACK.push({
      el: floatingEl,
      ownerId,
      close: options.onClose || null
    });
  }

  /* ============================================================
     🔥 DETACH
  ============================================================ */
  function detach(el) {
    if (!el) return;

    const idx = STACK.findIndex(i => i.el === el);
    if (idx !== -1) STACK.splice(idx, 1);

    if (el === ACTIVE_DROPDOWN) {
      ACTIVE_DROPDOWN = null;
    }

    el.removeAttribute('data-vs-floating');
    el.removeAttribute('data-vs-owner-id');
  }

  /* ============================================================
     🔥 SAFE CLOSE
  ============================================================ */
  function safeClose(item) {
    try {
      item.close && item.close();
    } catch {}

    if (item.el === ACTIVE_DROPDOWN) {
      ACTIVE_DROPDOWN = null;
    }
  }

  /* ============================================================
     🔧 HELPERS
  ============================================================ */
  function ensureOwnerId(el) {
    if (!el.id) {
      el.id = 'vsb_' + Math.random().toString(36).slice(2);
    }
    return el.id;
  }

  function debug() {
    console.log('[VSInteractBoundary STACK]', STACK);
  }

  return {
    attach,
    detach,
    debug
  };

})();