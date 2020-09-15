import TasksModel from "../model/tasks.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

const {GET, PUT, POST, DELETE} = Method;
const {MIN, MAX} = SuccessHTTPStatusRange;

export default class Api {
  constructor(serverName, authorization) {
    this._serverName = serverName;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(Api.toJSON)
      .then((tasks) => tasks.map(TasksModel.adaptToClient));
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: PUT,
      body: JSON.stringify(TasksModel.adaptToServer(task)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(TasksModel.adaptToClient);
  }

  addTask(task) {
    return this._load({
      url: `tasks`,
      method: POST,
      body: JSON.stringify(TasksModel.adaptToServer(task)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(TasksModel.adaptToClient);
  }

  deleteTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `tasks/sync`,
      method: POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._serverName}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < MIN && response.status > MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }
}
