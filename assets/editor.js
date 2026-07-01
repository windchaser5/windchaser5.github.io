const titleInput = document.getElementById("postTitle");
const summaryInput = document.getElementById("summary");
const previewTitle = document.getElementById("previewTitle");
const previewSummary = document.getElementById("previewSummary");
const publishButton = document.getElementById("publishButton");
const saveDraft = document.getElementById("saveDraft");
const toast = document.getElementById("publishToast");
const previewMeta = document.getElementById("previewMeta");
const formatInput = document.getElementById("formatInput");
const tagsInput = document.getElementById("tagsInput");
const templateButtons = document.querySelectorAll(".template-chip");

const templates = {
  case: {
    format: "Project Case",
    tags: "Enterprise AI, Knowledge Ops, RAG",
    title: "AI-native knowledge operations for a complex service organization",
    summary: "A project case on turning fragmented enterprise knowledge into an AI-native operating loop with retrieval, review, and governance built in.",
    body: `Context
The organization had valuable knowledge spread across documents, team habits, and expert memory. The AI opportunity was not simply search; it was a chance to redesign how knowledge became reusable operating leverage.

Problem
Teams needed faster answers, but leaders also needed traceability, source quality, ownership, and a clear escalation path when AI confidence was low.

Approach
I framed the project as an operating loop: source governance, retrieval design, review checkpoints, feedback capture, and adoption measurement.

Takeaway
Enterprise AI-native transformation works when the system changes how decisions flow, not just how information is retrieved.`
  },
  perspective: {
    format: "Perspective",
    tags: "AI-native Transformation, Strategy",
    title: "AI-native transformation is a workflow problem before it is a model problem",
    summary: "A point of view on why enterprise AI adoption depends on decision rights, handoffs, governance, and measurable operating loops.",
    body: `Thesis
Most enterprise AI efforts stall because they treat AI as a feature rollout rather than an operating model redesign.

Observation
The model can generate useful outputs, but adoption depends on who trusts it, who reviews it, who owns exceptions, and how the workflow changes after the answer appears.

Implication
The highest-leverage AI-native projects start with workflow diagnosis, not tool selection.

Takeaway
If AI does not change decision speed, accountability, or institutional memory, it is probably still a pilot.`
  },
  memo: {
    format: "Client Memo",
    tags: "Enterprise AI, Advisory, Roadmap",
    title: "Where to start an enterprise AI-native transformation",
    summary: "A concise client-facing memo for choosing the first AI-native initiative with enough leverage, adoption surface, and risk control.",
    body: `Executive summary
The best first AI-native initiative is rarely the flashiest demo. It is the workflow where better information, faster decisions, and clear review loops can compound.

Recommended filter
1. High-frequency workflow
2. Expensive human bottleneck
3. Clear source-of-truth problem
4. Reviewable output
5. Measurable business impact

Suggested next step
Run a two-week workflow diagnostic and produce a ranked pilot portfolio with risks, owners, and adoption metrics.`
  }
};

function syncPreview() {
  previewTitle.textContent = titleInput.value || "Untitled draft";
  previewSummary.textContent = summaryInput.value || "Add a short summary before publishing.";
  previewMeta.textContent = `2026.07 · ${formatInput.value || "Draft"}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

titleInput.addEventListener("input", syncPreview);
summaryInput.addEventListener("input", syncPreview);
formatInput.addEventListener("input", syncPreview);
saveDraft.addEventListener("click", () => showToast("Draft saved locally."));
publishButton.addEventListener("click", () => showToast("Published to personal site preview."));

templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    templateButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const template = templates[button.dataset.template];
    formatInput.value = template.format;
    tagsInput.value = template.tags;
    titleInput.value = template.title;
    summaryInput.value = template.summary;
    document.getElementById("bodyCopy").value = template.body;
    syncPreview();
    showToast(`${template.format} template loaded.`);
  });
});

syncPreview();
