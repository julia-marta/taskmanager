import AbstractView from "./abstract.js";

const createCardListMarkup = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class CardList extends AbstractView {

  getTemplate() {
    return createCardListMarkup();
  }
}
