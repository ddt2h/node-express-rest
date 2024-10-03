import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { messages } from '../constants/messages';
import mongoose from 'mongoose';
import { ITask } from '../models/task.model';

jest.mock('../services/task.service');

describe('TaskController', () => {
  let taskController: TaskController;
  let taskServiceMock: jest.Mocked<TaskService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let req: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any; 

  const taskId: string = '66fe3f691e7ec2eeb730a795';

  beforeEach(() => {
    taskServiceMock = new TaskService() as jest.Mocked<TaskService>;
    taskController = new TaskController();
    
    req = { body: {}, params: {}, query: {} };
    res = { 
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createTask', () => {
    it('should create a task and return success response', async () => {
      req.body = {
        title: 'Test Task',
        status: 'new',
        priority: 'high',
        dueDate: '2024-10-03',
      };
      
      taskServiceMock.createTask.mockResolvedValue(req.body);

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
    });

    it('should return validation error if body is invalid', async () => {
      req.body = {};

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.validationError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        message: messages.validationError.message,
        error: expect.anything(),
      });
    });
  });

  describe('getTasks', () => {
    it('should return a list of tasks', async () => {
      const tasks = [{ title: 'Test Task' }];
      taskServiceMock.getTasks.mockResolvedValue(tasks as ITask[]);
      await taskController.getTasks(req, res);
      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
    });
  });

  describe('getTaskById', () => {
    it('should return a task if valid id is provided', async () => {
      req.params.id = taskId;
      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
    });

    it('should return 404 if task is not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();
      taskServiceMock.getTaskById.mockResolvedValue(null);

      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.notFound.message });
    });

    it('should return 400 if id is invalid', async () => {
      req.params.id = 'invalid_id';

      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });
  });

  describe('updateTask', () => {
    it('should update a task and return success', async () => {
      req.params.id = taskId;
      req.body = { title: 'Updated Task' };
      const updatedTask = { title: 'Updated Task' };
      taskServiceMock.updateTask.mockResolvedValue(updatedTask as ITask);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.success.statusCode);
    });

    it('should return 404 if task to update is not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { title: 'Updated Task' };
      taskServiceMock.updateTask.mockResolvedValue(null);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.notFound.message });
    });

    it('should return 400 if id is invalid', async () => {
      req.params.id = 'invalid_id';

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });
  });

  describe('deleteTask', () => {
    it('should return 404 if task to delete is not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();
      taskServiceMock.deleteTask.mockResolvedValue(null);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.notFound.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.notFound.message });
    });

    it('should return 400 if id is invalid', async () => {
      req.params.id = 'invalid_id';

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(messages.invalidId.statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: messages.invalidId.message });
    });
  });
});
