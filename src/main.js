import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortingView from "./view/sorting.js";
import CardListView from "./view/card-list.js";
import NoCardsView from "./view/no-cards.js";
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

const renderCard = (container, task) => {
  const cardComponent = new CardView(task);
  const cardEditComponent = new CardEditView(task);

  const replaceCardToEdit = () => {
    container.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const replaceEditToCard = () => {
    container.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
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

  render(container, cardComponent.getElement());
};

const renderBoard = (container, tasks) => {
  const boardComponent = new BoardView();
  const cardListComponent = new CardListView();

  const renderCards = (min, max) => {
    tasks.slice(min, max)
    .forEach((task) => renderCard(cardListComponent.getElement(), task))
  }

  render(container, boardComponent.getElement());
  render(boardComponent.getElement(), cardListComponent.getElement());

  if (tasks.length === 0 || tasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoCardsView().getElement(), AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortingView().getElement(), AFTERBEGIN);
  renderCards(0, Math.min(tasks.length, CARD_COUNT_PER_STEP));

  if (tasks.length > CARD_COUNT_PER_STEP) {
    let renderedCardCount = CARD_COUNT_PER_STEP;

    const loadButtonComponent = new LoadButtonView();
    render(boardComponent.getElement(), loadButtonComponent.getElement());

    const onLoadButtonClick = (evt) => {
      evt.preventDefault();
      renderCards(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP);

      renderedCardCount += CARD_COUNT_PER_STEP;

      if (renderedCardCount >= tasks.length) {
        loadButtonComponent.getElement().remove();
        loadButtonComponent.removeElement();
      }
    }

    loadButtonComponent.getElement().addEventListener(`click`, onLoadButtonClick);
  };
};

render(header, new MenuView().getElement());
render(mainPage, new FilterView(filters).getElement());

renderBoard(mainPage, tasks);
