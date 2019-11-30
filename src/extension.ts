// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helloworld-sample" is now active!');
	console.log('Scroll sync on split views ready.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable;
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// The code you place here will be executed every time your command is executed

	// Display a message box to the user
	// vscode.window.showInformationMessage('Hello World!');
	// });

	// context.subscriptions.push(disposable);

	//
	// Customized Test Start
	//

	// get active view info function
	function getaTEinfo() {
		if (vscode.window.activeTextEditor !== undefined) {
			// get infos from active Text Editor
			const aTE = vscode.window.activeTextEditor;
			const avC = aTE.viewColumn;
			if (aTE.visibleRanges.length != 1) { vscode.window.showErrorMessage(`Range of view is strange. length of Ranges(${aTE.visibleRanges.length}) is not 1`); return; }
			const aTER = aTE.visibleRanges[0];

			// active Text Editor info
			vscode.window.showInformationMessage(`activeTextEditor viewColumn=${avC}, Range=${aTER.start.line}~${aTER.end.line}`);
		}
	}
	// get active view info
	disposable = vscode.commands.registerCommand('extension.aTEinfo', () => {
		getaTEinfo();
	});
	context.subscriptions.push(disposable);

	// startup check
	let started = false;
	// sync selector
	let syncOn = false;
	// sync function
	function syncViews() {
		if (!syncOn) { return; }
		if (vscode.window.visibleTextEditors.length > 0) {
			if (vscode.window.activeTextEditor !== undefined) {
				// get infos from active Text Editor
				const aTE = vscode.window.activeTextEditor;
				const avC = aTE.viewColumn;
				if (aTE.visibleRanges.length != 1) { vscode.window.showErrorMessage(`Range of view is strange. length of Ranges(${aTE.visibleRanges.length}) is not 1`); return; }
				const aTER = aTE.visibleRanges[0];

				// active Text Editor info
				// vscode.window.showInformationMessage(`activeTextEditor viewColumn=${avC}, Range=${aTER.start.line}~${aTER.end.line}`);

				// sync all other views to active one.
				vscode.window.visibleTextEditors.forEach((cTE) => {
					// pass current view is active one.
					if (cTE.viewColumn == avC) {
						// vscode.window.showInformationMessage('Current vC is aTE. pass.');
					}
					// else sync view to active.
					else {
						// get infos from current Text Editor View
						let msg = '';
						msg += `cTE's vC=${cTE.viewColumn}`;
						msg += ` R=${aTE.visibleRanges[0].start.line}~${aTE.visibleRanges[0].end.line}/${aTE.visibleRanges.length}`
						// current Text Editor info
						// vscode.window.showInformationMessage(msg);
						// sync view
						cTE.revealRange(aTER, vscode.TextEditorRevealType.AtTop);
					}
				})
			}
		}
		else {
			vscode.window.showInformationMessage('There is no active editor');
		}
	}

	// sync all split view to active view
	disposable = vscode.commands.registerCommand('extension.syncViews', () => {
		syncOn = true;
		syncViews();
		if (!started) { vscode.window.onDidChangeTextEditorVisibleRanges(syncViews); started = true; }
	});
	context.subscriptions.push(disposable);

	// stop sync views
	disposable = vscode.commands.registerCommand('extension.stopSyncViews', () => {
		syncOn = false;
	});
	context.subscriptions.push(disposable);

	//
	// Customized Test Ends
	//
}

// this method is called when your extension is deactivated
export function deactivate() { }