/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: The task was successfully deleted
 *       404:
 *         description: Task not found
 *       400:
 *         description: Invalid ID supplied
 *       500:
 *         description: Server error
 */
