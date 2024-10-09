import Task, { ITask } from '../models/task.model';
import { TaskService } from '../services/task.service';

jest.mock('../models/task.model');

describe('TaskService', () => {
  let taskService: TaskService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully and return the task data', async () => {
      const taskData: Partial<ITask> = {
        title: 'Test Task',
        status: 'new',
        priority: 'high',
        dueDate: new Date(),
      };

      const createdTask = {
        ...taskData,
        _id: 'taskId',
      };

      (Task.create as jest.Mock).mockResolvedValueOnce(createdTask); 

      const result = await taskService.createTask(taskData);

      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(createdTask);
    });
  });

  describe('getTasks', () => {
    it('should return tasks with filters', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'high' }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks('new', 'high', null, 10, 1);

      expect(Task.find).toHaveBeenCalledWith({ status: 'new', priority: 'high' });
      expect(result).toEqual(taskData);
    });

    it('should return tasks with no filters', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'medium' }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, null, null, 10, 1);

      expect(Task.find).toHaveBeenCalledWith({});
      expect(result).toEqual(taskData);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const taskData = { title: 'Test Task' } as ITask;
      (Task.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTaskById('task-id');

      expect(Task.findById).toHaveBeenCalledWith('task-id');
      expect(result).toEqual(taskData);
    });

    it('should return null if task not found', async () => {
      (Task.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await taskService.getTaskById('invalid-id');

      expect(Task.findById).toHaveBeenCalledWith('invalid-id');
      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const taskData = { title: 'Updated Task' } as ITask;
      (Task.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.updateTask('task-id', { title: 'Updated Task' });

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('task-id', { title: 'Updated Task' }, { new: true });
      expect(result).toEqual(taskData);
    });
  });

  describe('deleteTask', () => {
    it('should delete and return the task', async () => {
      const taskData = { title: 'Deleted Task' } as ITask;
      (Task.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.deleteTask('task-id');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('task-id');
      expect(result).toEqual(taskData);
    });

    it('should return null if task to delete not found', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await taskService.deleteTask('invalid-id');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('invalid-id');
      expect(result).toBeNull();
    });
  });
});
