import { MongooseQueryOptions } from 'mongoose';

import Task, { ITask } from '../models/task.model';

export class TaskService {
  async createTask(data: Partial<ITask>): Promise<ITask> {
    return Task.create({
      title: data.title,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
    });
  }

  async getTasks(
    status: string | null,
    priority: string | null,
    dueDate: string | null,
    limit = 10,
    page = 1 
  ): Promise<ITask[]> {
    const query: MongooseQueryOptions = {};
  
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (dueDate) {
      query.dueDate = { $lte: new Date(dueDate) };
    }

    const validLimit = Math.max(limit, 1);
    const validPage = Math.max(page, 1);
  
    const options = {
      limit: validLimit,
      skip: (validPage - 1) * validLimit,
    };
  
    return Task.find(query).limit(options.limit).skip(options.skip).exec();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return Task.findById(id).exec();
  }

  async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return Task.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteTask(id: string): Promise<ITask | null> {
    return Task.findByIdAndDelete(id).exec();
  }
}
