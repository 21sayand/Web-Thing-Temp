const form = document.querySelector("#profile-form");
const status = document.querySelector("#form-status");
const profileFields = ["name", "registerNumber", "email", "phone", "gender", "bloodGroup", "cgpa", "sgpa", "company", "about"];

function updatePreview() {
  const values = new FormData(form);

  for (const field of profileFields) {
    const target = document.querySelector(`[data-profile="${field}"]`);
    if (!target) continue;

    const value = String(values.get(field) || "").trim();
    target.textContent = value || (field === "name" ? "Yadu Dev M" : field === "about" ? "Add a short introduction to complete this section." : field === "cgpa" || field === "sgpa" ? "—" : "Not added");
  }

  for (const group of ["skills", "activities"]) {
    const list = document.querySelector(`[data-profile-list="${group}"]`);
    const selected = values.getAll(group).map(value => String(value));
    list.replaceChildren();

    if (selected.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-tag";
      empty.textContent = "Not added";
      list.append(empty);
      continue;
    }

    for (const value of selected) {
      const item = document.createElement("li");
      item.textContent = value;
      list.append(item);
    }
  }
}

form.addEventListener("input", () => {
  status.textContent = "";
  updatePreview();
});

form.addEventListener("change", updatePreview);
form.addEventListener("reset", () => {
  status.textContent = "Entered details cleared.";
  window.setTimeout(updatePreview);
});

document.querySelector("#print-profile").addEventListener("click", () => {
  updatePreview();
  window.print();
});

updatePreview();
