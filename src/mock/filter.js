import {isTaskExpired, isTaskRepeating} from "../utils.js";

const isTaskArchived = (task) => {
  return task.isArchive;
};

const isTaskOverdue = (task) => {
  return !isTaskArchived(task) && isTaskExpired(task.dueDate);
};

const isTaskToday = (task) => {
  return !isTaskArchived(task) && isTaskExpired(task.dueDate, true);
};

const isTaskFavorite = (task) => {
  return !isTaskArchived(task) && task.isFavorite;
};

const isTaskRepeat = (task) => {
  return !isTaskArchived(task) && isTaskRepeating(task.repeatingDays);
};

const addFilteredTasksCount = (filter, check) => {
  return (check) ? (filter || 0) + 1 : filter || 0;
};

export const generateFilters = (tasks) => {

  const filters = tasks.reduce((filter, task) => {

    filter.all = addFilteredTasksCount(filter.all, !isTaskArchived(task));
    filter.overdue = addFilteredTasksCount(filter.overdue, isTaskOverdue(task));
    filter.today = addFilteredTasksCount(filter.today, isTaskToday(task));
    filter.favorites = addFilteredTasksCount(filter.favorites, isTaskFavorite(task));
    filter.repeatingDays = addFilteredTasksCount(filter.repeatingDays, isTaskRepeat(task));
    filter.archive = addFilteredTasksCount(filter.archive, isTaskArchived(task));

    return filter;
  }, {});

  return Object.entries(filters).map(([filterTitle, tasksCount]) => {
    return {
      title: filterTitle,
      count: tasksCount
    };
  });
};
