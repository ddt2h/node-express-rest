import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ValidationError } from 'yup';

import { TaskService } from '../services/task.service';
import { messages } from '../constants/messages';
import { createTaskSchema } from '../yup-forms/create-task'

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      await createTaskSchema.validate(req.body);
    }
    catch(error: unknown) {
      if (error instanceof ValidationError) {
        res.status(messages.validationError.statusCode).json({ message: messages.validationError.message, error: error.errors  });
      }
      return;
    }
    try {
      const task = await this.taskService.createTask(req.body);

      res.status(messages.success.statusCode).json({ message: messages.success.message, data: task });
      return;

    } catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
      return;
    }
  };

  getTasks = async (req: Request, res: Response): Promise<void> => {
    const { status, priority, dueDate, limit, page } = req.query;

    const filter = {
      status: status ? status.toString() : null,
      priority: priority ? priority.toString() : null,
      dueDate: dueDate ? dueDate.toString() : null,
      limit: Number(limit),
      page: Number(page),
    };
    try {
      const tasks = await this.taskService.getTasks(filter.status, filter.priority, filter.dueDate, filter.limit, filter.page);
      res.status(messages.success.statusCode).json({ message: messages.success.message, data: tasks });
    } catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(messages.invalidId.statusCode).json({ message: messages.invalidId.message });
      return;
    }

    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        res.status(messages.notFound.statusCode).json({ message: messages.notFound.message });
        return;
      }
      res.status(messages.success.statusCode).json({ message: messages.success.message, data: task });
    } catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(messages.invalidId.statusCode).json({ message: messages.invalidId.message });
      return;
    }

    try {
      const updatedTask = await this.taskService.updateTask(id, updateData);
      if (!updatedTask) {
        res.status(messages.notFound.statusCode).json({ message: messages.notFound.message });
        return;
      }
      res.status(messages.success.statusCode).json({ message: messages.success.message, data: updatedTask });
    } catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(messages.invalidId.statusCode).json({ message: messages.invalidId.message });
      return;
    }

    try {
      const deletedTask = await this.taskService.deleteTask(id);
      if (!deletedTask) {
        res.status(messages.notFound.statusCode).json({ message: messages.notFound.message });
        return;
      }
      res.status(messages.success.statusCode).json({ message: messages.success.message });
    } catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
    }
  };
}
