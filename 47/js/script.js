const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Check gender
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Get blood group
    const bloodGroup =
        document.getElementById("bloodGroup").value;

    // Get company
    const company =
        document.getElementById("company").value;

    // Check skills
    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    // Check activities
    const activities = document.querySelectorAll(
        'input[name="activities"]:checked'
    );


    // Validation

    if (!gender) {
        alert("Please select your gender.");
        return;
    }

    if (bloodGroup === "") {
        alert("Please select your blood group.");
        return;
    }

    if (company === "") {
        alert("Please select your interested company.");
        return;
    }

    if (skills.length === 0) {
        alert("Please select at least one skill.");
        return;
    }

    if (activities.length === 0) {
        alert("Please select at least one activity.");
        return;
    }


    // Successful submission

    message.textContent =
        "Student information submitted successfully!";

    message.style.color = "green";

});


form.addEventListener("reset", function () {

    message.textContent = "";

});