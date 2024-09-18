import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from '@vendure/core';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { BcryptJSPasswordHashingStrategy } from './compatibility/bcryptjs-hashing-strategy';

const dbData = fs.readFileSync(path.join(__dirname, '../db-data'), 'utf-8');
const dbDataArray = new Uint8Array(dbData.split(',').map((n) => +n));

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: 'superadmin',
      password: 'superadmin',
    },
    cookieOptions: {
      secret: 'a52bfc12gg4s33',
    },
    passwordHashingStrategy: new BcryptJSPasswordHashingStrategy(),
  },
  dbConnectionOptions: {
    type: 'sqljs',
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    logging: false,
    database: dbDataArray,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      //   assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
      adminUiConfig: {
        apiPort: 3000,
        tokenMethod: 'bearer',
      },
    }),
  ],
};
