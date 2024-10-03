"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
class TaskController {
    constructor() {
        this.createTask = async (req, res) => {
            const { title, description, status, priority, dueDate } = req.body;
            if (!title || !status) {
                res.status(400).json({ message: 'Title and status are required' });
                return;
            }
            try {
                const task = await this.taskService.createTask({
                    title,
                    description,
                    status,
                    priority,
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                });
                res.status(201).json(task);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Error occured', error });
                return;
            }
        };
        this.getTasks = async (req, res) => {
        };
        this.taskService = new task_service_1.TaskService();
    }
}
exports.TaskController = TaskController;
