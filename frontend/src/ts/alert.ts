// ══════════════════════════════════════════════════════
//  MediAlert — Universal Alert System
//  Works on light pages (patient/public) and
//  dark pages (admin/doctor dashboards)
// ══════════════════════════════════════════════════════

// Types (annotated as TypeScript-style comments)
// type AlertType = 'error' | 'success' | 'warning' | 'info' | 'confirm'
// type Theme     = 'light' | 'dark'
//
// interface ToastOptions {
//   type:     AlertType
//   title:    string
//   message?: string
//   duration?: number   // ms, default 4000
//   theme?:   Theme
// }
//
// interface ModalOptions {
//   type:         AlertType
//   title:        string
//   message:      string
//   detail?:      string
//   confirmText?: string
//   cancelText?:  string
//   theme?:       Theme
//   onConfirm?:   () => void
//   onCancel?:    () => void
// }

const MediAlert = (() => {

    // ── ICON SVGS ──
    const ICONS: Record<string, string> = {
        error: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        success: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
        warning: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        confirm: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    };

    // Detail icons
    const DETAIL_ICONS: Record<string, string> = {
        error: `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        success: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        warning: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        confirm: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`,
    };

    // ── TOAST ──
    const MAX_TOASTS: number = 4;
    // const toastStack: HTMLElement = document.getElementById('toastStack') as HTMLElement; // moved to toast()
    let toastIdCounter: number = 0;

    function toast(opts: {
        type: string;
        title: string;
        message?: string;
        duration?: number;
        theme?: string;
    }): void {
        const {
            type = 'info',
            title,
            message = '',
            duration = 4000,
            theme = 'light'
        } = opts;

        const toastStack = document.getElementById('toastStack') as HTMLElement;
        if (!toastStack) return;

        // Limit stack
        const existing = toastStack.querySelectorAll('.toast');
        if (existing.length >= MAX_TOASTS) {
            dismissToast(existing[0] as HTMLElement);
        }

        const id: string = `toast-${++toastIdCounter}`;
        const darkClass: string = theme === 'dark' ? ' dark-theme' : '';

        const el: HTMLElement = document.createElement('div');
        el.id = id;
        el.className = `toast toast-${type}${darkClass}`;
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'assertive');

        el.innerHTML = `
      <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-desc">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss" onclick="MediAlert._dismissById('${id}')">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="toast-progress" style="animation-duration:${duration}ms;"></div>
    `;

        el.addEventListener('click', () => dismissToast(el));
        toastStack.appendChild(el);

        // Trigger show
        requestAnimationFrame(() => {
            requestAnimationFrame(() => el.classList.add('show'));
        });

        // Auto-dismiss
        setTimeout(() => dismissToast(el), duration);
    }

    function dismissToast(el: HTMLElement | null): void {
        if (!el || el.classList.contains('hide')) return;
        el.classList.add('hide');
        setTimeout(() => el.remove(), 350);
    }

    function _dismissById(id: string): void {
        dismissToast(document.getElementById(id));
    }

    // ── MODAL ──
    let modalOnConfirm: (() => void) | null = null;
    let modalOnCancel: (() => void) | null = null;
    // overlay, box, iconArea, detailEl, footerEl moved inside modal() to avoid null on load

    function modal(opts: {
        type: string;
        title: string;
        message: string;
        detail?: string;
        confirmText?: string;
        cancelText?: string;
        theme?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }): void {
        const {
            type = 'info',
            title,
            message,
            detail = '',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            theme = 'light',
            onConfirm,
            onCancel,
        } = opts;

        const overlay = document.getElementById('mediModalOverlay') as HTMLElement;
        const box = document.getElementById('mediModalBox') as HTMLElement;
        const iconArea = document.getElementById('mediModalIconArea') as HTMLElement;
        const detailEl = document.getElementById('mediModalDetail') as HTMLElement;
        const footerEl = document.getElementById('mediModalFooter') as HTMLElement;

        if (!overlay || !box) return;

        modalOnConfirm = onConfirm || null;
        modalOnCancel = onCancel || null;

        // Reset classes
        box.className = `modal-box modal-${type}${theme === 'dark' ? ' dark-theme' : ''}`;

        // Icon area
        iconArea.innerHTML = `
      <div class="modal-icon-ring">
        ${ICONS[type] || ICONS.info}
      </div>
      <div class="modal-heading">${title}</div>
      <div class="modal-message">${message}</div>
    `;

        // Detail
        if (detail) {
            detailEl.style.display = 'flex';
            detailEl.innerHTML = `
        ${DETAIL_ICONS[type] || ''}
        <span>${detail}</span>
      `;
        } else {
            detailEl.style.display = 'none';
        }

        // Footer buttons
        footerEl.innerHTML = `
      <button class="modal-btn modal-btn-primary" onclick="MediAlert._confirm()">
        ${ICONS[type] || ''}
        ${confirmText}
      </button>
      <button class="modal-btn modal-btn-secondary" style="display: ${title === 'Access Denied' ? 'none' : 'block'}" onclick="MediAlert._cancel()">
        ${cancelText}
      </button>
    `;

        // Show
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(): void {
        const overlay = document.getElementById('mediModalOverlay') as HTMLElement;
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function _confirm(): void {
        closeModal();
        if (modalOnConfirm) {
            setTimeout(modalOnConfirm, 200);
        }
    }

    function _cancel(): void {
        closeModal();
        if (modalOnCancel) {
            setTimeout(modalOnCancel, 200);
        }
    }

    function _handleOverlayClick(_e: MouseEvent): void {
        // Disabled: clicking outside modal does not close it
    }

    // Keyboard
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        const overlay = document.getElementById('mediModalOverlay');
        // Escape disabled: modal must be closed via buttons only
        if (e.key === 'Enter' && overlay?.classList.contains('open')) _confirm();
    });

    // Public API
    return { toast, modal, _dismissById, _confirm, _cancel, _handleOverlayClick };

})();

