import {createElement} from "../utils.js";

const createCardListMarkup = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class CardList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardListMarkup();
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
