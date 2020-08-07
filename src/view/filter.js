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

export const createFilterMarkup = (filters) => {
  const filterItemsMarkup = filters.map((filter, index) => createFilterItemMarkup(filter, index === 0)).join(``);

  return (
    `<section class="main__filter filter container">
      ${filterItemsMarkup}
    </section>`
  );
};
