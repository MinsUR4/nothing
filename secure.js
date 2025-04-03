(() => {
    const style = document.createElement("style");
    style.textContent = `
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .password-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .password-input, .password-button {
            padding: 10px;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);

    const targetSequence = "9999";
    let userInput = "";

    function showPasswordPage() {
        document.body.innerHTML = ""; // Clear current content

        const container = document.createElement("div");
        container.className = "password-container";

        const input = document.createElement("input");
        input.type = "password";
        input.placeholder = "Enter new password";
        input.className = "password-input";

        const button = document.createElement("button");
        button.textContent = "Set Password";
        button.className = "password-button";

        button.addEventListener("click", () => {
            alert(`Password set to: ${input.value}`);
        });

        container.appendChild(input);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    const keyListener = (event) => {
        if (event.key >= "0" && event.key <= "9") {
            userInput += event.key;
            if (userInput.endsWith(targetSequence)) {
                document.removeEventListener("keydown", keyListener);
                showPasswordPage();
            }
        }
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    };

    document.addEventListener("keydown", keyListener);
})();
