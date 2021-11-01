const todoDataService = require("./todoDataService");
const TodoData = require("../models/TodoData");
const mongoose = require("../db");

describe("TodoData Service", () => {
  beforeEach(async () => {
    await TodoData.deleteMany({});
  });
  it("adds a todo and returns it with id", async () => {
    const todoData = {
      name: "Add entry",
      desc: "Personal log",
      dateCreated: "1622077232207",
      tags: ["caput"],
      pomodoroCount: 0,
    };

    const actual = await todoDataService.addTodo(todoData);

    expect(actual.order).toBeTruthy();
  });

  it("returns all the todo-data saved", async () => {
    const todo1 = {
      name: "Add entry",
      desc: "Personal log",
      dateCreated: "1622077232207",
      tags: ["caput"],
      pomodoroCount: 0,
    };
    const todo2 = {
      name: "Rep building",
      desc: "Physical training",
      dateCreated: "1622077232209",
      tags: ["manu"],
      pomodoroCount: 0,
    };
    await todoDataService.addTodo(todo1);
    await todoDataService.addTodo(todo2);

    const actual = await todoDataService.getTodos();

    expect(actual.order.length).toEqual(2);
  });

  it("updates the todo order", async () => {
    const todo1 = {
      name: "Add entry",
      desc: "Personal log",
      dateCreated: "1622077232207",
      tags: ["caput"],
      pomodoroCount: 0,
    };
    const todo2 = {
      name: "Rep building",
      desc: "Physical training",
      dateCreated: "1622077232209",
      tags: ["manu"],
      pomodoroCount: 0,
    };
    const returnedTodo1 = await todoDataService.addTodo(todo1);
    const returnedTodo2 = await todoDataService.addTodo(todo2);

    await todoDataService.updateOrder({
      "order": [returnedTodo2.order[1], returnedTodo2.order[0]]
    });

    const actual = await todoDataService.getTodos();
    expect(Array.from(actual.order)).toEqual([returnedTodo2.order[1], returnedTodo2.order[0]]);
  })

  it("updates the todo name and desc", async () => {
    const todo1 = {
      name: "Add entry",
      desc: "Personal log",
      dateCreated: "1622077232207",
      tags: ["caput"],
      pomodoroCount: 0,
    };

    const returnedTodo1 = await todoDataService.addTodo(todo1);

    await todoDataService.updateTodo( returnedTodo1.order[0], {
      "name": "New Name",
      "dateCompleted": "1622083278575"
    });

    const actual = await todoDataService.getTodos();
    expect(actual.todos[actual.order[0]].name).toEqual("New Name");
    expect(actual.todos[actual.order[0]].dateCompleted).toEqual("1622083278575");
  })

  it('deletes the todo, given id', async () => {
    const todo1 = {
      name: "Add entry",
      desc: "Personal log",
      dateCreated: "1622077232207",
      tags: ["caput"],
      pomodoroCount: 0,
    };
    const todo2 = {
      name: "Rep building",
      desc: "Physical training",
      dateCreated: "1622077232209",
      tags: ["manu"],
      pomodoroCount: 0,
    };
    const returnedTodo1 = await todoDataService.addTodo(todo1);
    const returnedTodo2 = await todoDataService.addTodo(todo2);

    const todoId1 = returnedTodo1.order[0];

    await todoDataService.deleteTodo(todoId1);

    const actual = await todoDataService.getTodos();
    expect(actual.order.length).toEqual(1);
    expect(actual.todos[todoId1]).toBeFalsy();

  })
  
});
