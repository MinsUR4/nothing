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
        const title = document.getElementById("title");
        const passwordInput = document.getElementById("passwordInput");
        const submitBtn = document.getElementById("submitBtn");

        title.innerText = "Set a New Password";
        passwordInput.value = "";
        submitBtn.innerText = "Set Password";
        
        submitBtn.onclick = () => {
            const newPassword = passwordInput.value;
            if (newPassword) {
                localStorage.setItem("userPassword", newPassword);
                title.innerText = "Password Set! Enter to Unlock";
                passwordInput.value = "";
                submitBtn.innerText = "Unlock";
                showLoginForm();
            }
        };
    }

    const showLoginForm = () => {
        const savedPassword = localStorage.getItem("userPassword");
        const title = document.getElementById("title");
        const passwordInput = document.getElementById("passwordInput");
        const submitBtn = document.getElementById("submitBtn");

        if (savedPassword) {
            console.log("Stored User Password:", savedPassword);
        } else {
            console.log("No user password set.");
        }

        submitBtn.onclick = () => {
            const enteredPassword = passwordInput.value;

            if (savedPassword && enteredPassword === savedPassword) {
                document.getElementById("container").classList.add("hidden");
                loadScript();
            } else {
                title.innerText = "Incorrect Password, Try Again";
                passwordInput.value = "";
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

    document.addEventListener("DOMContentLoaded", () => {
        document.addEventListener("keydown", keyListener);
        showLoginForm();
    });
})();
