import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

// import { getServerOrDownload } from './download';

const TAG = 'v1.0.0';

let client: lsp.LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const serverExecutable: lsp.Executable = {
    command: __dirname + '/lsp/bin/varnishls-' + process.platform + "-" + process.arch,
    args: ['lsp','--stdio']
  };

  const serverOptions: lsp.ServerOptions = {
    run: serverExecutable,
    debug: serverExecutable,
  };

  const clientOptions: lsp.LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'vcl' }, { scheme: 'file', language: 'vtc' } ],
  };

  client = new lsp.LanguageClient(
    'varnish-vcl',
    'varnish-vcl',
    serverOptions,
    clientOptions
  );
  console.error("prompeguri\n");
  console.log(__dirname);
  client.start();
}

export async function deactivate(): Promise<void> {
  if (client) {
    
    await client.stop();
  }
}
