(() => {
    const style = document.createElement("style");
    style.textContent = `
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    `;
    document.head.appendChild(style);

    const iframe = document.createElement("iframe");
    iframe.src = "https://jubilant-halibut-wrvx4479v49vc9qxq-8080.app.github.dev/";
    iframe.setAttribute("allowFullscreen", "true");

    document.body.appendChild(iframe);
})();
