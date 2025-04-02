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
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    `;
    document.head.appendChild(style);

    const adminCode = "99999";
    let userInput = "";

    function loadScript() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/index.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Script not loaded:', error));
    }

    function promptPassword() {
        const enteredPassword = prompt("Enter your password:");
        if (enteredPassword === localStorage.getItem("userPassword")) {
            loadScript();
        } else {
            alert("Incorrect password.");
        }
    }

    function setAdminPassword() {
        const newPassword = prompt("Set a new password:");
        if (newPassword) {
            localStorage.setItem("userPassword", newPassword);
            alert("Password has been set!");
        }
    }

    const keyListener = (event) => {
        if (event.key >= "0" && event.key <= "9") {
            userInput += event.key;
            if (userInput.endsWith(adminCode)) {
                document.removeEventListener("keydown", keyListener);
                setAdminPassword();
            } else if (userInput.length >= 5) {
                document.removeEventListener("keydown", keyListener);
                promptPassword();
            }
        }
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    };

    document.addEventListener("keydown", keyListener);
})();
