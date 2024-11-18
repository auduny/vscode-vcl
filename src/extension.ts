import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';
import { getServerOrDownload } from './download';
import { log } from './util';
// import { getServerOrDownload } from './download';

const LSPTAG = 'v0.0.14';

let client: lsp.LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('varnishls');
  let serverPath = "";
  if (config.get('path')) {
    serverPath = config.get('path')
    log.warn("Custom varnishls set to: " + serverPath);

    
  } else {
    log.info("Using bundled varnishls: " + serverPath)
    serverPath = /*context.extensionMode === vscode.ExtensionMode.Production*/ true
    ? await getServerOrDownload(context, LSPTAG)
    : path.resolve(__dirname, '../../target/release/varnishls');
  }

  const serverExecutable: lsp.Executable = {
//    command: '/Users/ay/src/private/vscode/varnishls/target/debug/varnishls',
//    command: '/Users/ay/src/private/vscode/varnishls/target/release/varnishls',
//    command: __dirname + '/lsp/bin/varnishls-darwin-x86_64',
    command: serverPath,
    args: ['lsp','--stdio']
  };

  const serverDebugExecutable: lsp.Executable = {
    //    command: '/Users/ay/src/private/vscode/varnishls/target/debug/varnishls',
    //    command: '/Users/ay/src/private/vscode/varnishls/target/release/varnishls',
    //    command: __dirname + '/lsp/bin/varnishls-darwin-x86_64',
        command: serverPath,
        args: ['lsp','--stdio', '--debug']
      };

  const serverOptions: lsp.ServerOptions = {
    run: serverExecutable,
    debug: serverDebugExecutable,
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
  client.start();
}

export async function deactivate(): Promise<void> {
  if (client) {
    
    await client.stop();
  }
}
