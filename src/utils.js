export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// export const renderTemplate = (container, markup, place = BEFOREEND) => {
//   container.insertAdjacentHTML(place, markup);
// };

export const createElement = (markup) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = markup;

  return newElement.firstElementChild;
};

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export const render = (container, element, place = BEFOREEND) => {
  switch (place) {
    case AFTERBEGIN:
      container.prepend(element);
      break;
    case BEFOREEND:
      container.append(element);
      break;
  }
};

export const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const getRandomValue = (list) => {
  const randomIndex = getRandomInteger(0, list.length - 1);
  return list[randomIndex];
};

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return currentDate;
};

export const isTaskExpired = (dueDate, isToday) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  if (isToday) {
    return currentDate.getTime() === dueDate.getTime();
  } else {
    return currentDate.getTime() > dueDate.getTime();
  }
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const humanizeTaskDueDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`});
};
