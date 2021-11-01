const todoDataService = require("../services/todoDataService");

module.exports = class TodoDataController {
  static async addTodo(req, res) {
    try {
      const todoData = await todoDataService.addTodo(req.body);
      res.status(201).json(todoData);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getTodos(req, res) {
    try {
      const todoData = await todoDataService.getTodos();
      res.status(200).send(todoData);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async updateOrder(req, res) {
    try {
      await todoDataService.updateOrder(req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async updateTodo(req, res) {
    try {
      await todoDataService.updateTodo(req.params.id, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const response = await todoDataService.deleteTodo(req.params.id);
      res.status(204).send(response);
    } catch(error) {
      res.status(500).json({ error });
    }
  }

  static async deleteCompletedTodos(req, res) {
    try {
      const response = await todoDataService.deleteCompletedTodos();
      res.status(204).send(response);
    } catch(error) {
      res.status(500).json({ error });
    }
  }
};
