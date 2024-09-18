import { INestApplication } from '@nestjs/common';
import { Asset, TransactionalConnection } from '@vendure/core';
import path from 'path';
import fs from 'fs-extra';

export async function copyDemoAssets(app: INestApplication) {
  const connection = app.get(TransactionalConnection);
  const assets = await connection.rawConnection.getRepository(Asset).find();
  console.log(`Copying ${assets.length} asset files...`);
  for (const asset of assets) {
    const sourcePath = asset.source.replace(/\\/g, path.sep);
    const previewPath = asset.preview.replace(/\\/g, path.sep);
    const sourceFilePath = path.join(
      __dirname,
      '../../node_modules/@vendure/create/assets/images/',
      path.basename(sourcePath)
    );

    const sourceDestPath = path.join(
      __dirname,
      '../../static/assets',
      sourcePath
    );
    await fs.ensureDir(path.dirname(sourceDestPath));
    await fs.copy(sourceFilePath, sourceDestPath, { overwrite: false });
    const previewDestPath = path.join(
      __dirname,
      '../../static/assets',
      previewPath
    );
    await fs.ensureDir(path.dirname(previewDestPath));
    await fs.copy(sourceFilePath, previewDestPath, { overwrite: false });
  }
  console.log('Completed copying asset files');
}
