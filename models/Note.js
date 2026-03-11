const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
      tags: {
    type: [String],
    default: []
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
    color: {
    type: String,
    enum: [null, 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],
    default: null
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", noteSchema);