"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const core_1 = require("@vendure/core");
const asset_server_plugin_1 = require("@vendure/asset-server-plugin");
const admin_ui_plugin_1 = require("@vendure/admin-ui-plugin");
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const bcryptjs_hashing_strategy_1 = require("./compatibility/bcryptjs-hashing-strategy");
const IS_DEV = process.env.APP_ENV === 'dev';
exports.config = {
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
        passwordHashingStrategy: new bcryptjs_hashing_strategy_1.BcryptJSPasswordHashingStrategy(),
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: false, // turn this off for production
        logging: false,
        database: 'vendurezwei',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'aergsgd5sgdr',
        migrations: [path_1.default.join(__dirname, '../migrations/*.ts')],
    },
    paymentOptions: {
        paymentMethodHandlers: [core_1.dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
    plugins: [
        asset_server_plugin_1.AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path_1.default.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            //   assetUrlPrefix: IS_DEV ? undefined : 'https://discobabes.club/assets/',
        }),
        core_1.DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        core_1.DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        admin_ui_plugin_1.AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
        }),
    ],
};
