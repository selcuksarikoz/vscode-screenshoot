import { getWindowTemplate } from './templates';
import { BASE_WIDTH } from './constants';

export function getWebviewContent(code: string, language: string, bgUri: string, aspectRatio: string, format: string, theme: string, windowStyle: string, fontSize: number) {
    const escapedCode = JSON.stringify(code);
    const aspectParts = aspectRatio.split(':');
    const wRatio = parseInt(aspectParts[0]);
    const hRatio = parseInt(aspectParts[1]);

    const baseHeight = Math.round((BASE_WIDTH / wRatio) * hRatio);
    const scaledFontSize = Math.round(fontSize * 2.3);

    let hljsThemePath = theme;
    switch (theme) {
        case 'monokai':
            hljsThemePath = 'monokai-sublime';
            break;
        case 'dracula':
        case 'solarized-dark':
            hljsThemePath = `base16/${theme}`;
            break;
        default:
            hljsThemePath = theme;
            break;
    }

    const template = getWindowTemplate(windowStyle);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnapCode</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${hljsThemePath}.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=swap');

        body, html {
            margin: 0;
            padding: 0;
            background: #111;
            display: inline-block;
            min-width: 100%;
            min-height: 100%;
        }

        #capture-area {
            position: relative;
            background-image: url('${bgUri}');
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px; /* Safe default, will be overridden by JS */
            box-sizing: border-box;
            width: max-content;
            height: max-content;
            min-width: ${BASE_WIDTH}px;
            min-height: ${baseHeight}px;
        }

        .mac-window {
            border-radius: 16px;
            box-shadow: 0 60px 120px rgba(0,0,0,0.85);
            display: inline-flex;
            flex-direction: column;
            border: 1px solid rgba(255,255,255,0.15);
            background: #272822;
            min-width: 800px;
            overflow: hidden !important; 
        }

        ${template.css}

        .mac-content {
            padding: 50px;
            font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
            font-size: ${scaledFontSize}px;
            line-height: 1.5;
            white-space: pre !important; 
            overflow: hidden !important;
            flex: 1;
            user-select: none !important;
            -webkit-user-select: none !important;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
        }

        pre, code, #code-content {
            background: transparent !important;
            background-color: transparent !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            white-space: pre !important;
            margin: 0;
            padding: 0;
            overflow: visible !important;
        }

        code {
            font-family: inherit !important;
            display: inline-block;
        }

        .hljs {
            background: transparent !important;
            padding: 0 !important;
        }
    </style>
</head>
<body>
    <div id="capture-area">
        <div class="mac-window" id="mac-window">
            ${template.html}
            <div class="mac-content" id="mac-content">
                <pre><code id="code-content" class="language-${language}"></code></pre>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const code = ${escapedCode};
        const codeElement = document.getElementById('code-content');
        codeElement.textContent = code;

        // Auto highlight or specific highlight
        hljs.highlightElement(codeElement);

        window.onload = async () => {
            // Theme detection logic
            const temp = document.createElement('div');
            temp.className = 'hljs';
            temp.style.display = 'none';
            document.body.appendChild(temp);
            const themeStyle = window.getComputedStyle(temp);
            const themeBg = themeStyle.backgroundColor;
            document.body.removeChild(temp);

            if (themeBg && themeBg !== 'rgba(0, 0, 0, 0)' && themeBg !== 'transparent') {
                document.getElementById('mac-window').style.backgroundColor = themeBg;
                
                const rgb = themeBg.match(/\\d+/g);
                if (rgb && rgb.length >= 3) {
                    const r = Math.max(0, parseInt(rgb[0]) - 25);
                    const g = Math.max(0, parseInt(rgb[1]) - 25);
                    const b = Math.max(0, parseInt(rgb[2]) - 25);
                    document.getElementById('mac-header').style.backgroundColor = \`rgb(\${r}, \${g}, \${b})\`;
                }
            }

            const node = document.getElementById('capture-area');
            const macWindow = document.getElementById('mac-window');
            const format = '${format}';
            
            const targetRatio = ${wRatio} / ${hRatio};
            const winWidth = macWindow.offsetWidth;
            const winHeight = macWindow.offsetHeight;

            let wPercent = 0.85;
            let hPercent = 0.85;

            if (targetRatio < 1.7 && targetRatio >= 1.3) {
                wPercent = 0.90;
                hPercent = 0.90;
            } else if (targetRatio < 1.3) {
                wPercent = 0.95;
                hPercent = 0.95;
            }

            let reqWidth1 = winWidth / wPercent;
            let reqHeight1 = reqWidth1 / targetRatio;

            let reqHeight2 = winHeight / hPercent;
            let reqWidth2 = reqHeight2 * targetRatio;

            let finalWidth = Math.max(reqWidth1, reqWidth2);
            let finalHeight = Math.max(reqHeight1, reqHeight2);

            node.style.minWidth = '0px';
            node.style.minHeight = '0px';
            node.style.padding = '0px';
            node.style.width = Math.ceil(finalWidth) + 'px';
            node.style.height = Math.ceil(finalHeight) + 'px';

            try {
                document.fonts.ready.then(async () => {
                    setTimeout(async () => {
                        let dataUrl;
                        
                        const options = {
                            quality: 1.0,
                            pixelRatio: 1,
                            width: Math.ceil(finalWidth),
                            height: Math.ceil(finalHeight),
                            canvasWidth: ${BASE_WIDTH},
                            canvasHeight: ${baseHeight},
                            style: {
                                transform: 'scale(1)',
                                transformOrigin: 'top left'
                            }
                        };
                        
                        if (format === 'png') {
                            dataUrl = await htmlToImage.toPng(node, options);
                        } else {
                            dataUrl = await htmlToImage.toJpeg(node, options);
                        }
                        
                        vscode.postMessage({
                            command: 'saveImage',
                            data: dataUrl
                        });
                    }, 800);
                });
            } catch (error) {
                vscode.postMessage({
                    command: 'error',
                    message: error.toString()
                });
            }
        };
    </script>
</body>
</html>`;
}