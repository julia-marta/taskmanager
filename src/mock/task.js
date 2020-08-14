import {DESCRIPTIONS, COLORS} from "../const.js";
import {getRandomInteger, getRandomBoolean, getRandomValue} from "../utils.js";

const MAX_DAYS_GUP = 7;

const generateDate = () => {
  const isDate = getRandomBoolean();

  if (!isDate) {
    return null;
  }

  const daysGap = getRandomInteger(-MAX_DAYS_GUP, MAX_DAYS_GUP);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};

const generateRepeating = () => {
  return {
    mo: false,
    tu: false,
    we: getRandomBoolean(),
    th: false,
    fr: getRandomBoolean(),
    sa: false,
    su: false
  };
};

const generateTask = () => {
  const dueDate = generateDate();
  const repeating = (dueDate === null)
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    };

  return {
    description: getRandomValue(DESCRIPTIONS),
    dueDate,
    repeating,
    color: getRandomValue(COLORS),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};

export const generateTasks = (count) => {
  return new Array(count).fill().map(generateTask);
};
