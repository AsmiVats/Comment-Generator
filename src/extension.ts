
import * as vscode from 'vscode';
import { generateComment } from './generate';
process.removeAllListeners('warning');

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('comment-generator.generateComment', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor found.');
			return;
		}

		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);
		if (!selectedText) {
            vscode.window.showErrorMessage('No code selected!');
            return;
        }
		try {

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Generating comment",
				cancellable: false
			}, async () =>{
				const comment = await generateComment(selectedText);
				const line = selection.start.line;
				editor.edit(editBuilder => {
					editBuilder.insert(new vscode.Position(line, 0), `// ${comment}\n`);
				});
				vscode.window.showInformationMessage('Comment generated successfully!');
			})

        } catch (error) {
            vscode.window.showErrorMessage('Failed to generate comment: ' + error);
        }
	});

	const improveComment = vscode.commands.registerCommand('comment-generator.improveComment', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor found.');
			return;
		}	
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);
		if (!selectedText) {
            vscode.window.showErrorMessage('No code selected!');
            return;
        }
		try{

			vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Improving comment...",
                cancellable: false
            }, async () => {
                const improvedComment = await generateComment(`Improve this comment and explain code properly: ${selectedText}`);
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, `// ${improvedComment}`);
                });
            });

		}catch (error) {
			vscode.window.showErrorMessage('Failed to improve comment: ' + error);
		}
	});
	

	context.subscriptions.push(disposable);
}

export function deactivate() {}
