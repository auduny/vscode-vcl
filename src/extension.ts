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
  let serverDebugPath = "";
  if (config.get('path')) {
    serverPath = config.get('path')
    log.warn("Custom varnishls set to: " + serverPath);

    
  } else {
    log.info("Using bundled varnishls: " + serverPath)
    serverPath = /*context.extensionMode === vscode.ExtensionMode.Production*/ true
    ? await getServerOrDownload(context, LSPTAG)
    : path.resolve(__dirname, '../../target/release/varnishls');
  }

  if (config.get('debugPath')) {
    serverDebugPath = config.get('debugPath');
    log.warn("Custom varnishls debug path set to: " + serverDebugPath);
  } else {
    serverDebugPath = serverPath;
  }

  const homeDir = process.env.HOME || process.env.USERPROFILE; // Fallback for Windows
  const env = Object.assign({}, process.env, {
    VARNISHLS_VCC_PATHS: path.join(homeDir,'.vcc-files')
  });


  const serverExecutable: lsp.Executable = {
//    command: '/Users/ay/src/private/vscode/varnishls/target/debug/varnishls',
//    command: '/Users/ay/src/private/vscode/varnishls/target/release/varnishls',
//    command: __dirname + '/lsp/bin/varnishls-darwin-x86_64',
    command: serverPath,
    args: ['lsp','--stdio'],
    options: { env }
  };

  const serverDebugExecutable: lsp.Executable = {
    //    command: '/Users/ay/src/private/vscode/varnishls/target/debug/varnishls',
    //    command: '/Users/ay/src/private/vscode/varnishls/target/release/varnishls',
    //    command: __dirname + '/lsp/bin/varnishls-darwin-x86_64',
        command: serverDebugPath,
        args: ['lsp','--stdio', '--debug'],
        options: { env }
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
