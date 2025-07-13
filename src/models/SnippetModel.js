const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true,
    minlength : 3,
    maxlength : 300
  },
 language: { 
  type: String,
  enum: ["plaintext", "javascript", "python", "java", "c++", "html", "css"],
  default: "plaintext"
},
  isPublic: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, { timestamps: true });


const SnippetModel = mongoose.model("snippet", snippetSchema);


module.exports = {SnippetModel}
