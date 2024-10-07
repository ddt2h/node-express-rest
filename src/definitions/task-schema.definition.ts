/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of your task
 *         status:
 *           type: string
 *           description: The task status
 *           enum:
 *             - new
 *             - in progress
 *             - completed
 *         priority:
 *           type: boolean
 *           description: The task priority
 *           enum:
 *              - low
 *              - medium
 *              - high
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The date of the task
 *       example:
 *         id: d5fE_asz
 *         title: Test task
 *         status: new
 *         priority: medium
 *         dueDate: 2020-03-10T04:05:06.157Z
 */
