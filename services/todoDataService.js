const uuid = require("uuid");
const TodoData = require("../models/TodoData");

module.exports = class TodoDataService {
  static async addTodo(todo) {
    const id = uuid.v4();
    todo.id = id;

    try {
      let response;
      let existingTodoData = await TodoData.find({});
      if (existingTodoData.length === 0) {
        const todoData = {};
        todoData.order = [];
        todoData.order.push(id);
        todoData.todos = {};
        todoData.todos[id] = todo;

        response = await TodoData(todoData).save();
      } else {
        existingTodoData = existingTodoData[0];
        existingTodoData.order.push(id);
        existingTodoData.todos[id] = todo;

        response = await TodoData(existingTodoData).save();
      }
      return response;
    } catch (error) {
      return error;
    }
  }

  static async getTodos() {
    try {
      const response = await TodoData.findOne({});
      return response;
    } catch (error) {
      return error;
    }
  }

  static async updateOrder(options) {
    try {
      await TodoData.findOneAndUpdate({}, options);
    } catch (error) {
      return error;
    }
  }

  static async updateTodo(id, options) {
    try {
      let existingTodo = await TodoData.findOne({});
      for (let key in options) {
        existingTodo.todos[id][key] = options[key];
      }
      await TodoData.findOneAndUpdate({}, existingTodo);
    } catch (error) {
      return error;
    }
  }

  static async deleteTodo(id) {
    try {
      let existingTodo = await TodoData.findOne({});
      existingTodo.order = existingTodo.order.filter((orderId) => {
        return orderId !== id
      });
      delete existingTodo.todos[id];
      await TodoData.findOneAndUpdate({}, existingTodo);
    } catch (error) {
      return error;
    }
  }

  static async deleteCompletedTodos() {
    try {
      let existingTodo = await TodoData.findOne({});
      existingTodo.order = existingTodo.order.filter((orderId) => {
        return !existingTodo.todos[orderId].completed;
      });
      for (let id in existingTodo.todos) {
        if (existingTodo.todos[id].completed) {
          delete existingTodo.todos[id];
        }
      }
      await TodoData(existingTodo).save();
    } catch (error) {
      return error;
    }
  }
};
