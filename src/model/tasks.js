import Observer from "../utils/observer.js";

export default class Tasks extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  setTasks(updateType, tasks) {
    this._tasks = tasks.slice();
    this._notify(updateType);
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(updateType, updatedItem) {
    const index = this._tasks.findIndex((task) => task.id === updatedItem.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._tasks = [...this._tasks.slice(0, index), updatedItem, ...this._tasks.slice(index + 1)];
    this._notify(updateType, updatedItem);
  }

  addTask(updateType, updatedItem) {
    this._tasks = [updatedItem, ...this._tasks];
    this._notify(updateType, updatedItem);
  }

  deleteTask(updateType, updatedItem) {
    const index = this._tasks.findIndex((task) => task.id === updatedItem.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
    this._notify(updateType);
  }

  static adaptToClient(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          dueDate: task.due_date !== null ? new Date(task.due_date) : task.due_date,
          repeating: task.repeating_days,
          isArchive: task.is_archived,
          isFavorite: task.is_favorite,
        }
    );
    delete adaptedTask.due_date;
    delete adaptedTask.repeating_days;
    delete adaptedTask.is_archived;
    delete adaptedTask.is_favorite;

    return adaptedTask;
  }

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          "due_date": task.dueDate instanceof Date ? task.dueDate.toISOString() : null,
          "repeating_days": task.repeating,
          "is_archived": task.isArchive,
          "is_favorite": task.isFavorite,
        }
    );

    delete adaptedTask.dueDate;
    delete adaptedTask.repeating;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;

    return adaptedTask;
  }
}
