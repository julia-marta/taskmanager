import AbstractView from "./abstract.js";

const createBoardMarkup = () => {
  return (
    `<section class="board container"></section>`
  );
};

export default class Board extends AbstractView {

  getTemplate() {
    return createBoardMarkup();
  }
}
