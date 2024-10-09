/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: testname
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: testpassword
 *         refreshToken:
 *           type: string
 *           description: A token used for refreshing the session (optional).
 *           example: exampletoken
 *       required:
 *         - username
 *         - password
 */
