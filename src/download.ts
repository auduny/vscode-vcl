import got from 'got';
import { promisify } from 'util';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as stream from 'stream';
import * as vscode from 'vscode';

import { log } from './util';



const pipeline = promisify(stream.pipeline);
const exists = promisify(fs.exists);
const BASE_URL = 'https://github.com/M4R7iNP/varnishls/releases/download/';

const platforms = {
  win32: 'pc-windows-mscv',
  linux: 'unknown-linux-gnu',
  darwin: 'apple-darwin',
};

const archs = {
  arm64: 'aarch64',
  x64: 'x86_64',
};


const isValidExecutable = (path: string): boolean =>
  spawnSync(path, ['--version']).status === 0;

const getServerDestination = async (
  context: vscode.ExtensionContext,
  tag: string
): Promise<string> => {
  const { globalStorageUri } = context;
  const extension = process.platform === 'win32' ? '.exe' : '';
  const uri = vscode.Uri.joinPath(
    globalStorageUri,
    'server',
    `varnishls-${tag}${extension}`
  );
  const { fsPath } = uri;
  await fs.promises.mkdir(path.dirname(fsPath), { recursive: true });
  return fsPath;
};

const getServerUrl = (tag: string): string => {
  const variant = platforms[process.platform];
  const arch = archs[process.arch];
  const extension = process.platform === 'win32' ? '.exe' : '';
  return `${BASE_URL}${tag}/varnishls-${arch}-${variant}${extension}`;
};

export const getServerOrDownload = async (
  context: vscode.ExtensionContext,
  tag: string
): Promise<string> => {
  const dest = await getServerDestination(context, tag);
  if (!(await exists(dest)) || !isValidExecutable(dest)) {
    const url = getServerUrl(tag);
    log.info(`Server URL: ${url}`);
    const tempDest = path.join(
      path.dirname(dest),
      `.tmp${crypto.randomBytes(5).toString('hex')}`
    );

    const params = {
      title: 'Downloading rust varnishls server from github.com/M4R7iNP/varnishls',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    };

    await vscode.window.withProgress(
      params,
      async (progressHandle, cancellationHandle) => {
        let lastPercent = 0;

        const stream = got.stream(url).on('downloadProgress', progress => {
          const message = `${(progress.percent * 100).toFixed(0)}%`;
          const increment = progress.percent - lastPercent;
          progressHandle.report({ message, increment });
          lastPercent = progress.percent;
        });

        cancellationHandle.onCancellationRequested(stream.destroy.bind(stream));

        await pipeline(stream, fs.createWriteStream(tempDest, { mode: 0o755 }));
      }
    );

    await fs.promises.rename(tempDest, dest);
  }

  return dest;
};