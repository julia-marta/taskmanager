import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import {generateTasks} from "./mock/task.js";

const CARD_COUNT = 20;

const tasks = generateTasks(CARD_COUNT);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);
const filterModel = new FilterModel();

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainPage, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(mainPage, filterModel, tasksModel);
const menuPresenter = new MenuPresenter(header, mainPage, boardPresenter, filterModel, tasksModel);

menuPresenter.init();
filterPresenter.init();
boardPresenter.init();
