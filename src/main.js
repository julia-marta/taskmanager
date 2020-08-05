import {createMenuMarkup} from "./view/menu.js";
import {createFilterMarkup} from "./view/filter.js";
import {createBoardMarkup} from "./view/board.js";
import {createSortingMarkup} from "./view/sorting.js";
import {createCardEditMarkup} from "./view/card-edit.js";
import {createCardMarkup} from "./view/card.js";
import {createLoadButtonMarkup} from "./view/load-button.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

const CARD_COUNT = 16;

const tasks = generateTasks(CARD_COUNT);
const filters = generateFilters(tasks);

const render = (container, markup, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

render(header, createMenuMarkup());
render(mainPage, createFilterMarkup(filters));
render(mainPage, createBoardMarkup());

const board = mainPage.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);

render(board, createSortingMarkup(), `afterbegin`);
render(taskList, createCardEditMarkup(tasks[0]));

for (let i = 1; i < CARD_COUNT; i++) {
  render(taskList, createCardMarkup(tasks[i]));
}

render(board, createLoadButtonMarkup());
