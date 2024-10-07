/**
 * @swagger
 * tags:
 *   name: Task
 *   description: The task managing API
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */