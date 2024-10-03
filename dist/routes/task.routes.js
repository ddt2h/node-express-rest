"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
const taskController = new task_controller_1.TaskController();
router.post('/', taskController.createTask);
//router.get('/users/:id', userController.getUserById);
exports.default = router;
