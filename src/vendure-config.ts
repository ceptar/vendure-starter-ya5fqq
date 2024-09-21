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
import { BcryptJSPasswordHashingStrategy } from './compatibility/bcryptjs-hashing-strategy';

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
  apiOptions: {
    hostname: '0.0.0.0',
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
},
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: 'superadmin',
      password: 'redubash',
    },
    cookieOptions: {
      secret: 'awdbhbjahdbaw',
      sameSite: 'strict',
    },
    passwordHashingStrategy: new BcryptJSPasswordHashingStrategy(),
  },
  dbConnectionOptions: {
    type: 'postgres',
    synchronize: true, // turn this off for production
    logging: false,
    database: 'vendurezwei',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'aergsgd5sgdr',
    migrations: [path.join(__dirname, '../migrations/*.ts')],
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
  //   assetUrlPrefix: IS_DEV ? undefined : 'https://discobabes.club/assets/',
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
    }),
  ],
};
