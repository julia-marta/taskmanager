import CardEditView from "../view/card-edit.js";
import CardView from "../view/card.js";
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

const {DEFAULT, EDITING} = Mode;

export default class Card {
  constructor(cardListContainer, changeData, changeMode) {
    this._cardListContainer = cardListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(task) {
    this._task = task;
    const prevCardComponent = this._cardComponent;
    const prevCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardView(task);
    this._cardEditComponent = new CardEditView(task);

    this._cardComponent.setEditClickHandler(this._handleEditClick);
    this._cardComponent.setArchiveClickHandler(this._handleArchiveClick);
    this._cardComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._cardEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevCardComponent === null || prevCardEditComponent === null) {
      render(this._cardListContainer, this._cardComponent);
      return;
    }

    if (this._mode === DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === EDITING) {
      replace(this._cardEditComponent, prevCardEditComponent);
    }

    remove(prevCardComponent);
    remove(prevCardEditComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._cardEditComponent);
  }

  resetView() {
    if (this._mode !== DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _replaceCardToEdit() {
    replace(this._cardEditComponent, this._cardComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = EDITING;
  }

  _replaceEditToCard() {
    replace(this._cardComponent, this._cardEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._cardEditComponent.reset(this._task);
      this._replaceEditToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToEdit();
  }

  _handleArchiveClick() {
    this._changeData(Object.assign({}, this._task, {isArchive: !this._task.isArchive}));
  }

  _handleFavoritesClick() {
    this._changeData(Object.assign({}, this._task, {isFavorite: !this._task.isFavorite}));
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceEditToCard();
  }
}
