import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';
import { getServerOrDownload } from './download';
// import { getServerOrDownload } from './download';

const LSPTAG = 'v0.0.9.1';

let client: lsp.LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const serverPath = /*context.extensionMode === vscode.ExtensionMode.Production*/ true
  ? await getServerOrDownload(context, LSPTAG)
  : path.resolve(__dirname, '../../target/release/varnishls');

  const serverExecutable: lsp.Executable = {
//    command: '/Users/ay/src/private/vscode/varnishls/target/debug/varnishls',
//    command: '/Users/ay/src/private/vscode/varnishls/target/release/varnishls',
//    command: __dirname + '/lsp/bin/varnishls-darwin-x86_64',
    command: serverPath,
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
  console.error("prompeguri");
  console.log(__dirname);
  client.start();
}

export async function deactivate(): Promise<void> {
  if (client) {
    
    await client.stop();
  }
}
