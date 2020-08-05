import {isTaskExpired, isTaskRepeating} from "../utils.js";

const taskToFilterMap = {
  all: (tasks) => tasks.filter(task => !task.isArchive).length,
  overdue: (tasks) => tasks.filter(task => !task.isArchive)
    .filter(task => isTaskExpired(task.dueDate)).length,
  today: (tasks) => tasks.filter(task => !task.isArchive)
    .filter(task => isTaskExpired(task.dueDate, true)).length,
  favorites: (tasks) => tasks.filter(task => !task.isArchive)
    .filter(task => task.isFavorite).length,
  repeating: (tasks) => tasks.filter(task => !task.isArchive)
    .filter(task => isTaskRepeating(task.repeatingDays)).length,
  archive: (tasks) => tasks.filter(task => task.isArchive).length
};

export const generateFilters = () => {
  return Object.entries(taskToFilterMap).map(([filterName, tasksCount]) => {
    return {
      name: filterName,
      count: tasksCount(tasks),
    };
  });
}
