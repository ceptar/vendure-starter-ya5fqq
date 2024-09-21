"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDemoAssets = void 0;
const core_1 = require("@vendure/core");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function copyDemoAssets(app) {
    const connection = app.get(core_1.TransactionalConnection);
    const assets = await connection.rawConnection.getRepository(core_1.Asset).find();
    console.log(`Copying ${assets.length} asset files...`);
    for (const asset of assets) {
        const sourcePath = asset.source.replace(/\\/g, path_1.default.sep);
        const previewPath = asset.preview.replace(/\\/g, path_1.default.sep);
        const sourceFilePath = path_1.default.join(__dirname, '../../node_modules/@vendure/create/assets/images/', path_1.default.basename(sourcePath));
        const sourceDestPath = path_1.default.join(__dirname, '../../static/assets', sourcePath);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(sourceDestPath));
        await fs_extra_1.default.copy(sourceFilePath, sourceDestPath, { overwrite: false });
        const previewDestPath = path_1.default.join(__dirname, '../../static/assets', previewPath);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(previewDestPath));
        await fs_extra_1.default.copy(sourceFilePath, previewDestPath, { overwrite: false });
    }
    console.log('Completed copying asset files');
}
exports.copyDemoAssets = copyDemoAssets;
