import MenuView from "../view/menu.js";
import StatisticsView from "../view/statistics";
import {render, remove} from "../utils/render.js";
import {MenuItem, FilterType, UpdateType} from "../const.js";

const {ADD_NEW_TASK, TASKS, STATISTICS} = MenuItem;
const {ALL} = FilterType;
const {MAJOR} = UpdateType;

export default class Menu {
  constructor(menuContainer, statisticsContainer, boardPresenter, filterModel, tasksModel) {
    this._menuContainer = menuContainer;
    this._statisticsContainer = statisticsContainer;
    this._boardPresenter = boardPresenter;
    this._filterModel = filterModel;
    this._tasksModel = tasksModel;
    this._menuComponent = new MenuView();
    this._statisticsComponent = null;

    this._handleCardNewClose = this._handleCardNewClose.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);
  }

  init() {
    render(this._menuContainer, this._menuComponent);
    this._menuComponent.setMenuClickHandler(this._handleMenuClick);
  }

  _handleCardNewClose() {
    this._menuComponent.getElement().querySelector(`[value=${TASKS}]`).disabled = false;
    this._menuComponent.setActiveMenuItem(TASKS);
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case ADD_NEW_TASK:
        remove(this._statisticsComponent);
        this._boardPresenter.destroy();
        this._filterModel.setFilter(MAJOR, ALL);
        this._boardPresenter.init();
        this._boardPresenter.createCard(this._handleCardNewClose);
        this._menuComponent.getElement().querySelector(`[value=${TASKS}]`).disabled = true;
        break;
      case TASKS:
        this._boardPresenter.init();
        remove(this._statisticsComponent);
        break;
      case STATISTICS:
        this._boardPresenter.destroy();
        this._statisticsComponent = new StatisticsView(this._tasksModel.getTasks());
        render(this._statisticsContainer, this._statisticsComponent);
        break;
    }
  }
}
