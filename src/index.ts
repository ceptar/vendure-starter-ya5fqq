import { bootstrap, runMigrations, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';
import fs from 'fs';
import { copyDemoAssets } from './compatibility/copy-demo-assets';

runMigrations(config)
  .then(() => bootstrap(config))
  .then(async (app) => {
    await copyDemoAssets(app);
    return app.get(JobQueueService).start();
  })
  .catch((err: any) => {
    console.log(err);
  });
