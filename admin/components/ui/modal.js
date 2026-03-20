// Modal utility

import { escape } from '../../arc/security.js';

export function openModal(title, bodyHtml, options = {}) {
  const root = document.getElementById('modal-root');
  if (!root) return { close: () => {} };

  const sizeClass = options.size === 'lg' ? 'modal--lg' : options.size === 'sm' ? 'modal--sm' : '';
  const extraClass = options.className || '';

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal ${sizeClass} ${extraClass}">
        <div class="modal__header">
          <h3 class="modal__title">${escape(title)}</h3>
          <button class="modal__close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal__body">${bodyHtml}</div>
        ${options.footer ? `<div class="modal__footer">${options.footer}</div>` : ''}
      </div>
    </div>
  `;

  const close = () => { root.innerHTML = ''; };

  root.querySelector('.modal__close')?.addEventListener('click', close);
  root.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) close();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });

  return { close, root };
}

export function confirmDialog(message, onConfirm) {
  const { close } = openModal('Confirm', `
    <p>${escape(message)}</p>
  `, {
    size: 'sm',
    className: 'confirm-dialog',
    footer: `
      <button class="btn btn--secondary cancel-btn">Cancel</button>
      <button class="btn btn--danger confirm-btn">Confirm</button>
    `,
  });

  const root = document.getElementById('modal-root');
  root.querySelector('.cancel-btn')?.addEventListener('click', close);
  root.querySelector('.confirm-btn')?.addEventListener('click', () => {
    close();
    onConfirm();
  });
}
