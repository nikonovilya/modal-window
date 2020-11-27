/* При вставке своей иконки закрытия 
пропишите в нее атрибут data-close="true"
и укажите нужные размеры */

const modalBtnOpen = document.querySelector('.modal__btn--open');
const body = document.querySelector('body');

const modalContent = `
  <p>
    <strong>Don’t repeat yourself, DRY</strong> (рус. не повторяйся) — это принцип разработки программного обеспечения, нацеленный на снижение повторения информации различного рода, особенно в системах со множеством слоёв абстрагирования.
  </p>
`;

const modalButtons = [
  {
    text: 'Ok',
    type: 'ok',
    handler() {
      handlerForBtnOk();
    },
  },
  {
    text: 'Очистить',
    type: 'clear',
    handler() {
      console.log('Clear btn click');
    },
  },
];

function handlerForBtnOk() {
  modalClose(modal);
}

function modalOpen(btn, modal) {
  btn.addEventListener('click', () => {
    modal.open();
    body.classList.add('overflow-hidden');
  });
}

function modalClose(modal) {
  modal.close();
  body.classList.remove('overflow-hidden');
}

const modal = $.modal({
  width: '600px',
  height: 'auto',
  maxHeight: '600px',
  marginTop: '14vh',
  backgroundColor: '#ffffff',
  borderRadius: '5px',
  title: ' New Modal Window',
  fontSizeTitle: '20px',
  fontWeightTitle: '700',
  closable: true,
  closableImage: ``,
  closableImageWidth: '16px',
  closableImageHeight: '16px',
  content: modalContent,
  overflowX: 'hidden',
  overflowY: 'scroll',
  footerButtons: modalButtons,
});

modalOpen(modalBtnOpen, modal);
