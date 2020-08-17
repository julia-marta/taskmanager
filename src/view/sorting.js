import AbstractView from "./abstract.js";
import {SortType} from "../const.js";
const {DEFAULT, DATE_UP, DATE_DOWN} = SortType;

const createSortingMarkup = () => {
  return (
    `<div class="board__filter-list">
        <a href="#" class="board__filter" data-sort-type="${DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-sort-type="${DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter" data-sort-type="${DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

export default class Sorting extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingMarkup();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
