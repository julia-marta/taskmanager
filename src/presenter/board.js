import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import CardListView from "../view/card-list.js";
import NoCardsView from "../view/no-cards.js";
import LoadButtonView from "../view/load-button.js";
import CardPresenter from "./card.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortTasksUp, sortTasksDown} from "../utils/task.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {DEFAULT, DATE_DOWN, DATE_UP} = SortType;
const CARD_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;
    this._currentSortType = DEFAULT;
    this._cardPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortingView();
    this._cardListComponent = new CardListView();
    this._noCardsComponent = new NoCardsView();
    this._loadButtonComponent = new LoadButtonView();

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadButtonClick = this._handleLoadButtonClick.bind(this);
  }

  init(tasks) {
    this._tasks = tasks.slice();
    this._defaultTasks = tasks.slice();
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardListComponent);

    this._renderBoard();
  }

  _handleModeChange() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._tasks = updateItem(this._tasks, updatedTask);
    this._defaultTasks = updateItem(this._defaultTasks, updatedTask);
    this._cardPresenter[updatedTask.id].init(updatedTask);
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case DATE_UP:
        this._tasks.sort(sortTasksUp);
        break;
      case DATE_DOWN:
        this._tasks.sort(sortTasksDown);
        break;
      default:
        this._tasks = this._defaultTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearCardList();
    this._renderCardList();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderCard(task) {
    const cardPresenter = new CardPresenter(this._cardListComponent, this._handleTaskChange, this._handleModeChange);
    cardPresenter.init(task);
    this._cardPresenter[task.id] = cardPresenter;
  }

  _renderCards(min, max) {
    this._tasks.slice(min, max)
    .forEach((task) => this._renderCard(task));
  }

  _renderNoCards() {
    render(this._boardComponent, this._noCardsComponent, AFTERBEGIN);
  }

  _handleLoadButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + CARD_COUNT_PER_STEP);
    this._renderedCardCount += CARD_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._tasks.length) {
      remove(this._loadButtonComponent);
    }
  }

  _renderLoadButton() {
    render(this._boardComponent, this._loadButtonComponent);
    this._loadButtonComponent.setClickHandler(this._handleLoadButtonClick);
  }

  _clearCardList() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedCardCount = CARD_COUNT_PER_STEP;
  }

  _renderCardList() {
    this._renderCards(0, Math.min(this._tasks.length, CARD_COUNT_PER_STEP));
    if (this._tasks.length > CARD_COUNT_PER_STEP) {
      this._renderLoadButton();
    }
  }

  _renderBoard() {
    if (this._tasks.every((task) => task.isArchive)) {
      this._renderNoCards();
      return;
    }

    this._renderSort();
    this._renderCardList();
  }
}
