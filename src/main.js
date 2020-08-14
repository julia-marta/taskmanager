import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortingView from "./view/sorting.js";
import CardListView from "./view/card-list.js";
import CardEditView from "./view/card-edit.js";
import CardView from "./view/card.js";
import LoadButtonView from "./view/load-button.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {RenderPosition, render} from "./utils.js";

const {AFTERBEGIN} = RenderPosition;
const ESC_KEY = `Escape` || `Esc`;
const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 8;

const tasks = generateTasks(CARD_COUNT);
const filters = generateFilters(tasks);

const mainPage = document.querySelector(`.main`);
const header = mainPage.querySelector(`.main__control`);

render(header, new MenuView().getElement());
render(mainPage, new FilterView(filters).getElement());

const boardComponent = new BoardView();
const cardListComponent = new CardListView();

render(mainPage, boardComponent.getElement());
render(boardComponent.getElement(), new SortingView().getElement(), AFTERBEGIN);
render(boardComponent.getElement(), cardListComponent.getElement());

const renderCard = (task) => {
  const cardComponent = new CardView(task);
  const cardEditComponent = new CardEditView(task);
  const cardList = cardListComponent.getElement();

  const replaceCardToEdit = () => {
    cardList.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const replaceEditToCard = () => {
    cardList.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_KEY) {
      evt.preventDefault();
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  cardComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  cardEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(cardList, cardComponent.getElement());
}

for (let i = 0; i < Math.min(tasks.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(tasks[i]);
}

if (tasks.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  const loadButtonComponent = new LoadButtonView();
  render(boardComponent.getElement(), loadButtonComponent.getElement());

  const onLoadButtonClick = (evt) => {
    evt.preventDefault();
    tasks.slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((task) => renderCard(task));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= tasks.length) {
      loadButtonComponent.getElement().remove();
      loadButtonComponent.removeElement();
    }
  }

  loadButtonComponent.getElement().addEventListener(`click`, onLoadButtonClick);
};
