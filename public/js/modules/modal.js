export function openModal({
  title,
  bodyHTML,
  onConfirm,
  confirmLabel = "Save",
  confirmClass = "btn-primary",
}) {
  const overlay = document.getElementById("modal-overlay");

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">
        ${bodyHTML}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button class="btn ${confirmClass}" id="modal-confirm-btn">${confirmLabel}</button>
      </div>
    </div>
  `;

  overlay.classList.remove("hidden");

  document.getElementById("modal-close-btn").onclick = closeModal;
  document.getElementById("modal-cancel-btn").onclick = closeModal;
  document.getElementById("modal-confirm-btn").onclick = async () => {
    await onConfirm();
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
}

export function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("hidden");
  overlay.innerHTML = "";
}
