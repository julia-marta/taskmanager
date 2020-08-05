import {DESCRIPTIONS, COLORS} from "../const.js";
import {getRandomInteger, getRandomBoolean, getRandomIndex} from "../utils.js";

const generateDate = () => {
  const isDate = getRandomBoolean();

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
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
  const repeatingDays = (dueDate === null)
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
    description: getRandomIndex(DESCRIPTIONS),
    dueDate,
    repeatingDays,
    color: getRandomIndex(COLORS),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};

export const generateTasks = (count) => {
  return new Array(count).fill().map(generateTask);
};
