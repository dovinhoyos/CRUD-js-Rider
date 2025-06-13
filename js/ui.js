import { getLessons, deleteLesson } from "./data.js";

const tableBody = document.querySelector("#lessonTable tbody");
const formButton = document.querySelector("#lessonForm button");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const form = document.getElementById("lessonForm");

const modalOverlay = document.getElementById("modal-overlay");
const confirmBtn = document.getElementById("confirm-delete");
const cancelBtn = document.getElementById("cancel-delete");

// Creamos el contenedor de errores:
let errorContainer = document.createElement("div");
errorContainer.className = "error-container";
form.insertBefore(errorContainer, form.firstChild);

let editIndex = null;
let pendingDeleteIndex = null;
let confirmCallback = null;

export const renderTable = (editCallback, deleteCallback) => {
  tableBody.innerHTML = "";

  getLessons().forEach((lesson, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lesson.title}</td>
      <td>${lesson.description}</td>
      <td>
        <button class="action-btn edit" data-index="${index}">Editar</button>
        <button class="action-btn delete" data-index="${index}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  tableBody.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      editCallback(parseInt(btn.dataset.index));
    });
  });

  tableBody.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof deleteCallback === "function") {
        deleteCallback(parseInt(btn.dataset.index));
      }
    });
  });
};

export const fillForm = (lesson) => {
  titleInput.value = lesson.title;
  descriptionInput.value = lesson.description;
  formButton.textContent = "Actualizar Lección";
};

export const resetForm = () => {
  titleInput.value = "";
  descriptionInput.value = "";
  formButton.textContent = "Agregar Lección";
  editIndex = null;
  clearErrors();
};

export const setEditIndex = (index) => {
  editIndex = index;
};

export const getEditIndex = () => {
  return editIndex;
};

export const showError = (message) => {
  errorContainer.textContent = message;
  errorContainer.classList.add("show");
};

export const clearErrors = () => {
  const errorContainer = document.querySelector(".error-container");
  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.remove("show");
  }

  // También limpiamos estilos visuales
  document.getElementById("title")?.classList.remove("error");
  document.getElementById("description")?.classList.remove("error");
};

export const showDeleteModal = (index, callback) => {
  pendingDeleteIndex = index;
  confirmCallback = callback;
  modalOverlay.classList.add("show");
};

confirmBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  if (confirmCallback && pendingDeleteIndex !== null) {
    confirmCallback(pendingDeleteIndex);
  }
  pendingDeleteIndex = null;
  confirmCallback = null;
});

cancelBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  pendingDeleteIndex = null;
  confirmCallback = null;
});
