import AbstractView from "./abstract.js";

const createNoCardsMarkup = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoCards extends AbstractView {

  getTemplate() {
    return createNoCardsMarkup();
  }
}
