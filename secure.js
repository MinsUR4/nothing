(() => {
    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            font-family: 'Poppins', sans-serif;
        }

        .password-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 25px;
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            text-align: center;
            width: 300px;
            transition: all 0.3s ease-in-out;
        }

        .password-container:hover {
            transform: scale(1.02);
        }

        .password-input {
            padding: 12px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            outline: none;
            text-align: center;
            transition: all 0.3s ease-in-out;
        }

        .password-input:focus {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .password-button {
            padding: 12px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(90deg, #ff758c, #ff7eb3);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
        }

        .password-button:hover {
            background: linear-gradient(90deg, #ff7eb3, #ff758c);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
            } else {
                alert("Please enter a valid password.");
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
