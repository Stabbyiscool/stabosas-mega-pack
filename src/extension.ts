import * as vscode from 'vscode';
import { registerSha256 } from './copysha';
import { registerGitSaver } from './gitsaver';

export function activate(context: vscode.ExtensionContext) {
  registerSha256(context);
  registerGitSaver();
  registerGitPushAll();
}

export function deactivate() {}
