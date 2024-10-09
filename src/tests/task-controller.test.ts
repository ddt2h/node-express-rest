import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ValidationError } from 'yup';

import { TaskController } from '../controllers/task.controller';
import { messages } from '../constants/messages';
import { ITask } from '../models/task.model';

jest.mock('../services/task.service');

describe('TaskController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let taskController: TaskController;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    taskController = new TaskController();

    req = {};
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    res = {
      status: mockStatus,
    };
  });

  describe('createTask', () => {
    it('should return validation error, empty body', async () => {
      req.body = {};

      const error = new ValidationError('Validation error', '', '');
      jest.spyOn(taskController['taskService'], 'createTask').mockRejectedValue(error);

      await taskController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.validationError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.validationError.message,
        error: expect.any(Array)
      });
    });

    it('should return validation error, wrong data', async () => {
      req.body = { title: 'Test Task', status: 'invalid status', priority: 'medium' };

      const error = new ValidationError('Validation error', '', '');
      jest.spyOn(taskController['taskService'], 'createTask').mockRejectedValue(error);

      await taskController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.validationError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.validationError.message,
        error: expect.any(Array)
      });
    });

    it('should create a task', async () => {
      const mockTask: ITask = { title: 'Test Task', status: 'new', priority: 'medium' };
      jest.spyOn(taskController['taskService'], 'createTask').mockResolvedValue(mockTask);

      req.body = { title: 'Test Task', status: 'new', priority: 'medium' };

      await taskController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.success.message,
        data: mockTask,
      });
    });

    it('should return server error', async () => {
      req.body = { title: 'Test Task', status: 'new', priority: 'medium' };
      jest.spyOn(taskController['taskService'], 'createTask').mockRejectedValue(new Error('Error'));

      await taskController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.serverError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.serverError.message,
        error: expect.any(Error),
      });
    });
  });

  describe('getTasks', () => {
    it('should return tasks', async () => {
      const mockTasks: ITask[] = [{ title: 'Test Task', status: 'new', priority: 'medium' }];
      jest.spyOn(taskController['taskService'], 'getTasks').mockResolvedValue(mockTasks);

      req.query = {};

      await taskController.getTasks(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.success.message,
        data: mockTasks,
      });
    });
  });

  describe('getTaskById', () => {
    it('should return invalid ID', async () => {
      req.params = { id: 'invalid-id' };

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });

    it('should return a task', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      const mockTask: ITask = { title: 'Test Task', status: 'new', priority: 'medium' };
      jest.spyOn(taskController['taskService'], 'getTaskById').mockResolvedValue(mockTask);

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.success.message,
        data: mockTask,
      });
    });

    it('should return not found error', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      jest.spyOn(taskController['taskService'], 'getTaskById').mockResolvedValue(null);

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.notFound.message });
    });

        
  });
  describe('updateTask', () => {
    it('should return invalid ID', async () => {
      req.params = { id: 'invalid-id' };
      req.body = { title: 'Updated Task' };
    
      await taskController.updateTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });
    
    it('should return not found error', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      req.body = { title: 'Updated Task' };
    
      jest.spyOn(taskController['taskService'], 'updateTask').mockResolvedValue(null);
    
      await taskController.updateTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.notFound.message });
    });
    
    it('should update a task and return success', async () => {
      const mockTask: ITask = { title: 'Updated Task', status: 'in progress', priority: 'high' };
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      req.body = { title: 'Updated Task', status: 'in-progress', priority: 'high' };
    
      jest.spyOn(taskController['taskService'], 'updateTask').mockResolvedValue(mockTask);
    
      await taskController.updateTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.success.message,
        data: mockTask,
      });
    });
    
    it('should return server error', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      req.body = { title: 'Updated Task', status: 'in-progress', priority: 'high' };
    
      jest.spyOn(taskController['taskService'], 'updateTask').mockRejectedValue(new Error('Error'));
    
      await taskController.updateTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.serverError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.serverError.message,
        error: expect.any(Error),
      });
    });
  });
    
  describe('deleteTask', () => {
    it('should return invalid ID', async () => {
      req.params = { id: 'invalid-id' };
    
      await taskController.deleteTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });
    
    it('should return not found error', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
    
      jest.spyOn(taskController['taskService'], 'deleteTask').mockResolvedValue(null);
    
      await taskController.deleteTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.notFound.message });
    });
    
    it('should delete a task and return success', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      const mockTask: ITask = { title: 'Updated Task', status: 'in progress', priority: 'high' };
      jest.spyOn(taskController['taskService'], 'deleteTask').mockResolvedValue(mockTask);
    
      await taskController.deleteTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
      expect(mockJson).toHaveBeenCalledWith({ message: messages.success.message });
    });
    
    it('should return server error', async () => {
      req.params = { id: new mongoose.Types.ObjectId().toString() };
    
      jest.spyOn(taskController['taskService'], 'deleteTask').mockRejectedValue(new Error('Error'));
    
      await taskController.deleteTask(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(messages.serverError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        message: messages.serverError.message,
        error: expect.any(Error),
      });
    });
  })
});
