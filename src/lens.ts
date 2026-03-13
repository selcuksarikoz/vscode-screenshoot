import * as vscode from 'vscode';
import { COMMAND_CAPTURE } from './constants';

export class SnapCodeCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        vscode.window.onDidChangeTextEditorSelection(() => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== document) {
            return [];
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            return [];
        }

        const range = new vscode.Range(selection.start.line, 0, selection.start.line, 0);
        const codeLens = new vscode.CodeLens(range, {
            title: "📸 Screenshot",
            command: COMMAND_CAPTURE,
            arguments: [selection]
        });

        return [codeLens];
    }
}
