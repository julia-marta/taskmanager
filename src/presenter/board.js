import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import CardListView from "../view/card-list.js";
import NoCardsView from "../view/no-cards.js";
import LoadButtonView from "../view/load-button.js";
import CardPresenter from "./card.js";
import CardNewPresenter from "./card-new.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortTasksUp, sortTasksDown} from "../utils/task.js";
import {filterRules} from "../utils/filter.js";
import {SortType, UserAction, UpdateType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;

const {DEFAULT, DATE_DOWN, DATE_UP} = SortType;
const {UPDATE, ADD, DELETE} = UserAction;
const {PATCH, MINOR, MAJOR} = UpdateType;
const CARD_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel, filterModel) {
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;
    this._currentSortType = DEFAULT;
    this._cardPresenter = {};

    this._sortComponent = null;
    this._loadButtonComponent = null;

    this._boardComponent = new BoardView();
    this._cardListComponent = new CardListView();
    this._noCardsComponent = new NoCardsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadButtonClick = this._handleLoadButtonClick.bind(this);

    this._cardNewPresenter = new CardNewPresenter(this._cardListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardListComponent);
    this._renderBoard();
    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearBoard({resetRenderedCardCount: true, resetSortType: true});

    remove(this._cardListComponent);
    remove(this._boardComponent);

    this._tasksModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createCard(callback) {
    this._cardNewPresenter.init(callback);
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filteredTasks = tasks.filter((task) => filterRules[filterType](task));

    switch (this._currentSortType) {
      case DATE_UP:
        return filteredTasks.sort(sortTasksUp);
      case DATE_DOWN:
        return filteredTasks.sort(sortTasksDown);
    }

    return filteredTasks;
  }

  _handleViewAction(userAction, updateType, updatedItem) {
    switch (userAction) {
      case UPDATE:
        this._tasksModel.updateTask(updateType, updatedItem);
        break;
      case ADD:
        this._tasksModel.addTask(updateType, updatedItem);
        break;
      case DELETE:
        this._tasksModel.deleteTask(updateType, updatedItem);
        break;
    }
  }

  _handleModelEvent(updateType, updatedItem) {
    switch (updateType) {
      case PATCH:
        this._cardPresenter[updatedItem.id].init(updatedItem);
        break;
      case MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case MAJOR:
        this._clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    this._cardNewPresenter.destroy();
    Object.values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedCardCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, AFTERBEGIN);
  }

  _renderCard(task) {
    const cardPresenter = new CardPresenter(this._cardListComponent, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(task);
    this._cardPresenter[task.id] = cardPresenter;
  }

  _renderCards(tasks) {
    tasks.forEach((task) => this._renderCard(task));
  }

  _renderNoCards() {
    render(this._boardComponent, this._noCardsComponent, AFTERBEGIN);
  }

  _handleLoadButtonClick() {
    const allCardsCount = this._getTasks().length;
    const newRenderedCardCount = Math.min(allCardsCount, this._renderedCardCount + CARD_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedCardCount, newRenderedCardCount);

    this._renderCards(tasks);
    this._renderedCardCount = newRenderedCardCount;

    if (this._renderedCardCount >= allCardsCount) {
      remove(this._loadButtonComponent);
    }
  }

  _renderLoadButton() {
    if (this._loadButtonComponent !== null) {
      this._loadButtonComponent = null;
    }

    this._loadButtonComponent = new LoadButtonView();
    this._loadButtonComponent.setClickHandler(this._handleLoadButtonClick);

    render(this._boardComponent, this._loadButtonComponent);
  }

  _clearBoard({resetRenderedCardCount = false, resetSortType = false} = {}) {
    const allCardsCount = this._getTasks().length;
    this._cardNewPresenter.destroy();
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};

    remove(this._sortComponent);
    remove(this._noCardsComponent);
    remove(this._loadButtonComponent);

    this._renderedCardCount = resetRenderedCardCount ? CARD_COUNT_PER_STEP : Math.min(allCardsCount, this._renderedCardCount);

    if (resetSortType) {
      this._currentSortType = DEFAULT;
    }
  }

  _renderBoard() {
    const tasks = this._getTasks();
    const allCardsCount = tasks.length;

    if (allCardsCount === 0) {
      this._renderNoCards();
      return;
    }

    this._renderSort();
    this._renderCards(tasks.slice(0, Math.min(allCardsCount, this._renderedCardCount)));

    if (allCardsCount > this._renderedCardCount) {
      this._renderLoadButton();
    }
  }
}
