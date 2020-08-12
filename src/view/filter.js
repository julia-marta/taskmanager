import {createElement} from "../utils.js";

const createFilterItemMarkup = (filter, isChecked) => {
  const {title, count} = filter;

  return (
    `<input type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
      />
      <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label>`
  );
};

const createFilterMarkup = (filters) => {
  const filterItemsMarkup = filters.map((filter, index) => createFilterItemMarkup(filter, index === 0)).join(``);

  return (
    `<section class="main__filter filter container">
      ${filterItemsMarkup}
    </section>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterMarkup(this._filters);
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
