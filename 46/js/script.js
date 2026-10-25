// ========================================
// STUDENT FORM
// ========================================

const semesterTabs = document.querySelectorAll(".semester-tab");
const semesterPanels = document.querySelectorAll(".semester-panel");

semesterTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        const selectedSemester = tab.dataset.semester;

        semesterTabs.forEach(function(item) {
            const isSelected = item === tab;
            item.classList.toggle("active", isSelected);
            item.setAttribute("aria-selected", isSelected);
        });

        semesterPanels.forEach(function(panel) {
            const isSelected = panel.id === selectedSemester;
            panel.hidden = !isSelected;
            panel.classList.toggle("active", isSelected);
        });
    });
});

const form =
    document.getElementById("studentForm");

const formMessage =
    document.getElementById("formMessage");


// ========================================
// VALIDATE FUNCTION
// ========================================

function validateForm() {

    const name =
        document.getElementById("name").value.trim();

    const rollNo =
        document.getElementById("rollNo").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    const bloodGroup =
        document.getElementById("bloodGroup").value;

    const company =
        document.getElementById("company").value;


    // Name validation

    if (name === "") {

        showMessage(
            "Please enter your name.",
            "error"
        );

        return false;
    }


    // Roll number validation

    if (rollNo === "") {

        showMessage(
            "Please enter your roll number.",
            "error"
        );

        return false;
    }


    // Email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return false;
    }


    // Phone validation

    const phonePattern =
        /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return false;
    }


    // Gender validation

    if (!gender) {

        showMessage(
            "Please select your gender.",
            "error"
        );

        return false;
    }


    // Blood group validation

    if (bloodGroup === "") {

        showMessage(
            "Please select your blood group.",
            "error"
        );

        return false;
    }


    // Company validation

    if (company === "") {

        showMessage(
            "Please select an interested company.",
            "error"
        );

        return false;
    }


    return true;
}


// ========================================
// FORM SUBMIT
// ========================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    if (validateForm()) {

        showMessage(
            "Form submitted successfully!",
            "success"
        );

    }

});


// ========================================
// VALIDATE BUTTON
// ========================================

const validateButton =
    document.getElementById("validateButton");


validateButton.addEventListener(
    "click",
    function() {

        if (validateForm()) {

            showMessage(
                "All entered details are valid!",
                "success"
            );

        }

    }
);


// ========================================
// RESET BUTTON
// ========================================

const resetButton =
    document.getElementById("resetButton");


resetButton.addEventListener(
    "click",
    function() {

        showMessage(
            "Form has been reset.",
            "success"
        );

    }
);


// ========================================
// MESSAGE FUNCTION
// ========================================

function showMessage(message, type) {

    formMessage.textContent = message;

    if (type === "success") {

        formMessage.style.color = "green";

    } else {

        formMessage.style.color = "red";

    }

}
