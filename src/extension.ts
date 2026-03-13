import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getConfig, getBackgroundUri } from './config';
import { SnapCodeCodeLensProvider } from './lens';
import { getWebviewContent } from './webview';
import * as constants from './constants';

export function activate(context: vscode.ExtensionContext) {
    const codeLensProvider = new SnapCodeCodeLensProvider();
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider({ scheme: 'file' }, codeLensProvider)
    );

    let disposable = vscode.commands.registerCommand(constants.COMMAND_CAPTURE, async (selection: vscode.Selection) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const fullRange = new vscode.Range(
            selection.start.line,
            0,
            selection.end.line,
            selection.end.character
        );

        const selectedText = editor.document.getText(fullRange);
        if (!selectedText) {
            vscode.window.showErrorMessage(constants.ERROR_NO_CODE_SELECTED);
            return;
        }

        const lines = selectedText.split('\n');
        let minIndent = Infinity;
        for (const line of lines) {
            if (line.trim().length > 0) {
                const indent = line.match(/^\s*/)?.[0].length || 0;
                if (indent < minIndent) {
                    minIndent = indent;
                }
            }
        }
        
        let dedentedCode = selectedText;
        if (minIndent > 0 && minIndent !== Infinity) {
            dedentedCode = lines.map(line => line.startsWith(' '.repeat(minIndent)) ? line.substring(minIndent) : line.replace(/^\s+/, '')).join('\n');
        }

        const config = getConfig();
        const bgUri = getBackgroundUri(context, config.background);

        const panel = vscode.window.createWebviewPanel(
            constants.WEBVIEW_PANEL_ID,
            constants.WEBVIEW_PANEL_TITLE,
            { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(context.extensionPath),
                    vscode.Uri.file(path.dirname(bgUri.fsPath))
                ]
            }
        );

        const webviewBgUri = panel.webview.asWebviewUri(bgUri);
        const languageId = editor.document.languageId;

        panel.webview.html = getWebviewContent(
            dedentedCode, 
            languageId, 
            webviewBgUri.toString(), 
            config.aspectRatio, 
            config.outputFormat, 
            config.theme,
            config.windowStyle,
            config.fontSize
        );

        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'saveImage':
                        const base64Data = message.data.replace(/^data:image\/\w+;base64,/, "");
                        const buffer = Buffer.from(base64Data, 'base64');
                        const timestamp = Date.now();
                        const fileName = `${constants.FILE_PREFIX}${timestamp}.${config.outputFormat}`;
                        
                        const workspaceFolders = vscode.workspace.workspaceFolders;
                        if (!workspaceFolders) {
                            vscode.window.showErrorMessage(constants.ERROR_NO_WORKSPACE);
                            return;
                        }

                        const rootPath = workspaceFolders[0].uri.fsPath;
                        const screenshotsDir = path.join(rootPath, constants.SCREENSHOTS_DIR_NAME);
                        
                        if (!fs.existsSync(screenshotsDir)) {
                            fs.mkdirSync(screenshotsDir, { recursive: true });
                        }

                        const filePath = path.join(screenshotsDir, fileName);

                        fs.writeFileSync(filePath, new Uint8Array(buffer));
                        
                        vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath));
                        
                        panel.dispose();
                        return;
                    case 'error':
                        vscode.window.showErrorMessage(`${constants.ERROR_RENDER}${message.message}`);
                        panel.dispose();
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
