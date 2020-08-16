import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardPresenter from "./presenter/board.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";

const CARD_COUNT = 20;

const tasks = generateTasks(CARD_COUNT);
const filters = generateFilters(tasks);

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);
const boardPresenter = new BoardPresenter(mainPage);

render(header, new MenuView());
render(mainPage, new FilterView(filters));
boardPresenter.init(tasks);
