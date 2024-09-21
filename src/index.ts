import { bootstrap, runMigrations, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
  .then(() => bootstrap(config))
  .then(async (app) => {

    return app.get(JobQueueService).start();
  })
  .catch((err: any) => {
    console.log(err);
  });
