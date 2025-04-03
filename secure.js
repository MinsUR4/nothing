(() => {
    const style = document.createElement("style");
    style.textContent = `
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ff9a9e, #fad0c4);
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
        }
        .password-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            text-align: center;
        }
        .password-input {
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            outline: none;
            transition: 0.3s;
        }
        .password-input:focus {
            border-color: #ff758c;
        }
        .password-button {
            padding: 12px;
            font-size: 16px;
            background: #ff758c;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
        }
        .password-button:hover {
            background: #ff5b7e;
        }
    `;
    document.head.appendChild(style);

    const targetSequence = "9999";
    let userInput = "";

    function load() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/index.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Script not loaded:', error));
    }

    function showPasswordPage() {
        document.body.innerHTML = ""; 

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
            const password = input.value.trim();
            if (password) {
                localStorage.setItem("userPassword", password);
                alert(`Password set to: ${password}`);
            } else {
                alert("Enter a valid password!");
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
