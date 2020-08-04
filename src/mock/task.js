const descriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const colors = [`black`, `yellow`, `blue`, `green`, `pink`];

const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
}

const getRandomIndex = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
}

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

  return new Date(currentDate); // почему здесь возвращается new Date, а не просто currentDate? Ведь мы уже сохранили объект в эту переменную
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
    description: getRandomIndex(descriptions),
    dueDate,
    repeatingDays,
    color: getRandomIndex(colors),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};

export const generateTasks = (count) => {
  return new Array(count).fill().map(generateTask);
};
