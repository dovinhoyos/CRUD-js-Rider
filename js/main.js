import {
  getLessons,
  addLesson,
  updateLesson,
  isDuplicateTitle,
  deleteLesson,
} from "./data.js";

import {
  renderTable,
  openFormModal,
  closeFormModal,
  getFormMode,
  getEditIndex,
  showError,
  clearErrors,
  showDeleteModal,
} from "./ui.js";

// Elementos del formulario dentro del modal
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const lessonForm = document.getElementById("lessonForm");
const openFormBtn = document.getElementById("openFormModal");
const cancelFormBtn = document.getElementById("cancelFormBtn");

// 👉 Abrir el modal en modo "agregar"
openFormBtn.addEventListener("click", () => openFormModal("add"));

// 👉 Cancelar y cerrar modal
cancelFormBtn.addEventListener("click", closeFormModal);

// 👉 Guardar desde el modal (agregar o editar)
lessonForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const mode = getFormMode();
  const index = getEditIndex();

  // Validaciones pro
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

  // Crear o editar
  if (mode === "add") {
    addLesson({ title, description });
  } else {
    updateLesson(index, { title, description });
  }

  closeFormModal();
  renderTable(handleEdit, handleDelete);
});

// 👉 Editar lección desde tabla
function handleEdit(index) {
  const lesson = getLessons()[index];
  openFormModal("edit", index, lesson);
}

// 👉 Eliminar con modal de confirmación
function handleDelete(index) {
  showDeleteModal(index, (confirmedIndex) => {
    deleteLesson(confirmedIndex);
    renderTable(handleEdit, handleDelete);
  });
}

// 👉 Al iniciar la app, renderizar la tabla
document.addEventListener("DOMContentLoaded", () => {
  renderTable(handleEdit, handleDelete);
});

// 👉 Limpiar errores visuales al escribir
[titleInput, descriptionInput].forEach((input) =>
  input.addEventListener("input", clearErrors),
);
