import { MongooseQueryOptions } from "mongoose";
import Task, { ITask } from "../models/task.model";

export class TaskService {
  async createTask(data: Partial<ITask>): Promise<ITask> {
    const task = new Task({
      title: data.title,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
    });
    return task.save();
  }

  async getTasks(status: string | null, priority: string | null, dueDate: string | null): Promise<ITask[]> {
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

    return Task.find(query).exec();
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
