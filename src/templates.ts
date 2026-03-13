export function getWindowTemplate(style: string): { html: string, css: string } {
    switch (style) {
        case 'windows':
            return {
                html: `
                    <div class="win-header" id="window-header">
                        <div class="win-tabs">
                            <div class="win-tab">
                                <svg class="win-icon" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v6h10V5H3z"/>
                                    <path d="M4.5 6.5L6 8l-1.5 1.5.7.7L7.4 8l-2.2-2.2-.7.7zM8 9h3v1H8z"/>
                                </svg>
                                <span class="win-title">Windows PowerShell</span>
                            </div>
                            <div class="win-tab-add">
                                <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                                    <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="win-controls">
                            <div class="win-btn minimize"><svg viewBox="0 0 10 1" fill="currentColor"><path d="M0 0h10v1H0z"/></svg></div>
                            <div class="win-btn maximize"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor"><path d="M.5.5h9v9h-9z"/></svg></div>
                            <div class="win-btn close"><svg viewBox="0 0 10 10" fill="currentColor"><path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4L1 0z"/></svg></div>
                        </div>
                    </div>
                `,
                css: `
                    .win-header {
                        height: 48px;
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                        padding: 0;
                        flex-shrink: 0;
                        border-bottom: 1px solid rgba(0,0,0,0.2);
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    .win-tabs {
                        display: flex;
                        align-items: flex-end;
                        height: 38px;
                        padding-left: 12px;
                    }
                    .win-tab {
                        display: flex;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.08); /* Simulated active tab */
                        height: 100%;
                        padding: 0 16px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        gap: 12px;
                        color: #ffffff;
                        font-size: 13px;
                        min-width: 160px;
                        box-shadow: 0 -1px 2px rgba(0,0,0,0.1);
                    }
                    .win-title {
                        color: rgba(255, 255, 255, 0.8);
                        font-weight: 400;
                    }
                    .win-icon {
                        width: 14px;
                        height: 14px;
                        color: #4da6ff;
                    }
                    .win-tab-add {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        color: rgba(255, 255, 255, 0.6);
                        margin-left: 4px;
                        margin-bottom: 2px;
                    }
                    .win-controls {
                        display: flex;
                        height: 32px;
                        align-self: flex-start;
                    }
                    .win-btn {
                        width: 46px;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: rgba(255, 255, 255, 0.6);
                    }
                    .win-btn svg {
                        width: 10px;
                        height: 10px;
                    }
                `
            };
        case 'linux':
            return {
                html: `
                    <div class="linux-header" id="window-header">
                        <div class="linux-title">Terminal</div>
                        <div class="linux-controls">
                            <div class="linux-btn close"></div>
                            <div class="linux-btn minimize"></div>
                            <div class="linux-btn maximize"></div>
                        </div>
                    </div>
                `,
                css: `
                    .linux-header {
                        height: 46px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;
                        flex-shrink: 0;
                        border-bottom: 1px solid rgba(0,0,0,0.3);
                        font-family: 'Ubuntu', sans-serif;
                    }
                    .linux-title {
                        color: rgba(255,255,255,0.8);
                        font-size: 15px;
                        font-weight: 500;
                        flex: 1;
                        text-align: center;
                        margin-left: 70px; /* Offset to center title */
                    }
                    .linux-controls {
                        display: flex;
                        gap: 8px;
                    }
                    .linux-btn {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                    }
                    .linux-btn.close { background: #E95420; }
                    .linux-btn.minimize { background: #777; }
                    .linux-btn.maximize { background: #777; }
                `
            };
        case 'none':
            return {
                html: ``,
                css: ``
            };
        case 'macos':
        default:
            return {
                html: `
                    <div class="mac-header" id="window-header">
                        <div class="dot red"></div>
                        <div class="dot yellow"></div>
                        <div class="dot green"></div>
                    </div>
                `,
                css: `
                    .mac-header {
                        height: 54px;
                        display: flex;
                        align-items: center;
                        padding: 0 28px;
                        gap: 14px;
                        flex-shrink: 0;
                        border-bottom: 1px solid rgba(0,0,0,0.3);
                        border-top-left-radius: 15px;
                        border-top-right-radius: 15px;
                    }
                    .dot {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                    }
                    .red { background: #ff5f57; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
                    .yellow { background: #febc2e; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
                    .green { background: #28c840; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
                `
            };
    }
}
