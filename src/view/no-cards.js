import {createElement} from "../utils.js";

const createNoCardsMarkup = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoCards {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoCardsMarkup();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
