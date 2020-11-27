Element.prototype.appendAfter = function (el) {
  el.parentNode.insertBefore(this, el.nextSibling);
};

function noop() {}

function createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div');
  }

  const footerWrap = document.createElement('div');
  footerWrap.classList.add('modal__footer');

  buttons.forEach((btn) => {
    const $btn = document.createElement('button');
    $btn.textContent = btn.text;
    $btn.classList.add('modal__btn');
    $btn.classList.add(`modal__btn--${btn.type || 'secondary'}`);
    $btn.onclick = btn.handler || noop;
    footerWrap.appendChild($btn);
  });

  return footerWrap;
}

function createModal(options) {
  const DEFAULT_WIDTH = '600px';
  const DEFAULT_HEIGHT = 'auto';
  const DEFAULT_MAX_HEIGHT = 'none';
  const DEFAULT_MARGIN_TOP = '10vh';
  const DEFAULT_TITTLE = 'Modal Window';
  const DEFAULT_FONT_SIZE_TITTLE = '16px';
  const DEFAULT_FONT_WEIGHT_TITTLE = '400';
  const DEFAULT_WIDTH_CLOSE_IMG = '10px';
  const DEFAULT_HEIGHT_CLOSE_IMG = '10px';
  const DEFAULT_BACKGROUND_COLOR = '#ffffff';
  const DEFAULT_BORDER_RADIUS = '0';
  const DEFAULT_OVERFLOW_X = 'auto';
  const DEFAULT_OVERFLOW_Y = 'auto';

  const body = document.querySelector('body');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="modal__overlay" data-close="true">
    <div class="modal__window" style="width: ${
      options.width || DEFAULT_WIDTH
    };height: ${options.height || DEFAULT_HEIGHT};max-height: ${
      options.maxHeight || DEFAULT_MAX_HEIGHT
    };margin-top: ${
      options.marginTop || DEFAULT_MARGIN_TOP
    };background-color: ${
      options.backgroundColor || DEFAULT_BACKGROUND_COLOR
    };border-radius: ${
      options.borderRadius || DEFAULT_BORDER_RADIUS
    };overflow-x: ${options.overflowX || DEFAULT_OVERFLOW_X};overflow-y: ${
      options.overflowY || DEFAULT_OVERFLOW_Y
    };">
    <div class="modal__header"> 
    <span class="moda__title" style="font-size: ${
      options.fontSizeTitle || DEFAULT_FONT_SIZE_TITTLE
    };font-weight: ${
      options.fontWeightTitle || DEFAULT_FONT_WEIGHT_TITTLE
    };" data-title>${options.title || DEFAULT_TITTLE}
    </span>
    ${
      options.closable
        ? options.closableImage ||
          `<img class="modal__close" style="width: ${
            options.closableImageWidth || DEFAULT_WIDTH_CLOSE_IMG
          };height: ${
            options.closableImageHeight || DEFAULT_HEIGHT_CLOSE_IMG
          };" src="img/close.svg" data-close="true" alt="Закрыть модальное окно" tabindex="0">`
        : ''
    }
    </div>
    <div class="modal__body" data-content>
    ${options.content || ''}
    </div>
    </div>
    </div>
    `
  );
  const modalBody = modal.querySelector('[data-content]');
  const modalFooter = createModalFooter(options.footerButtons);
  modalFooter.appendAfter(modalBody);
  body.appendChild(modal);
  return modal;
}

$.modal = function (options) {
  const $modal = createModal(options);
  const body = document.querySelector('body');
  const closeImage = document.querySelector('.modal__close');
  const ANIMATION_SPEED = 300;
  const ENTER = 13;
  const ESC = 27;
  let closing = false;
  let destroyed = false;

  const modal = {
    open() {
      if (destroyed) {
        return console.log('Modal is destroyed!');
      }
      !closing && $modal.classList.add('modal--open');
    },
    close() {
      closing = true;
      $modal.classList.remove('modal--open');
      $modal.classList.add('modal--hide');
      setTimeout(() => {
        $modal.classList.remove('modal--hide');
        closing = false;
      }, ANIMATION_SPEED);
    },
  };

  const listenerClose = (evt) => {
    if (evt.target.dataset.close) {
      modal.close();
      body.classList.remove('overflow-hidden');
    }
  };

  const listenerESC = (evt) => {
    if (evt.keyCode === ESC) {
      evt.preventDefault();
      if ($modal.classList.contains('modal--open')) {
        modal.close();
        body.classList.remove('overflow-hidden');
      }
    }
  };

  const listenerENTER = (evt) => {
    if (evt.keyCode === ENTER) {
      evt.preventDefault();
      if ($modal.classList.contains('modal--open')) {
        modal.close();
        body.classList.remove('overflow-hidden');
      }
    }
  };

  $modal.addEventListener('click', listenerClose);
  window.addEventListener('keydown', listenerESC);
  closeImage.addEventListener('keydown', listenerENTER);

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener('click', listenerClose);
      window.removeEventListener('keydown', listenerESC);
      closeImage.removeEventListener('keydown', listenerENTER);
      destroyed = true;
    },

    setContent(html) {
      const modalContent = $modal.querySelector('[data-content]');
      modalContent.innerHTML = html;
    },

    setContentTitle(text) {
      const modalTitle = $modal.querySelector('[data-title]');
      modalTitle.innerHTML = text;
    },
  });
};
