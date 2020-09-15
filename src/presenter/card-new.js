import CardEditView from "../view/card-edit.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {ADD} = UserAction;
const {MINOR} = UpdateType;

export default class CardNew {
  constructor(cardListContainer, changeData) {
    this._cardListContainer = cardListContainer;
    this._changeData = changeData;
    this._cardEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._resetMenu = callback;
    if (this._cardEditComponent !== null) {
      return;
    }

    this._cardEditComponent = new CardEditView();
    this._cardEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._cardEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._cardListContainer, this._cardEditComponent, AFTERBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._cardEditComponent === null) {
      return;
    }

    if (this._resetMenu !== null) {
      this._resetMenu();
    }

    remove(this._cardEditComponent);
    this._cardEditComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._cardEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._cardEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._cardEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(task) {
    this._changeData(ADD, MINOR, task);
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
