import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import {UpdateType} from "./const.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";


const AUTHORIZATION = `Basic 7xDlyqZIyZGzhF55M`;
const SERVER_NAME = `https://12.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VERSION = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;
const {INIT} = UpdateType;

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

const api = new Api(SERVER_NAME, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainPage, tasksModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(mainPage, filterModel, tasksModel);
const menuPresenter = new MenuPresenter(header, mainPage, boardPresenter, filterModel, tasksModel);

filterPresenter.init();
boardPresenter.init();

apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(INIT, tasks);
    menuPresenter.init();
  })
  .catch(() => {
    tasksModel.setTasks(INIT, []);
    menuPresenter.init();
  });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        console.log(`ServiceWorker available`); // eslint-disable-line
      }).catch(() => {
        console.error(`ServiceWorker isn't available`); // eslint-disable-line
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);
    apiWithProvider.sync();
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
