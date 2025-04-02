(() => {
    const adminCode = "99999";
    let userInput = "";

    const loadScript = () => {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/index.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('Script not loaded:', error));
    }

    const setAdminPassword = () => {
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

    const showLoginForm = () => {
        const savedPassword = localStorage.getItem("userPassword");
        
        if (savedPassword) {
            console.log("Stored User Password:", savedPassword);
        } else {
            console.log("No user password set.");
        }

        document.getElementById("submitBtn").onclick = () => {
            const enteredPassword = document.getElementById("passwordInput").value;

            if (savedPassword && enteredPassword === savedPassword) {
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
            console.log("User Input Sequence:", userInput);
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