export { MediAlert };
(window as any).MediAlert = MediAlert;

// ══════════════════════════════════════════════════════
//  INLINE BANNER helper (for demo — in production,
//  call MediAlert.banner() from your page JS)
// ══════════════════════════════════════════════════════
const BANNER_ICONS: Record<string, string> = {
    error: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    success: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

let bannerIdCounter: number = 0;

function showBanner(
    type: string,
    title: string,
    message: string,
    hasAction: boolean = false,
    theme: string = 'light'
): void {
    const area: HTMLElement = document.getElementById('bannerArea') as HTMLElement;
    const id: string = `banner-${++bannerIdCounter}`;
    const darkClass: string = theme === 'dark' ? ' dark-theme' : '';

    const el: HTMLElement = document.createElement('div');
    el.id = id;
    el.className = `alert-banner alert-${type}${darkClass}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');

    el.innerHTML = `
    <div class="alert-icon">${BANNER_ICONS[type] || ''}</div>
    <div class="alert-content">
      <div class="alert-title">${title}</div>
      <div class="alert-message">${message}</div>
      ${hasAction ? `
      <div class="alert-actions">
        <button class="alert-action-btn"
          style="background:${type === 'warning' ? 'var(--amber-50)' : 'var(--' + type + '-50)'};
                 border-color:${type === 'warning' ? 'var(--amber-400)' : 'var(--' + type + '-400)'};
                 color:${type === 'warning' ? 'var(--amber-600)' : 'var(--' + type + '-600)'};"
          onclick="MediAlert.toast({type:'${type}',title:'Action taken!'})">
          Take Action
        </button>
        <button class="alert-action-btn"
          style="background:var(--gray-50);border-color:var(--gray-100);color:var(--gray-600);"
          onclick="dismissBanner('${id}')">
          Dismiss
        </button>
      </div>` : ''}
    </div>
    <button class="alert-dismiss" aria-label="Dismiss" onclick="dismissBanner('${id}')">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

    area.appendChild(el);
}

function dismissBanner(id: string): void {
    const el: HTMLElement | null = document.getElementById(id);
    if (!el) return;
    el.classList.add('dismissing');
    setTimeout(() => el.remove(), 350);
}