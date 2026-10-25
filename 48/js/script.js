// ---------- DATA ----------
// SGPA values are the real ones. Internal marks are SAMPLE values - edit them.
const semesters = [
    { sem: "S1", sgpa: 7.85, internal: 40 },
    { sem: "S2", sgpa: 7.71, internal: 39 },
    { sem: "S3", sgpa: 7.57, internal: 38 },
    { sem: "S4", sgpa: 8.30, internal: 42 },
    { sem: "S5", sgpa: 6.88, internal: 36 },
    { sem: "S6", sgpa: 7.83, internal: 41 }
];

const marksBody = document.getElementById("marksBody");
const bars = document.getElementById("bars");

// ---------- BUILD TABLE + STATS ----------
let running = 0;
semesters.forEach((s, i) => {
    running += s.sgpa;
    s.cgpa = running / (i + 1);          // cumulative CGPA = average SGPA so far
});

const best = Math.max(...semesters.map(s => s.sgpa));
const lowest = Math.min(...semesters.map(s => s.sgpa));

semesters.forEach(s => {
    const cls = s.sgpa === best ? "top" : (s.sgpa === lowest ? "low" : "");
    marksBody.innerHTML += `
        <tr>
            <td>${s.sem}</td>
            <td class="${cls}">${s.sgpa.toFixed(2)}</td>
            <td>${s.cgpa.toFixed(2)}</td>
            <td>${s.internal}/50</td>
        </tr>`;
    bars.innerHTML += `
        <div class="bar-col">
            <b>${s.sgpa.toFixed(2)}</b>
            <div class="bar" data-h="${(s.sgpa / 10) * 100}"></div>
            <span>${s.sem}</span>
        </div>`;
});

const overall = semesters[semesters.length - 1].cgpa;
const avgInternal = semesters.reduce((a, s) => a + s.internal, 0) / semesters.length;

document.getElementById("cgpaStat").textContent = overall.toFixed(2);
document.getElementById("bestStat").textContent = best.toFixed(2);
document.getElementById("latestStat").textContent = semesters[5].sgpa.toFixed(2);
document.getElementById("internalStat").textContent = avgInternal.toFixed(1) + "/50";

// animate bars
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelectorAll(".bar").forEach(b => b.style.height = b.dataset.h + "%");
    }, 150);
});

// ---------- FORM ----------
const form = document.getElementById("studentForm");
const result = document.getElementById("result");
const comments = document.getElementById("comments");

comments.addEventListener("input", () => {
    document.getElementById("counter").textContent = comments.value.length + " / 150";
});

document.getElementById("selectAllBtn").addEventListener("click", () => {
    const boxes = document.querySelectorAll('input[name="skills"]');
    const allChecked = [...boxes].every(b => b.checked);
    boxes.forEach(b => b.checked = !allChecked);
    document.getElementById("selectAllBtn").textContent =
        allChecked ? "Select All Skills" : "Clear Skills";
});

function setError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.parentElement.classList.toggle("has-error", msg !== "");
    return msg === "";
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked');
    const blood = document.getElementById("bloodGroup").value;
    const company = document.getElementById("company").value;
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(x => x.value);
    const acts = [...document.querySelectorAll('input[name="activities"]:checked')].map(x => x.value);

    const checks = [
        setError("genderErr", gender ? "" : "Please select your gender."),
        setError("bloodErr", blood ? "" : "Please select your blood group."),
        setError("companyErr", company ? "" : "Please select an interested company."),
        setError("skillsErr", skills.length ? "" : "Select at least one skill."),
        setError("activitiesErr", acts.length ? "" : "Select at least one activity.")
    ];

    if (checks.includes(false)) {
        result.hidden = true;
        return;
    }

    result.hidden = false;
    result.innerHTML = `
        <h4>Submitted successfully!</h4>
        <p><b>Gender:</b> ${gender.value}</p>
        <p><b>Blood Group:</b> ${blood}</p>
        <p><b>Interested Company:</b> ${company}</p>
        <p><b>Skills:</b> ${skills.join(", ")}</p>
        <p><b>Activities:</b> ${acts.join(", ")}</p>
        ${comments.value.trim() ? `<p><b>Career Goal:</b> ${comments.value.trim().replace(/</g, "&lt;")}</p>` : ""}`;
});

form.addEventListener("reset", () => {
    result.hidden = true;
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));
    document.getElementById("counter").textContent = "0 / 150";
    document.getElementById("selectAllBtn").textContent = "Select All Skills";
});

// clear an error as soon as the user fixes it
form.addEventListener("change", () => {
    if (document.querySelector('input[name="gender"]:checked')) setError("genderErr", "");
    if (document.getElementById("bloodGroup").value) setError("bloodErr", "");
    if (document.getElementById("company").value) setError("companyErr", "");
    if (document.querySelector('input[name="skills"]:checked')) setError("skillsErr", "");
    if (document.querySelector('input[name="activities"]:checked')) setError("activitiesErr", "");
});
