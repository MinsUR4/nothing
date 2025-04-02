<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Protected Script</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #111;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
        }
        #container {
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            width: 300px;
        }
        h2 {
            margin-bottom: 15px;
        }
        input {
            width: 90%;
            padding: 10px;
            margin-bottom: 10px;
            border: none;
            border-radius: 5px;
            text-align: center;
        }
        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: #28a745;
            color: white;
            font-weight: bold;
        }
        button:hover {
            background: #218838;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>

    <div id="container">
        <h2 id="title">Enter Password</h2>
        <input type="password" id="passwordInput" placeholder="Enter password">
        <button id="submitBtn">Submit</button>
    </div>

    <script>
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
                    document.getElementById("title").innerText = "Password Set! Enter to Unlock";
                    document.getElementById("passwordInput").value = "";
                    document.getElementById("submitBtn").innerText = "Unlock";
                    showLoginForm();
                }
            };
        }

        function showLoginForm() {
            document.getElementById("submitBtn").onclick = () => {
                const enteredPassword = document.getElementById("passwordInput").value;
                if (enteredPassword === localStorage.getItem("userPassword")) {
                    document.getElementById("container").classList.add("hidden");
                    loadScript();
                } else {
                    document.getElementById("title").innerText = "Incorrect Password, Try Again";
                    document.getElementById("passwordInput").value = "";
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
    </script>

</body>
</html>
