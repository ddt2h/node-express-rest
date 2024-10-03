"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
// MongoDB connection string from environment variable
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';
mongoose_1.default.connect(mongoURL, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/task', task_routes_1.default);
exports.default = app;
