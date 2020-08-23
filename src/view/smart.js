import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(newData, isOnlyDataUpdate) {
    if (!newData) {
      return;
    }

    this._data = Object.assign({}, this._data, newData);

    if (isOnlyDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    prevElement.replaceWith(newElement);
    prevElement = null;
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }
}
