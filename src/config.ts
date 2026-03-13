import * as vscode from 'vscode';
import * as path from 'path';
import * as constants from './constants';

export interface AppConfig {
    background: string;
    aspectRatio: string;
    outputFormat: string;
    theme: string;
    windowStyle: string;
    fontSize: number;
}

export function getConfig(): AppConfig {
    const config = vscode.workspace.getConfiguration(constants.EXTENSION_ID);
    return {
        background: config.get<string>('background', constants.DEFAULT_BACKGROUND),
        aspectRatio: config.get<string>('aspectRatio', constants.DEFAULT_ASPECT_RATIO),
        outputFormat: config.get<string>('outputFormat', constants.DEFAULT_OUTPUT_FORMAT),
        theme: config.get<string>('theme', constants.DEFAULT_THEME),
        windowStyle: config.get<string>('windowStyle', constants.DEFAULT_WINDOW_STYLE),
        fontSize: config.get<number>('fontSize', constants.DEFAULT_FONT_SIZE)
    };
}

export function getBackgroundUri(context: vscode.ExtensionContext, background: string): vscode.Uri {
    const bgFileName = background.endsWith('.webp') ? background : `${background}.webp`;
    return vscode.Uri.file(path.join(context.extensionPath, 'assets', bgFileName));
}
