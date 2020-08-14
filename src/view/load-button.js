import {createElement} from "../utils.js";

const createLoadButtonMarkup = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadButtonMarkup();
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
