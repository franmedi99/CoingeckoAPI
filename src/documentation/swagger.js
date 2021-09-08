
/**
 * @swagger 
 * /example:
 *   get:
 *      summary: Returns a message
 *      tags: [Example]
 *      parameters:
 *             - name: example
 *               in: "body"
 *               description: "ID of pet to return"
 *               required: true
 *               type: "integer"
 *               format: "int64"
 *        
 *      responses:
 *        200:
 *          description: Use as an example
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

 /**
  * @swagger
  * tags:
  *   name: Books
  *   description: The books managing API
  */

