const createFilterItemMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
      />
      <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label>`
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
