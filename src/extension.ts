import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

// import { getServerOrDownload } from './download';

const TAG = 'v0.1.0';

let client: lsp.LanguageClient;

export async function activate(context: vscode.ExtensionContext) {

  const serverExecutable: lsp.Executable = {
//    command: serverPath,
    command: '/Users/ay/src/private/vscode/varnish-lsp/target/debug/varnishls',
    args: ['lsp','--stdio','--debug'],
    options: {
      env: { RUST_LOG: 'debug' },
    },
    
  };
     //Create output channel
     let output = vscode.window.createOutputChannel("Varnsh-VCL");

     //Write to output.
     output.appendLine("I am a apple.");
     output.appendLine(process.env.PATH)

  const serverOptions: lsp.ServerOptions = {
    run: serverExecutable,
    debug: serverExecutable,
  };

  const clientOptions: lsp.LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'vcl' }],
  };

  client = new lsp.LanguageClient(
    'varnish-vcl',
    'varnish-vcl',
    serverOptions,
    clientOptions
  );
  client.start();
}

export async function deactivate(): Promise<void> {
  let myoutput = vscode.window.createOutputChannel("Varnsh-VCL-debug");
  myoutput.append("Da forsøker vi å skru oss av");
  if (client) {
    
    await client.stop();
  }
}
