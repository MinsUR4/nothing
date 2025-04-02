(() => {
    const style = document.createElement("style");
    style.textContent = `
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        }
        #container {
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        input, button {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
        }
        input {
            width: 80%;
            text-align: center;
        }
        button {
            cursor: pointer;
            background: #28a745;
            color: white;
        }
        button:hover {
            background: #218838;
        }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = `<div id="container">
        <h2 id="title">Enter Password</h2>
        <input type="password" id="passwordInput" placeholder="Enter password">
        <button id="submitBtn">Submit</button>
    </div>`;

    const adminCode = "99999";
    let userInput = "";

    function loadScript() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/index.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Script not loaded:', error));
    }

    function setAdminPassword() {
        document.getElementById("title").innerText = "Set a New Password";
        document.getElementById("passwordInput").value = "";
        document.getElementById("submitBtn").innerText = "Set Password";
        document.getElementById("submitBtn").onclick = () => {
            const newPassword = document.getElementById("passwordInput").value;
            if (newPassword) {
                localStorage.setItem("userPassword", newPassword);
                alert("Password has been set!");
                showLoginForm();
            }
        };
    }

    function showLoginForm() {
        document.getElementById("title").innerText = "Enter Password";
        document.getElementById("passwordInput").value = "";
        document.getElementById("submitBtn").innerText = "Submit";
        document.getElementById("submitBtn").onclick = () => {
            const enteredPassword = document.getElementById("passwordInput").value;
            if (enteredPassword === localStorage.getItem("userPassword")) {
                alert("Access Granted!");
                loadScript();
            } else {
                alert("Incorrect password.");
            }
        };
    }

    const keyListener = (event) => {
        if (event.key >= "0" && event.key <= "9") {
            userInput += event.key;
            if (userInput.endsWith(adminCode)) {
                document.removeEventListener("keydown", keyListener);
                setAdminPassword();
            }
        }
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    };

    document.addEventListener("keydown", keyListener);
    showLoginForm();
})();
