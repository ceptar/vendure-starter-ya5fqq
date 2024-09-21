"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptJSPasswordHashingStrategy = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12;
/**
 * Use bcrypt-js rather than the default bcrypt, because Stackblitz cannot handle the
 * native module version.
 */
class BcryptJSPasswordHashingStrategy {
    hash(plaintext) {
        return bcryptjs_1.default.hash(plaintext, SALT_ROUNDS);
    }
    check(plaintext, hash) {
        return bcryptjs_1.default.compare(plaintext, hash);
    }
}
exports.BcryptJSPasswordHashingStrategy = BcryptJSPasswordHashingStrategy;
