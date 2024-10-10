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

    it('should throw an error if task creation fails', async () => {
      const taskData: Partial<ITask> = {
        title: 'Test Task',
        status: 'new',
        priority: 'high',
        dueDate: new Date(),
      };
      (Task.create as jest.Mock).mockRejectedValueOnce(new Error('Task creation failed'));

      await expect(taskService.createTask(taskData)).rejects.toThrow('Task creation failed');
      expect(Task.create).toHaveBeenCalledWith(taskData);
    });
  });

  describe('getTasks', () => {
    it('should return tasks filtered only by status', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'high', dueDate: new Date() }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks('new', null, null, 10, 1);

      expect(Task.find).toHaveBeenCalledWith({ status: 'new' });
      expect(result).toEqual(taskData);
    });

    it('should return tasks filtered only by priority', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'medium', dueDate: new Date() }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, 'medium', null, 10, 1);

      expect(Task.find).toHaveBeenCalledWith({ priority: 'medium' });
      expect(result).toEqual(taskData);
    });

    it('should return tasks filtered only by dueDate', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'high', dueDate: new Date('2023-10-01') }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, null, '2023-10-01', 10, 1);

      expect(Task.find).toHaveBeenCalledWith({
        dueDate: { $lte: new Date('2023-10-01') },
      });
      expect(result).toEqual(taskData);
    });

    it('should return tasks filtered by status, priority, and dueDate', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'high', dueDate: new Date('2023-10-01') }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks('new', 'high', '2023-10-01', 10, 1);

      expect(Task.find).toHaveBeenCalledWith({
        status: 'new',
        priority: 'high',
        dueDate: { $lte: new Date('2023-10-01') },
      });
      expect(result).toEqual(taskData);
    });

    it('should handle missing filters gracefully', async () => {
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

    it('should throw an error if fetching tasks fails', async () => {
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValueOnce(new Error('Fetching tasks failed')),
      });

      await expect(taskService.getTasks(null, null, null, 10, 1)).rejects.toThrow('Fetching tasks failed');
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
    it('should throw an error if task update fails', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error('Task update failed')),
      });

      await expect(taskService.updateTask('invalid-id', { title: 'Updated Task' })).rejects.toThrow('Task update failed');

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('invalid-id', { title: 'Updated Task' }, { new: true });
    });

    it('should handle case when task to update does not exist', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await taskService.updateTask('invalid-id', { title: 'Updated Task' });

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('invalid-id', { title: 'Updated Task' }, { new: true });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should throw an error if task deletion fails', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error('Task deletion failed')),
      });

      await expect(taskService.deleteTask('invalid-id')).rejects.toThrow('Task deletion failed');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('invalid-id');
    });

    it('should handle case when task to delete does not exist', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await taskService.deleteTask('invalid-id');

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('invalid-id');
      expect(result).toBeNull();
    });
  });

  describe('getTasks - Pagination', () => {
    it('should return tasks with a specific limit and page', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'medium' }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, null, null, 5, 2); 

      expect(Task.find).toHaveBeenCalledWith({});
      expect(Task.find().limit).toHaveBeenCalledWith(5);
      expect(Task.find().skip).toHaveBeenCalledWith(5); 
      expect(result).toEqual(taskData);
    });

    it('should return tasks with default limit and page', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'medium' }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, null, null); 

      expect(Task.find).toHaveBeenCalledWith({});
      expect(Task.find().limit).toHaveBeenCalledWith(10); 
      expect(Task.find().skip).toHaveBeenCalledWith(0); 
      expect(result).toEqual(taskData);
    });

    it('should correctly calculate the skip value based on the page', async () => {
      const taskData = [{ title: 'Task 1', status: 'new', priority: 'medium' }] as ITask[];
      (Task.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(taskData),
      });

      const result = await taskService.getTasks(null, null, null, 5, 3); 

      expect(Task.find).toHaveBeenCalledWith({});
      expect(Task.find().limit).toHaveBeenCalledWith(5);
      expect(Task.find().skip).toHaveBeenCalledWith(10);
      expect(result).toEqual(taskData);
    });
  });
});
