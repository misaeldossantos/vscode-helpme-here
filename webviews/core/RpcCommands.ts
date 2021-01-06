import { RpcBrowser } from "@sap-devx/webview-rpc/out.browser/rpc-browser.js";

declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();
let rpc = new RpcBrowser(window, vscode);

class RpcCommands {
  vscodeApi = vscode;

  async getEditorSelectedText() {
    return await rpc.invoke("getEditorSelectedText", null);
  }

  async getClipboardText() {
    const resultInPromise = await rpc.invoke("getClipboardText", null);
    return (await resultInPromise) || "";
  }
}

export default new RpcCommands()