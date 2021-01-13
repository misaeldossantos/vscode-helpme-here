import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import * as path from 'path'
import { RpcExtension } from "@sap-devx/webview-rpc/out.ext/rpc-extension";
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  _rpc?: RpcExtension;

  constructor(private readonly _extensionUri: vscode.Uri) {

  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    this._rpc = new RpcExtension(webviewView.webview);

    async function getClipboardText() {
      return await vscode.env.clipboard.readText();
    }

    function getEditorSelectedText() {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      const selection = editor.selection;
      return editor.document.getText(selection);
    }

    this._rpc.registerMethod({func: getClipboardText})
    this._rpc.registerMethod({func: getEditorSelectedText})

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });

  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    vscode.commands.executeCommand(
      "workbench.action.webview.openDeveloperTools"
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleVendorUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/vendor.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const scriptsPathOnDisk = vscode.Uri.file(
			path.join(this._extensionUri.path)
		);

		// And the uri we use to load this script in the webview
		const scriptsUri = webview.asWebviewUri(scriptsPathOnDisk);

    let rpcScripts = `
    <script>var exports = {};</script>
    <script type="module" src="vscode-scheme/node_modules/@sap-devx/webview-rpc/out.browser/rpc-common.js"></script>
    <script type="module" src="vscode-scheme/node_modules/@sap-devx/webview-rpc/out.browser/rpc-browser.js"></script>
    `

		rpcScripts = rpcScripts.replace(/vscode-scheme/g, scriptsUri.toString()).replace(/%3A/g, ":");


    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
          and only allow scripts that have a specific nonce.
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
          
        -->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <link rel='stylesheet' href='${styleVendorUri}'>
        ${rpcScripts}
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
