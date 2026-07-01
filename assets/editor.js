const titleInput = document.getElementById("postTitle");
const summaryInput = document.getElementById("summary");
const previewTitle = document.getElementById("previewTitle");
const previewSummary = document.getElementById("previewSummary");
const publishButton = document.getElementById("publishButton");
const saveDraft = document.getElementById("saveDraft");
const toast = document.getElementById("publishToast");

function syncPreview() {
  previewTitle.textContent = titleInput.value || "Untitled draft";
  previewSummary.textContent = summaryInput.value || "Add a short summary before publishing.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

titleInput.addEventListener("input", syncPreview);
summaryInput.addEventListener("input", syncPreview);
saveDraft.addEventListener("click", () => showToast("Draft saved locally."));
publishButton.addEventListener("click", () => showToast("Published to personal site preview."));

syncPreview();
