const express = require('express');
const router = express.Router();

const todoData = require("../controllers/todoDataController");
const TodoData = require("../models/TodoData");

/* If the server is starting for the very first time, the collection
will be empty - this will populate the db with a placeholder tododata
item. */ 
TodoData.find({})
  .then((data) => {
    if (data.length === 0) {
      TodoData({ order: [], todos: { init: 1 } }).save();
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB " + error)
  })

router.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

router.post("/api/todo-data", todoData.addTodo);
router.get("/api/todo-data", todoData.getTodos);

router.patch("/api/todo-data", todoData.updateOrder);
router.patch("/api/todo-data/:id", todoData.updateTodo);

router.delete("/api/todo-data/completed", todoData.deleteCompletedTodos);
router.delete("/api/todo-data/:id", todoData.deleteTodo);

module.exports = router;
