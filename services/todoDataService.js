// Calling .config() will allow dotenv to pull environment variables from our .env file...
require('dotenv').config();
// ...made available from process.env
const TableName = process.env.TABLE_NAME;
// You'll need to call dynamoClient methods to envoke CRUD operations on the DynamoDB table
const dynamoClient = require('../db');
// uuid, useful for generating unique ids
const uuid = require("uuid");
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

module.exports = class TodoDataService {
  static async addTodo(todo) {
    const id = uuid.v4();
    todo.id = id;

    const params = {
      TableName, // "tododata"
    };

    try {
      // Check the "tododata" table for existing a tododata item
      // let existingTodoData = ...
      let existingTodoData = await dynamoClient.scan(params).promise().then((data) => {
        return data;
      });
      
      // no tododata exists yet
      if (existingTodoData.Items.length === 0) {
        const newTodoData = {
          order: [],
          todos: {}
        };
        newTodoData.id = "0";
        newTodoData.order.push(id);
        newTodoData.todos[id] = todo;
        
        // Add a new tododata placeholder item to the "tododata" table
        const params = {
          TableName,
          Item: newTodoData,
        }
        // ...
          await dynamoClient.put(params).promise();

        // Return the newly created tododata item
      } else { // a tododata item already exist
        existingTodoData = existingTodoData.Items[0];
        existingTodoData.order.push(id);
        existingTodoData.todos[id] = todo;
        
        // Replace the existing tododata item with the new one, created in the above three lines
        const params = {
          TableName,
          Item: existingTodoData,
        }
        // ...
        await dynamoClient.put(params).promise();
      }

      let newItem = await dynamoClient.scan(params).promise().then((data) => {
        return data;
      });
      return newItem.Items[0];
        // Return the newly created tododata item
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  static async getTodos() {
    try {
      const params = {
        TableName,
        Key: {
          id: "0"
        }
      }
      let newItem = await dynamoClient.scan(params).promise().then((data) => {
        return data;
      });
      return newItem.Items[0];
      // Check the "tododata" table for the tododata item, and return it
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  static async updateOrder(options) {
    try {
      const params = {
        TableName,
        Key: {
          id: "0"
        },
        UpdateExpression: "SET #order = :order",
        ExpressionAttributeNames: {
          "#order":"order"
        },
        ExpressionAttributeValues: {
          ":order":options.order
        },
      }

      // Update the tododata item
      await dynamoClient.update(params).promise()
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  static async updateTodo(id, options) {
    try {
      let params = {
        TableName,
        Key: {
          id: "0"
        }
      }

      // Check the "tododata" table for the tododata item, and set it to "existingTodo"
      let existingTodos = await dynamoClient.scan(params).promise().then((data) => {
        return data.Items[0];
      });

      let existingTodo = existingTodos.todos[id]

      for(let key in options) {
        existingTodo[key] = options[key];
      }

      params = {
        TableName,
        Key: {
          id: "0"
        },
        UpdateExpression: "SET #update = :update",
        ExpressionAttributeNames: {
          "#update": "todos"
        },
        ExpressionAttributeValues: {
          ":update": existingTodos.todos
        },
      }
      
      await dynamoClient.update(params).promise();
      // Replace the existing tododata item with the updated one
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async deleteTodo(id) {
    try {
      let params = {
        TableName,
        Key: {
          id: "0"
        }
      }

      // Check the "tododata" table for the tododata item, and set it to "existingTodo"
      let existingTodos = await dynamoClient.scan(params).promise().then((data) => {
        return data.Items[0];
      });

      let existingTodo = existingTodos.todos[id]

      existingTodos.order = existingTodos.order.filter((orderId) => {
        return orderId !== id
      });

      delete existingTodos.todos[id];

      params = {
        TableName,
        Item: {
          ...existingTodos
        }
      }

      await dynamoClient.put(params).promise();
      // Replace the existing tododata item with the updated one
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async deleteCompletedTodos() {
    try {
      let params = {
        TableName,
        Key: {
          id: "0"
        }
      }

      let existingTodo = await dynamoClient.scan(params).promise().then((data) => {
          return data.Items[0];
      });

      existingTodo.order = existingTodo.order.filter((orderId) => {
        return !existingTodo.todos[orderId].completed;
      });
      for (let id in existingTodo.todos) {
        if (existingTodo.todos[id].completed) {
          delete existingTodo.todos[id];
        }
      }
      
      params = {
        TableName,
        Item: {
          ...existingTodo
        }
      }

      await dynamoClient.put(params).promise();
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
