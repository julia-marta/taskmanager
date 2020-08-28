import MenuView from "../view/menu.js";
import {render} from "../utils/render.js";

export default class Menu {
  constructor(menuContainer, boardPresenter) {
    this._menuContainer = menuContainer;
    this._boardPresenter = boardPresenter;
    this._menuComponent = new MenuView();

    this._handleAddClick = this._handleAddClick.bind(this);
  }

  init() {
    render(this._menuContainer, this._menuComponent);
    this._menuComponent.setAddCardHandler(this._handleAddClick);
  }

  _handleAddClick() {
    this._boardPresenter.createCard();
  }
}
