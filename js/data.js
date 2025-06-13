let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

export const getLessons = () => {
  console.log(lessons);
  return lessons;
};

export const addLesson = (lesson) => {
  lessons.push(lesson);
  console.log("Lesson added:", lesson);
  saveLessons();
};

export const updateLesson = (index, lesson) => {
  lessons[index] = lesson;
  console.log("Lesson updated:", lesson);
  saveLessons();
};

export const deleteLesson = (index) => {
  lessons.splice(index, 1);
  console.log("Lesson deleted at index:", index);
  saveLessons();
};

const saveLessons = () => {
  localStorage.setItem("lessons", JSON.stringify(lessons));
};

export const isDuplicateTitle = (title, excludeIndex = null) => {
  return lessons.some((lesson, index) => {
    return (
      lesson.title.toLowerCase() === title.toLowerCase() &&
      index !== excludeIndex
    );
  });
};
