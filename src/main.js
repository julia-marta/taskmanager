import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const AUTHORIZATION = `Basic 7xDlyqZIyZGzhF55M`;
const SERVER_NAME = `https://12.ecmascript.pages.academy/task-manager`;
const {INIT} = UpdateType;

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

const api = new Api(SERVER_NAME, AUTHORIZATION);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainPage, tasksModel, filterModel, api);
const filterPresenter = new FilterPresenter(mainPage, filterModel, tasksModel);
const menuPresenter = new MenuPresenter(header, mainPage, boardPresenter, filterModel, tasksModel);

filterPresenter.init();
boardPresenter.init();

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(INIT, tasks);
    menuPresenter.init();
  })
  .catch(() => {
    tasksModel.setTasks(INIT, []);
    menuPresenter.init();
  });
