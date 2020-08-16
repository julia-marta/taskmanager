import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import CardListView from "../view/card-list.js";
import NoCardsView from "../view/no-cards.js";
import CardEditView from "../view/card-edit.js";
import CardView from "../view/card.js";
import LoadButtonView from "../view/load-button.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";

const {AFTERBEGIN} = RenderPosition;
const CARD_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortingView();
    this._cardListComponent = new CardListView();
    this._noCardsComponent = new NoCardsView();
    this._loadButtonComponent = new LoadButtonView();
    this._handleLoadButtonClick = this._handleLoadButtonClick.bind(this);
  }

  init(tasks) {
    this._tasks = tasks.slice();
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardListComponent);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, AFTERBEGIN);
  }

  _renderCard(task) {
    const cardComponent = new CardView(task);
    const cardEditComponent = new CardEditView(task);

    const replaceCardToEdit = () => {
      replace(cardEditComponent, cardComponent);
    };

    const replaceEditToCard = () => {
      replace(cardComponent, cardEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceEditToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    cardComponent.setEditClickHandler(() => {
      replaceCardToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEditComponent.setFormSubmitHandler(() => {
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._cardListComponent, cardComponent);
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
