const calculateBtn =
    document.getElementById("calculateBtn");

const clearBtn =
    document.getElementById("clearBtn");

const num1Input =
    document.getElementById("num1");

const num2Input =
    document.getElementById("num2");

const operationInput =
    document.getElementById("operation");

const resultBox =
    document.getElementById("resultBox");

const resultElement =
    document.getElementById("result");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");



calculateBtn.addEventListener("click", async () => {

    resultBox.classList.add("hidden");

    errorBox.classList.add("hidden");


    const num1 =
        num1Input.value.trim();

    const num2 =
        num2Input.value.trim();

    const operation =
        operationInput.value;


    // Validate empty inputs

    if (num1 === "" || num2 === "") {

        showError(
            "Please enter both numbers."
        );

        return;
    }


    // Validate operation

    if (operation === "") {

        showError(
            "Please select an operation."
        );

        return;
    }


    const number1 = Number(num1);

    const number2 = Number(num2);


    // Validate numbers

    if (
        !Number.isFinite(number1) ||
        !Number.isFinite(number2)
    ) {

        showError(
            "Please enter valid numbers."
        );

        return;
    }


    // Prevent division/modulus by zero

    if (
        (operation === "divide" ||
         operation === "modulus") &&
        number2 === 0
    ) {

        if (operation === "divide") {

            showError(
                "Cannot divide by zero."
            );

        } else {

            showError(
                "Cannot perform modulus by zero."
            );

        }

        return;
    }


    try {

        const response =
            await fetch("/calculate", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    num1: number1,

                    num2: number2,

                    operation: operation

                })

            });


        const data =
            await response.json();


        if (data.success) {

            resultElement.textContent =
                data.result;

            resultBox.classList.remove(
                "hidden"
            );


            // Formal successful submission confirmation

            showSuccessConfirmation(
                data.result
            );


        } else {

            showError(data.error);

        }

    } catch (error) {

        showError(
            "Unable to connect to the server."
        );

        console.error(error);

    }

});



clearBtn.addEventListener("click", () => {

    num1Input.value = "";

    num2Input.value = "";

    operationInput.value = "";

    resultElement.textContent = "0";

    resultBox.classList.add("hidden");

    errorBox.classList.add("hidden");

});


function showError(message) {

    errorMessage.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );

}


function showSuccessConfirmation(result) {

    // Remove an existing confirmation if present

    const existingOverlay =
        document.querySelector(
            ".success-overlay"
        );

    if (existingOverlay) {
        existingOverlay.remove();
    }



    const overlay =
        document.createElement("div");

    overlay.className =
        "success-overlay";


    // confirmation content

    const content =
        document.createElement("div");

    content.className =
        "success-content";


    content.innerHTML = `

        <div class="success-icon">
            <span class="success-check">✓</span>
        </div>

        <h2 class="success-title">
            Calculation Successful
        </h2>

        <p class="success-message">
            Your calculation has been completed
            successfully. The result has been
            generated and is ready for review.
        </p>

        <div class="success-result">
            <span>Result</span>
            <strong>${escapeHTML(result)}</strong>
        </div>

        <br>

        <button
            type="button"
            class="success-close"
            id="successCloseButton"
        >
            Continue
        </button>

    `;


    overlay.appendChild(content);

    document.body.appendChild(overlay);



    createSuccessParticles();


    // Continue button

    const closeButton =
        document.getElementById(
            "successCloseButton"
        );


    closeButton.addEventListener(
        "click",
        () => {

            closeSuccessConfirmation(
                overlay
            );

        }
    );


    // Automatically close after 4 seconds

    const autoClose =
        setTimeout(() => {

            if (
                document.body.contains(
                    overlay
                )
            ) {

                closeSuccessConfirmation(
                    overlay
                );

            }

        }, 4000);


    // Prevent unused timer reference

    overlay.dataset.timer =
        autoClose;
}


function closeSuccessConfirmation(
    overlay
) {

    overlay.classList.add(
        "fade-out"
    );


    setTimeout(() => {

        if (
            document.body.contains(
                overlay
            )
        ) {

            overlay.remove();

        }

    }, 450);

}


function createSuccessParticles() {

    const particleCount = 22;

    const particleColors = [
        "#d9b8d2",
        "#c5b8e2",
        "#b9d9e8",
        "#ead0b6",
        "#c8dfd5"
    ];


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        setTimeout(() => {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "success-particle";


            // Random position

            particle.style.left =
                Math.random() * 100 +
                "vw";

            particle.style.top =
                55 +
                Math.random() * 35 +
                "vh";


            // Random size

            const size =
                4 +
                Math.random() * 6;

            particle.style.width =
                size + "px";

            particle.style.height =
                size + "px";


            // Random pastel color

            particle.style.background =
                particleColors[
                    Math.floor(
                        Math.random() *
                        particleColors.length
                    )
                ];


            // Slightly different animation

            particle.style.animationDuration =
                2.2 +
                Math.random() * 1.5 +
                "s";


            document.body.appendChild(
                particle
            );


            setTimeout(() => {

                particle.remove();

            }, 4000);

        }, i * 45);

    }

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}