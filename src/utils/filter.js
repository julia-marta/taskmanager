import {FilterType} from "../const.js";
import {isTaskExpired, isTaskRepeating} from "./task.js";

const {ALL, OVERDUE, TODAY, FAVORITES, REPEATING, ARCHIVE} = FilterType;

export const filterRules = {
  [ALL]: (task) => !task.isArchive,
  [OVERDUE]: (task) => !task.isArchive && isTaskExpired(task.dueDate),
  [TODAY]: (task) => !task.isArchive && isTaskExpired(task.dueDate, true),
  [FAVORITES]: (task) => !task.isArchive && task.isFavorite,
  [REPEATING]: (task) => !task.isArchive && isTaskRepeating(task.repeating),
  [ARCHIVE]: (task) => task.isArchive
};

const addFilteredTasksCount = (filter, rule) => {
  return (rule) ? (filter || 0) + 1 : filter || 0;
};

export const getFiltersCount = (tasks) => tasks.reduce((filter, task) => {
  filter[ALL] = addFilteredTasksCount(filter[ALL], filterRules[ALL](task));
  filter[OVERDUE] = addFilteredTasksCount(filter[OVERDUE], filterRules[OVERDUE](task));
  filter[TODAY] = addFilteredTasksCount(filter[TODAY], filterRules[TODAY](task));
  filter[FAVORITES] = addFilteredTasksCount(filter[FAVORITES], filterRules[FAVORITES](task));
  filter[REPEATING] = addFilteredTasksCount(filter[REPEATING], filterRules[REPEATING](task));
  filter[ARCHIVE] = addFilteredTasksCount(filter[ARCHIVE], filterRules[ARCHIVE](task));

  return filter;
}, {});
