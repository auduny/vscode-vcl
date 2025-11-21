import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';
import { getServerOrDownload } from './download';
import { log } from './util';
import { execFile } from 'child_process';
// import { getServerOrDownload } from './download';

const LSPTAG = 'v1.0.1';

let client: lsp.LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('varnishls');
  let serverPath = "";
  let serverDebugPath = "";
  const homeDir = process.env.HOME || process.env.USERPROFILE; // Fallback for Windows
  if (process.env.VARNISHLS_VCC_PATHS) {
    log.info("Using VCC paths from $VARNISHLS_VCC_PATHS env ");
  } else {
    log.info("Using VCC-paths from Config")
  }
  // Resolve raw VCC paths from env override or configuration, then expand $HOME variants.
  const rawVccPaths: string = (process.env.VARNISHLS_VCC_PATHS && process.env.VARNISHLS_VCC_PATHS.length > 0)
    ? process.env.VARNISHLS_VCC_PATHS
    : (config.get<string>('vccPaths') || '');

  const expandedVccPaths = rawVccPaths.replace(/\$HOME|\${HOME}|\${env:HOME}/g, homeDir || '');

  const env = {
    ...process.env,
    VARNISHLS_VCC_PATHS: expandedVccPaths
  };
  log.info("Expanded VARNISHLS_VCC_PATHS: " + env.VARNISHLS_VCC_PATHS);
  

  if (config.get('path')) {
    serverPath = config.get('path')
    log.warn("Custom varnishls set to: " + serverPath);
    
  } else {
    serverPath = /*context.extensionMode === vscode.ExtensionMode.Production*/ true
    ? await getServerOrDownload(context, LSPTAG)
    : path.resolve(__dirname, '../../target/release/varnishls');
    log.info("Using bundled varnishls: " + serverPath)
  }

  if (config.get('debugPath')) {
    serverDebugPath = config.get('debugPath');
    log.warn("Custom varnishls debug path set to: " + serverDebugPath);
  } else {
    serverDebugPath = serverPath;
  }

    // Run varnishls -V to get the version
    execFile(serverPath, ['-V'], (error, stdout, stderr) => {
      if (error) {
        log.error(`Error running varnishls -V: ${error.message}`);
        return;
      }
      if (stderr) {
        log.error(`stderr from varnishls -V: ${stderr}`);
        return;
      }
      log.info(`varnishls version: ${stdout}`);

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
