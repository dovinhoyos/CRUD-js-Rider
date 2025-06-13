import {
  getLessons,
  addLesson,
  updateLesson,
  isDuplicateTitle,
  deleteLesson,
} from "./data.js";
import {
  renderTable,
  fillForm,
  resetForm,
  setEditIndex,
  getEditIndex,
  showError,
  clearErrors,
  showDeleteModal,
} from "./ui.js";

const lessonForm = document.getElementById("lessonForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

lessonForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const index = getEditIndex();

  // Validaciones:
  if (title.length < 3) {
    titleInput.classList.add("error");
    showError("El título debe tener al menos 3 caracteres.");
    return;
  }

  if (description.length < 3) {
    descriptionInput.classList.add("error");
    showError("La descripción debe tener al menos 3 caracteres.");
    return;
  }

  if (isDuplicateTitle(title, index !== null ? parseInt(index) : null)) {
    showError("Ya existe una lección con este título.");
    return;
  }

  // Guardar
  if (index === null) {
    addLesson({ title, description });
  } else {
    updateLesson(index, { title, description });
  }

  resetForm();
  renderTable(handleEdit);
});

// Limpiar error al escribir:
titleInput.addEventListener("input", clearErrors);
descriptionInput.addEventListener("input", clearErrors);

const handleEdit = (index) => {
  const lesson = getLessons()[index];
  fillForm(lesson);
  setEditIndex(index);
};

const handleDelete = (index) => {
  showDeleteModal(index, (confirmedIndex) => {
    deleteLesson(confirmedIndex);
    renderTable(handleEdit, handleDelete);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderTable(handleEdit, handleDelete);
});
