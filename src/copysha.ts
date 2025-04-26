import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function registerSha256(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('extension.copySha256sum', async (uri: vscode.Uri) => {
    const filePath = uri.fsPath;

    try {
      const { stdout } = await execAsync(`sha256sum "${filePath}"`);
      const sha = stdout.trim().split(/\s+/)[0];

      if (!sha) throw new Error('sha not found in command output!');

      await vscode.env.clipboard.writeText(sha);
      vscode.window.showInformationMessage(`sha256: ${sha}`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`issue with copying SHA256: ${err.message}`);
      console.error(err);
    }
  });

  context.subscriptions.push(command);
}
