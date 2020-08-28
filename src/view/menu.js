import AbstractView from "./abstract.js";

const createMenuMarkup = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
      />
      <label for="control__new-task" class="control__label control__label--new-task"
        >+ ADD NEW TASK</label
      >
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
      />
      <label for="control__statistic" class="control__label"
        >STATISTICS</label
      >
    </section>`
  );
};

export default class Menu extends AbstractView {

  constructor() {
    super();
    this._addCardHandler = this._addCardHandler.bind(this);
  }

  getTemplate() {
    return createMenuMarkup();
  }

  _addCardHandler(evt) {
    evt.preventDefault();
    this._callback.addCard();
  }

  setAddCardHandler(callback) {
    this._callback.addCard = callback;
    this.getElement().querySelector(`#control__new-task`).addEventListener(`click`, this._addCardHandler);
  }
}
