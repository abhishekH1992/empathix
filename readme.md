# Serverless Tasks API

This project is a serverless application built on AWS, providing a simple API for managing tasks. It uses AWS Lambda, API Gateway, and DynamoDB to create a scalable and efficient task management system.

## Features

- Create new tasks
- Retrieve task details
- Update existing tasks
- Delete tasks

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (usually comes with Node.js)
- AWS CLI (configured with your AWS credentials)
- Git

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/abhishekH1992/empathix.git
cd empathix
```

### Install Dependencies

```bash
npm install
```

### Set Up AWS Resources

1. Create a DynamoDB table:
   - Table name: Tasks
   - Partition key: id (String)

2. Create a Lambda function:
   - Name: TasksFunction
   - Runtime: Node.js 14.x
   - Handler: index.handler
   - Upload the code from `src/index.js`

3. Set up API Gateway:
   - Create a new REST API
   - Create resources and methods for /tasks (POST) and /tasks/{id} (GET, PUT, DELETE)
   - Integrate each method with the Lambda function

4. Update the Lambda function's IAM role to allow DynamoDB actions on the Tasks table

## Local Development

To run the project locally:

```bash
npm start
```

Note: This will run the Lambda function code directly, which doesn't simulate the complete AWS environment. For a more accurate local testing experience, consider using AWS SAM or the Serverless Framework.

## API Endpoints

- POST /tasks - Create a new task
- GET /tasks/{id} - Retrieve a task by ID
- PUT /tasks/{id} - Update a task
- DELETE /tasks/{id} - Delete a task

## Testing the API

You can use tools like cURL or Postman to test the API. Here are some example cURL commands:

1. Create a task:
   ```
   curl -X POST https://your-api-url/tasks -H "Content-Type: application/json" -d '{"title": "New Task", "description": "Task description", "status": "pending"}'
   ```

2. Get a task:
   ```
   curl https://your-api-url/tasks/{task-id}
   ```

3. Update a task:
   ```
   curl -X PUT https://your-api-url/tasks/{task-id} -H "Content-Type: application/json" -d '{"title": "Updated Task", "description": "Updated description", "status": "completed"}'
   ```

4. Delete a task:
   ```
   curl -X DELETE https://your-api-url/tasks/{task-id}
   ```

Replace `your-api-url` with the actual API Gateway endpoint URL.