(() => {
    const applyStyles = () => {
        let style = document.getElementById("persistent-style");
        if (!style) {
            style = document.createElement("style");
            style.id = "persistent-style";
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
        }
    };

    applyStyles();
    const observer = new MutationObserver(() => applyStyles());
    observer.observe(document.head, { childList: true, subtree: true });

    const targetSequence = "9999";
    let userInput = "";

    function load() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/superindex.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Script not loaded:', error));
    }

    function showPasswordPage() {
        document.body.innerHTML = ""; 

        const container = document.createElement("div");
        container.className = "password-container";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter new password";
        input.className = "password-input";

        const button = document.createElement("button");
        button.textContent = "Set Password";
        button.className = "password-button";

        button.addEventListener("click", () => {
            const password = input.value.trim();
            if (password) {
                localStorage.setItem("userPassword", password);
                alert(`Password set to: ${password}`);
                document.body.innerHTML = "Refresh the page";
            } else {
                alert("Enter a valid password, bud");
            }
        });

        container.appendChild(input);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    function checkPassword() {
        return userInput === localStorage.getItem("userPassword");
    }

    const keyListener = (event) => {
        if (/^[a-zA-Z0-9]$/.test(event.key)) {
            userInput += event.key;

            if (userInput === targetSequence) {
                document.removeEventListener("keydown", keyListener);
                showPasswordPage();
            } else if (checkPassword()) {
                document.removeEventListener("keydown", keyListener);
                load();
            }
        }

        if (userInput.length > 20) {
            userInput = userInput.slice(-20);
        }
    };

    document.addEventListener("keydown", keyListener);
})();
