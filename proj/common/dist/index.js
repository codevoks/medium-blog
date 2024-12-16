"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signInInput = exports.signUpInput = void 0;
const zod_1 = require("zod");
exports.signUpInput = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
    name: zod_1.z.string()
});
exports.signInInput = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.createPostInput = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.updatePostInput = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
