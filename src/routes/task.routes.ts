import { Router } from 'express';

import { TaskController } from '../controllers/task.controller';
import { verifyAuth } from '../middlewares/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.post('/', verifyAuth, taskController.createTask);
router.get('/', verifyAuth, taskController.getTasks);
router.get('/:id', verifyAuth, taskController.getTaskById);
router.put('/:id', verifyAuth, taskController.updateTask);
router.delete('/:id', verifyAuth, taskController.deleteTask);

export default router;
