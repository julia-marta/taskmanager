import {createMenuMarkup} from "./view/menu.js";
import {createFilterMarkup} from "./view/filter.js";
import {createBoardMarkup} from "./view/board.js";
import {createSortingMarkup} from "./view/sorting.js";
import {createCardEditMarkup} from "./view/card-edit.js";
import {createCardMarkup} from "./view/card.js";
import {createLoadButtonMarkup} from "./view/load-button.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 8;

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

const renderCards = (task) => {
  render(taskList, createCardMarkup(task));
}

for (let i = 1; i < Math.min(tasks.length, CARD_COUNT_PER_STEP); i++) {
  renderCards(tasks[i]);
}

if (tasks.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;
  render(board, createLoadButtonMarkup());

  const loadMoreButton = board.querySelector(`.load-more`);

  const onLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    tasks.slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP).forEach((task) => renderCards(task));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= tasks.length) {
      loadMoreButton.remove();
    }
  }

  loadMoreButton.addEventListener(`click`, onLoadMoreButtonClick);
};
