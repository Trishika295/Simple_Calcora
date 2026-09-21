document.addEventListener("DOMContentLoaded", () => {

    const num1Input = document.getElementById("num1");
    const num2Input = document.getElementById("num2");
    const operationInput = document.getElementById("operation");

    const calculateBtn = document.getElementById("calculateBtn");
    const clearBtn = document.getElementById("clearBtn");

    const resultBox = document.getElementById("resultBox");
    const resultElement = document.getElementById("result");

    const errorBox = document.getElementById("errorBox");
    const errorMessage = document.getElementById("errorMessage");


    /* --------------------------------
       CALCULATE
    -------------------------------- */

    calculateBtn.addEventListener("click", calculate);


    async function calculate() {

        hideError();

        const num1 = num1Input.value.trim();
        const num2 = num2Input.value.trim();
        const operation = operationInput.value;


        /* Frontend validation */

        if (num1 === "") {
            showError("Please enter the first number.");
            num1Input.focus();
            return;
        }

        if (num2 === "") {
            showError("Please enter the second number.");
            num2Input.focus();
            return;
        }

        if (operation === "") {
            showError("Please select an operation.");
            operationInput.focus();
            return;
        }


        /* Prevent multiple requests */

        calculateBtn.disabled = true;
        calculateBtn.classList.add("loading");

        calculateBtn.querySelector("span:first-child").textContent =
            "Calculating...";


        try {

            /*
             * Send calculation to Flask.
             *
             * Because this page is served by Flask,
             * "/calculate" points to the same Flask server.
             */

            const response = await fetch("/calculate", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    num1: num1,
                    num2: num2,
                    operation: operation
                })

            });


            /* Check HTTP response */

            if (!response.ok) {

                let errorData;

                try {
                    errorData = await response.json();
                } catch {
                    errorData = null;
                }

                throw new Error(
                    errorData?.error ||
                    `Server returned error ${response.status}.`
                );
            }


            /* Convert response to JSON */

            const data = await response.json();


            if (!data.success) {
                throw new Error(
                    data.error || "Calculation failed."
                );
            }


            /* Display result */

            resultElement.textContent =
                formatResult(data.result);

            resultBox.classList.remove("hidden");


            /* Show success confirmation */

            showSuccessConfirmation(data.result);

        }


        catch (error) {

            console.error(
                "Calculation Error:",
                error
            );


            /*
             * This message specifically handles
             * Flask connection problems.
             */

            if (
                error instanceof TypeError ||
                error.message.includes("Failed to fetch")
            ) {

                showError(
                    "Unable to connect to the server. Please make sure Flask is running."
                );

            } else {

                showError(
                    error.message
                );

            }

        }


        finally {

            calculateBtn.disabled = false;

            calculateBtn.classList.remove("loading");

            calculateBtn.querySelector("span:first-child").textContent =
                "Calculate";

        }

    }


    /* --------------------------------
       FORMAT RESULT
    -------------------------------- */

    function formatResult(value) {

        if (typeof value === "number") {

            if (Number.isInteger(value)) {
                return value.toString();
            }

            return Number(
                value.toFixed(10)
            ).toString();

        }

        return value;

    }


    /* --------------------------------
       SUCCESS CONFIRMATION
    -------------------------------- */

    function showSuccessConfirmation(result) {

        const existingOverlay =
            document.querySelector(".success-overlay");

        if (existingOverlay) {
            existingOverlay.remove();
        }


        const overlay =
            document.createElement("div");

        overlay.className =
            "success-overlay";


        overlay.innerHTML = `

            <div class="success-content">

                <div class="success-icon">
                    ✓
                </div>

                <h2 class="success-title">
                    Calculation Successful
                </h2>

                <p class="success-message">
                    Your calculation has been completed successfully.
                </p>

                <div class="success-result">
                    Result:
                    <strong>
                        ${escapeHTML(formatResult(result))}
                    </strong>
                </div>

                <button
                    class="success-close"
                    type="button"
                >
                    Continue
                </button>

            </div>

        `;


        document.body.appendChild(overlay);


        createSuccessParticles(overlay);


        const closeButton =
            overlay.querySelector(".success-close");


        closeButton.addEventListener(
            "click",
            () => {

                overlay.classList.add("closing");

                setTimeout(() => {
                    overlay.remove();
                }, 300);

            }
        );


        /*
         * Automatically close after 4 seconds.
         */

        const autoClose =
            setTimeout(() => {

                if (
                    document.body.contains(overlay)
                ) {

                    overlay.classList.add(
                        "closing"
                    );

                    setTimeout(() => {

                        if (
                            document.body.contains(
                                overlay
                            )
                        ) {
                            overlay.remove();
                        }

                    }, 300);

                }

            }, 4000);


        closeButton.addEventListener(
            "click",
            () => clearTimeout(autoClose),
            { once: true }
        );

    }


    /* --------------------------------
       SUCCESS PARTICLES
    -------------------------------- */

    function createSuccessParticles(overlay) {

        for (let i = 0; i < 18; i++) {

            const particle =
                document.createElement("span");

            particle.className =
                "success-particle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 0.8}s`;

            particle.style.animationDuration =
                `${2 + Math.random() * 2}s`;

            overlay.appendChild(particle);

        }

    }


    /* --------------------------------
       ERROR
    -------------------------------- */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorBox.classList.remove(
            "hidden"
        );

        resultBox.classList.add(
            "hidden"
        );

    }


    function hideError() {

        errorBox.classList.add(
            "hidden"
        );

    }


    /* --------------------------------
       CLEAR
    -------------------------------- */

    clearBtn.addEventListener(
        "click",
        clearCalculator
    );


    function clearCalculator() {

        num1Input.value = "";
        num2Input.value = "";
        operationInput.value = "";

        resultElement.textContent = "0";

        resultBox.classList.add(
            "hidden"
        );

        errorBox.classList.add(
            "hidden"
        );

        num1Input.focus();

    }


    /* --------------------------------
       ENTER KEY SUPPORT
    -------------------------------- */

    num1Input.addEventListener(
        "keydown",
        handleEnter
    );

    num2Input.addEventListener(
        "keydown",
        handleEnter
    );

    operationInput.addEventListener(
        "keydown",
        handleEnter
    );


    function handleEnter(event) {

        if (event.key === "Enter") {
            calculate();
        }

    }


    /* --------------------------------
       SAFE HTML
    -------------------------------- */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;

    }

});