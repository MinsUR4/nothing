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
    iframe.src = "https://urban-umbrella-7v7wxx9r7xq6hxxj6-8080.app.github.dev/";
    iframe.setAttribute("allowFullscreen", "true");

    document.body.appendChild(iframe);
})();
