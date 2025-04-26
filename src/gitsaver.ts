import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

export function registerGitSaver() {
  vscode.workspace.onWillSaveTextDocument(async (e) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const cwd = workspaceFolders[0].uri.fsPath;
    const filePath = e.document.uri.fsPath;
    const relativePath = path.relative(cwd, filePath);

    try {
      await execAsync('git rev-parse --is-inside-work-tree', { cwd });
    } catch {
      return;
    }

    const { stdout } = await execAsync(`git status --porcelain "${relativePath}"`, { cwd });
    if (!stdout.trim()) return;

    const answer = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: `Commit & push ${relativePath}?`
    });

    if (answer === "Yes") {
      const terminal = vscode.window.createTerminal("Git Auto Commit");
      terminal.show();
      terminal.sendText(`cd "${cwd}"`);
      terminal.sendText(`git add "${relativePath}"`);
      terminal.sendText(`git commit -m "auto: update ${relativePath}"`);
      terminal.sendText(`git push`);
    }
  });
}
