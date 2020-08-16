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
