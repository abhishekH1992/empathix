import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB DocumentClient
const dynamodb = new DynamoDB.DocumentClient();

// Define the DynamoDB table name
const TABLE_NAME = 'Tasks';

/**
 * Main Lambda handler function
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 */
export const handler = async (event) => {
    const { httpMethod, pathParameters, body } = event;

    try {
        let response;
        // Route the request based on HTTP method
        switch (httpMethod) {
        case 'POST':
            response = await createTask(JSON.parse(body));
            break;
        case 'GET':
            response = await getTask(pathParameters.id);
            break;
        case 'PUT':
            response = await updateTask(pathParameters.id, JSON.parse(body));
            break;
        case 'DELETE':
            response = await deleteTask(pathParameters.id);
            break;
        default:
            throw new Error(`Unsupported method "${httpMethod}"`);
        }
        // Return successful response
        return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
        };
    } catch (error) {
        console.error(error);
        // Return error response
        return {
            statusCode: error.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};

/**
 * Create a new task
 * @param {Object} taskData - The task data to create
 * @returns {Object} The created task
 */
const createTask = async (taskData) => {
    const task = {
        id: uuidv4(),
        ...taskData,
        createdAt: new Date().toISOString()
    };

    await dynamodb.put({
        TableName: TABLE_NAME,
        Item: task
    }).promise();

    return task;
};

/**
 * Retrieve a task by its ID
 * @param {string} taskId - The ID of the task to retrieve
 * @returns {Object} The retrieved task
 * @throws {Error} If the task is not found
 */
const getTask = async (taskId) => {
    const result = await dynamodb.get({
        TableName: TABLE_NAME,
        Key: { id: taskId }
    }).promise();

    if (!result.Item) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

  return result.Item;
};

/**
 * Update an existing task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} taskData - The updated task data
 * @returns {Object} The updated task
 */
const updateTask = async (taskId, taskData) => {
    const { title, description, status } = taskData;

    const result = await dynamodb.update({
        TableName: TABLE_NAME,
        Key: { id: taskId },
        UpdateExpression: 'SET #title = :title, #description = :description, #status = :status',
        ExpressionAttributeNames: {
            '#title': 'title',
            '#description': 'description',
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':title': title,
            ':description': description,
            ':status': status
        },
        ReturnValues: 'ALL_NEW'
    }).promise();

    return result.Attributes;
};

/**
 * Delete a task by its ID
 * @param {string} taskId - The ID of the task to delete
 * @returns {Object} A message confirming the deletion
 */
const deleteTask = async (taskId) => {
    await dynamodb.delete({
        TableName: TABLE_NAME,
        Key: { id: taskId }
    }).promise();

    return { message: 'Task deleted successfully' };
};