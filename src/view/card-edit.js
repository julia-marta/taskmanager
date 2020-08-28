import he from "he";
import SmartView from "./smart.js";
import {COLORS} from "../const.js";
import {isTaskRepeating, formatTaskDueDate} from "../utils/task.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createCardEditDateMarkup = (dueDate, isDueDate) => {
  return `<button class="card__date-deadline-toggle" type="button">
    date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>
    ${isDueDate ?
    `<fieldset class="card__date-deadline">
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${formatTaskDueDate(dueDate)}"
      />
    </label>
  </fieldset>` : ``}`;
};

const createCardEditRepeatingMarkup = (repeating, isRepeating) => {

  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>
    ${isRepeating ?
    `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">

    ${Object.entries(repeating).map(([day, repeat]) =>
    `<input class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
        />
      <label class="card__repeat-day" for="repeat-${day}">
      ${day}</label>`).join(``)}
      </div>
      </fieldset>`
    : ``}`;
};

const createCardEditColorsMarkup = (currentColor) => {

  return COLORS.map((color) =>
    `<input type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
    />
  <label for="color-${color}" class="card__color card__color--${color}">
  ${color}</label>`).join(``);
};

const createCardEditMarkup = (data) => {
  const {color, description, dueDate, repeating, isDueDate, isRepeating} = data;
  const repeatClassName = isRepeating ? `card--repeat` : ``;
  const dateMarkup = createCardEditDateMarkup(dueDate, isDueDate);
  const repeatMarkup = createCardEditRepeatingMarkup(repeating, isRepeating);
  const colorsMarkup = createCardEditColorsMarkup(color);
  const isSubmitDisabled = (isDueDate && dueDate === null) || (isRepeating && !isTaskRepeating(repeating));

  return (
    `<article class="card card--edit card--${color} ${repeatClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${he.encode(description)}</textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateMarkup}

                ${repeatMarkup}
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>
          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSubmitDisabled ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class CardEdit extends SmartView {
  constructor(task = Object.assign({}, BLANK_TASK)) {
    super();
    this._data = CardEdit.parseTaskToData(task);
    this._datepicker = null;
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._removeDatepicker();
    }
  }

  reset(task) {
    this.updateData(CardEdit.parseTaskToData(task));
  }

  getTemplate() {
    return createCardEditMarkup(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._removeDatepicker();
    }

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler
          }
      );
    }
  }

  _removeDatepicker() {
    this._datepicker.destroy();
    this._datepicker = null;
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({description: evt.target.value}, true);
  }

  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false
    });
  }

  _dueDateChangeHandler([userDate]) {
    userDate.setHours(23, 59, 59, 999);

    this.updateData({
      dueDate: userDate
    });
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false
    });
  }

  _repeatingChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      repeating: Object.assign({}, this._data.repeating, {[evt.target.value]: evt.target.checked})
    });
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({color: evt.target.value});
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(CardEdit.parseDataToTask(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(CardEdit.parseDataToTask(this._data));
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.card__text`).addEventListener(`input`, this._descriptionInputHandler);
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._dueDateToggleHandler);
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._repeatingToggleHandler);
    if (this._data.isRepeating) {
      this.getElement().querySelector(`.card__repeat-days-inner`).addEventListener(`change`, this._repeatingChangeHandler);
    }
    this.getElement().querySelector(`.card__colors-wrap`).addEventListener(`change`, this._colorChangeHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parseTaskToData(task) {
    const flags = {
      isDueDate: task.dueDate !== null,
      isRepeating: isTaskRepeating(task.repeating)
    };
    return Object.assign({}, task, flags);
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }
}
