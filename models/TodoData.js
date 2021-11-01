const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoDataSchema = Schema({
  order: {
    type: Array,
    required: true,
  },

  todos: {
    type: Object,
    required: true,
  },
});

module.exports = TodoData = mongoose.model("TodoData", todoDataSchema);
