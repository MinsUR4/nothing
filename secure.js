(() => {
    const targetSequence = "9999";
    let userInput = "";
    let enteredPassword = "";

    function savePassword(password) {
        localStorage.setItem("savedPassword", password);
        alert("Password set successfully!");
        location.reload(); // Reset the page after setting the password
    }

    function loadExternalScript() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/index.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Not loaded:', error));
    }

    function showPasswordPage() {
        document.body.innerHTML = ""; // Clear current content

        const input = document.createElement("input");
        input.type = "password";
        input.placeholder = "Enter new password";
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && input.value) {
                savePassword(input.value);
            }
        });

        document.body.appendChild(input);
        input.focus();
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

    const passwordListener = (event) => {
        if (event.key.length === 1) { 
            enteredPassword += event.key;
            const savedPassword = localStorage.getItem("savedPassword");

            if (savedPassword && enteredPassword.endsWith(savedPassword)) {
                document.removeEventListener("keydown", passwordListener);
                loadExternalScript();
            }

            if (enteredPassword.length > 50) {
                enteredPassword = enteredPassword.slice(-50);
            }
        }
    };

    if (localStorage.getItem("savedPassword")) {
        document.addEventListener("keydown", passwordListener);
    } else {
        document.addEventListener("keydown", keyListener);
    }
})();
