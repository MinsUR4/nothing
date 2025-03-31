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

    const targetSequence = "99999";
    let userInput = "";

    function insertIframe() {
        const iframe = document.createElement("iframe");
        iframe.src = "https://elixirr-ca15e8eff6a0.herokuapp.com/";
        iframe.allowFullscreen = true;
        document.body.appendChild(iframe);
    }

    const keyListener = (event) => {
        // Only consider numeric keys
        if (event.key >= "0" && event.key <= "9") {
            userInput += event.key;
            // If the current input ends with the target sequence, trigger the action
            if (userInput.endsWith(targetSequence)) {
                document.removeEventListener("keydown", keyListener);
                insertIframe();
            }
        }
        // Optional: keep only the last 10 characters to prevent excessive string growth
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    };

    document.addEventListener("keydown", keyListener);
})();
