import mongoose from 'mongoose';

export interface ITask {
  title: string;
  status: 'new' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const TaskSchema: mongoose.Schema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'in progress', 'completed'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: { type: Date },
}, {
  timestamps: true
});

export default mongoose.model<ITask>('Task', TaskSchema);
