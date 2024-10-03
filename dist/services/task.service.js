"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
class TaskService {
    async createTask(data) {
        const task = new task_model_1.default({
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority || 'medium',
            dueDate: data.dueDate,
        });
        return task.save();
    }
}
exports.TaskService = TaskService;
