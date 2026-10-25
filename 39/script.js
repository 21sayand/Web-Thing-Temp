const $ = s => document.querySelector(s);
const SKILLS = ["Java","Python","C / C++","JavaScript","SQL","HTML & CSS","Data Structures","Communication","Problem Solving","Teamwork"];
const ACTS = ["NSS Volunteer","Blood Donation Camp","Sports","Cultural Club","Coding Club","Technical Fest","Debate / Quiz","Community Service"];
const SUBJECTS = [["Data Structures",17,16,9],["Database Systems",15,18,8],["Operating Systems",16,14,9],["Computer Networks",18,17,10],["Software Engineering",14,16,8]];
const SGPAS = [8.2,8.5,8.8,9.0,8.7,9.1];

// Build dynamic parts
const mkChecks = (id, list) => $(id).innerHTML = list.map(t =>
  `<label class="opt"><input type="checkbox" value="${t}"><span>${t}</span></label>`).join("");
mkChecks("#skills", SKILLS); mkChecks("#acts", ACTS);
$("#gpaTable tbody").innerHTML = SGPAS.map((v,i) =>
  `<tr><td>Semester ${i+1}</td><td><input type="number" class="sg" min="0" max="10" step="0.01" value="${v}"></td><td class="cg">0.00</td></tr>`).join("");
$("#intTable tbody").innerHTML = SUBJECTS.map(([s,a,b,c]) =>
  `<tr><td>${s}</td><td><input type="number" class="m" data-max="20" min="0" max="20" value="${a}"></td>
   <td><input type="number" class="m" data-max="20" min="0" max="20" value="${b}"></td>
   <td><input type="number" class="m" data-max="10" min="0" max="10" value="${c}"></td><td class="tot">0</td></tr>`).join("");

const DEFAULT_PHOTO = $("#photoPreview").src;
const val = id => $(id).value.trim();
const checked = sel => [...document.querySelectorAll(sel + " input:checked")].map(i => i.value);

// Calculations
function calcAcademics(){
  let sum = 0, n = 0;
  document.querySelectorAll("#gpaTable tbody tr").forEach(tr => {
    const v = parseFloat(tr.querySelector(".sg").value);
    if (!isNaN(v)) { sum += v; n++; tr.querySelector(".cg").textContent = (sum/n).toFixed(2); }
    else tr.querySelector(".cg").textContent = "—";
  });
  const cgpa = n ? (sum/n).toFixed(2) : "0.00";
  $("#overallCgpa").textContent = cgpa; $("#cCgpa").textContent = cgpa;

  let pct = 0, rows = 0;
  document.querySelectorAll("#intTable tbody tr").forEach(tr => {
    const t = [...tr.querySelectorAll(".m")].reduce((a,i) => a + (parseFloat(i.value)||0), 0);
    tr.querySelector(".tot").textContent = t; pct += t/50*100; rows++;
  });
  const avg = rows ? Math.round(pct/rows) : 0;
  $("#intAvg").textContent = avg + "%"; $("#cInternal").textContent = avg;
}

// Live ID card
function updateCard(){
  $("#cName").textContent = val("#name") || "Your Name";
  $("#cMeta").textContent = [val("#dept"), val("#year")].filter(Boolean).join(" · ") || "Department · Year";
  $("#cRoll").textContent = val("#roll") || "—";
  $("#cGender").textContent = document.querySelector("[name=gender]:checked")?.value || "—";
  $("#cBlood").textContent = val("#blood") || "—";
  $("#cCompany").textContent = val("#company") || "—";
  $("#cChips").innerHTML = [...checked("#skills"), ...checked("#acts")].map(t => `<i>${t}</i>`).join("");
}
$("#profileForm").addEventListener("input", () => { calcAcademics(); updateCard(); $("#count").textContent = $("#about").value.length + " / 240"; });
$("#profileForm").addEventListener("change", updateCard);

