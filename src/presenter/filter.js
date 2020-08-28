import FilterView from "../view/filter.js";
import {getFiltersCount} from "../utils/filter.js";
import {render, replace, remove} from "../utils/render.js";
import {UpdateType} from "../const.js";

const {MAJOR} = UpdateType;

export default class Filter {
  constructor(filterContainer, filterModel, tasksModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._tasksModel = tasksModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(MAJOR, filterType);
  }

  _getFilters() {
    const tasks = this._tasksModel.getTasks();
    const filtersCount = getFiltersCount(tasks);

    return Object.entries(filtersCount).map(([filterTitle, tasksCount]) => {
      return {
        type: filterTitle,
        title: filterTitle,
        count: tasksCount
      };
    });
  }
}
