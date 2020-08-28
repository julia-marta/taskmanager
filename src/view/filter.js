import AbstractView from "./abstract.js";

const createFilterItemMarkup = (filter, currentFilterType) => {
  const {type, title, count} = filter;

  return (
    `<input type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${type === currentFilterType ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
      value="${type}"
      />
      <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label>`
  );
};

const createFilterMarkup = (filters, currentFilterType) => {
  const filterItemsMarkup = filters.map((filter) => createFilterItemMarkup(filter, currentFilterType)).join(``);

  return (
    `<section class="main__filter filter container">
      ${filterItemsMarkup}
    </section>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterMarkup(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
