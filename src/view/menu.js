import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const {ADD_NEW_TASK, TASKS, STATISTICS} = MenuItem;

const createMenuMarkup = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
        value="${ADD_NEW_TASK}"
      />
      <label for="control__new-task" class="control__label control__label--new-task"
        >+ ADD NEW TASK</label
      >
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        value="${TASKS}"
        checked
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
        value="${STATISTICS}"
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

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuMarkup();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setActiveMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  disableMenuItem(menuItem) {
    this.getElement().querySelector(`[value=${menuItem}]`).disabled = true;
  }

  enableMenuItem(menuItem) {
    this.getElement().querySelector(`[value=${menuItem}]`).disabled = false;
  }
}
