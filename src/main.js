import {createMenuMarkup} from "./view/menu.js";
import {createFilterMarkup} from "./view/filter.js";
import {createBoardMarkup} from "./view/board.js";
import {createSortingMarkup} from "./view/sorting.js";
import {createCardEditMarkup} from "./view/card-edit.js";
import {createCardMarkup} from "./view/card.js";
import {createLoadButtonMarkup} from "./view/load-button.js";

const CARD_COUNT = 3;

const render = (container, markup, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

render(header, createMenuMarkup());
render(mainPage, createFilterMarkup());
render(mainPage, createBoardMarkup());

const board = mainPage.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);

render(board, createSortingMarkup(), `afterbegin`);
render(taskList, createCardEditMarkup());

for (let i = 0; i < CARD_COUNT; i++) {
  render(taskList, createCardMarkup());
}

render(board, createLoadButtonMarkup());
