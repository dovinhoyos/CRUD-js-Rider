import { getLessons, deleteLesson } from "./data.js";

const tableBody = document.querySelector("#lessonTable tbody");
const formModal = document.getElementById("form-modal-overlay");
const formTitle = document.getElementById("form-title");
const openFormBtn = document.getElementById("openFormModal");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const lessonForm = document.getElementById("lessonForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

// Estado interno del formulario
let formMode = "add"; // o 'edit'
let currentIndex = null;

// 👉 Modal de Confirmación para eliminar
const modalOverlay = document.getElementById("modal-overlay");
const confirmBtn = document.getElementById("confirm-delete");
const cancelBtn = document.getElementById("cancel-delete");

let pendingDeleteIndex = null;
let confirmCallback = null;

// 👉 Error visual
let errorContainer = document.createElement("div");
errorContainer.className = "error-container";
lessonForm.insertBefore(errorContainer, lessonForm.firstChild);

// 🚀 Render de la tabla
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

  // Editar
  tableBody.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      editCallback(parseInt(btn.dataset.index));
    });
  });

  // Eliminar
  tableBody.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof deleteCallback === "function") {
        deleteCallback(parseInt(btn.dataset.index));
      }
    });
  });
};

// 🧊 Modal de formulario: abrir
export const openFormModal = (mode = "add", index = null, lesson = null) => {
  formMode = mode;
  currentIndex = index;
  formTitle.textContent = mode === "add" ? "Agregar Lección" : "Editar Lección";

  if (lesson) {
    titleInput.value = lesson.title;
    descriptionInput.value = lesson.description;
  } else {
    lessonForm.reset();
  }

  clearErrors();
  formModal.classList.add("show");
};

// ❌ Modal de formulario: cerrar
export const closeFormModal = () => {
  formModal.classList.remove("show");
  currentIndex = null;
  formMode = "add";
  lessonForm.reset();
  clearErrors();
};

// ⚡ Getters para estado del form
export const getFormMode = () => {
  return formMode;
};

export const getEditIndex = () => {
  return currentIndex;
};

// 🧽 Limpiar errores visuales
export const clearErrors = () => {
  errorContainer.textContent = "";
  errorContainer.classList.remove("show");
  titleInput.classList.remove("error");
  descriptionInput.classList.remove("error");
};

// 🚨 Mostrar error visual
export const showError = (message) => {
  errorContainer.textContent = message;
  errorContainer.classList.add("show");

  // Marcamos los inputs con error según contexto
  if (message.toLowerCase().includes("título")) {
    document.getElementById("title").classList.add("error");
  }
  if (message.toLowerCase().includes("descripción")) {
    document.getElementById("description").classList.add("error");
  }
};

// 🗑️ Modal de confirmación de eliminación
export const showDeleteModal = (index, callback) => {
  pendingDeleteIndex = index;
  confirmCallback = callback;
  modalOverlay.classList.add("show");
};

// Confirmar eliminación
confirmBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  if (confirmCallback && pendingDeleteIndex !== null) {
    confirmCallback(pendingDeleteIndex);
  }
  pendingDeleteIndex = null;
  confirmCallback = null;
});

// Cancelar eliminación
cancelBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  pendingDeleteIndex = null;
  confirmCallback = null;
});