// Clamp marks to valid range
document.querySelectorAll(".m, .sg").forEach(i => i.addEventListener("input", () => {
  const max = parseFloat(i.dataset.max || 10);
  if (parseFloat(i.value) > max) i.value = max;
  if (parseFloat(i.value) < 0) i.value = 0;
}));

// Photo preview
$("#photo").addEventListener("change", e => {
  const f = e.target.files[0], err = e.target.parentElement.querySelector(".err");
  err.textContent = "";
  if (!f) return;
  if (!f.type.startsWith("image/")) { err.textContent = "Please choose an image file."; e.target.value = ""; return; }
  if (f.size > 2 * 1024 * 1024) { err.textContent = "Image must be under 2 MB."; e.target.value = ""; return; }
  const r = new FileReader(); r.onload = () => $("#photoPreview").src = r.result; r.readAsDataURL(f);
});

// Validation
const rules = {
  name: [v => /^[A-Za-z][A-Za-z .'-]{2,}$/.test(v), "Enter your full name using letters only."],
  roll: [v => /^[A-Za-z0-9-]{4,}$/.test(v), "Enter a valid roll number (at least 4 characters)."],
  email: [v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Enter a valid email address."],
  phone: [v => /^[6-9]\d{9}$/.test(v), "Enter a 10-digit mobile number starting with 6–9."],
  dob: [v => v && (new Date().getFullYear() - new Date(v).getFullYear()) >= 16 && new Date(v) < new Date(), "Enter a valid date of birth (age 16+)."],
  dept: [v => v, "Select your department."], year: [v => v, "Select your year."],
  blood: [v => v, "Select your blood group."], company: [v => v, "Select a company you are interested in."]
};
function setErr(el, msg){ el.classList.toggle("invalid", !!msg); const e = el.parentElement.querySelector(".err"); if (e) e.textContent = msg || ""; }
function validate(){
  let first = null;
  for (const id in rules) {
    const el = $("#" + id), ok = rules[id][0](el.value.trim());
    setErr(el, ok ? "" : rules[id][1]);
    if (!ok && !first) first = el;
  }
  const g = document.querySelector("[name=gender]:checked");
  $("#genderSet .err").textContent = g ? "" : "Select a gender.";
  if (!g && !first) first = document.querySelector("[name=gender]");
  const noSkill = checked("#skills").length === 0;
  $("#skillErr").textContent = noSkill ? "Select at least one skill." : "";
  if (noSkill && !first) first = document.querySelector("#skills input");
  first?.focus();
  return !first;
}
Object.keys(rules).forEach(id => $("#" + id).addEventListener("blur", () => setErr($("#" + id), rules[id][0](val("#" + id)) ? "" : rules[id][1])));

// Submit / reset / print
$("#profileForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!validate()) return;
  const rows = [["Name",val("#name")],["Roll no.",val("#roll")],["Department",val("#dept")+", "+val("#year")],
    ["CGPA",$("#overallCgpa").textContent],["Internal average",$("#intAvg").textContent],
    ["Target company",val("#company")+(val("#role")?" – "+val("#role"):"")],
    ["Skills",checked("#skills").join(", ")],["Activities",checked("#acts").join(", ")||"None selected"]];
  $("#summary").innerHTML = rows.map(([k,v]) => `<p><b>${k}</b><span>${v}</span></p>`).join("");
  $("#modal").hidden = false; $("#closeModal").focus();
});
$("#closeModal").onclick = () => $("#modal").hidden = true;
document.addEventListener("keydown", e => e.key === "Escape" && ($("#modal").hidden = true));
$("#profileForm").addEventListener("reset", () => setTimeout(() => {
  document.querySelectorAll(".err").forEach(e => e.textContent = "");
  document.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));
  $("#photoPreview").src = DEFAULT_PHOTO; calcAcademics(); updateCard();
}));
$("#printBtn").onclick = () => window.print();
calcAcademics(); updateCard();
