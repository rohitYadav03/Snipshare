const express = require("express");
const { authenticateToken } = require("../middleware/checkAuth");
const {SnippetModel} = require("../models/SnippetModel.js")
const jwt = require("jsonwebtoken");
require("dotenv").config()

const SnippetRouter = express.Router();

SnippetRouter.post("/", authenticateToken, async(req,res) => {
try {
    const {title, code , language ,isPublic } = req.body;

if(!title || !code){
  return res.status(400).json({message : `Enter required feild`})
}

const newSnippet = new SnippetModel({
    title, code , language, isPublic, owner : req.user._id
})

await newSnippet.save();
   res.status(200).json({message : `snippet created `})

} catch (error) {
    res.status(400).json({message : `ERROR : ${error.message} `})
}
});

SnippetRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const allUserSnippets = await SnippetModel.find({ owner: req.user._id }).select("title code language");
    res.status(200).json({ snippets: allUserSnippets });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

SnippetRouter.get("/public", async (req, res) => {
  try {
    const allPublicSnippets = await SnippetModel.find({ isPublic: true }).select("title code language");
    res.status(200).json({ snippets: allPublicSnippets });
  } catch (error) {
    res.status(500).json({ message: `ERROR: ${error.message}` });
  }
});

SnippetRouter.get("/:id", async (req, res) => {
  try {
    const snippetId = req.params.id;
    const snippetDetails = await SnippetModel.findById(snippetId);

    if (!snippetDetails) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    if (snippetDetails.isPublic === true) {
      return res.status(200).json({ snippet: snippetDetails });
    }

    // For private snippet:
    const token = req.cookies.login;
    if (!token) {
      return res.status(401).json({ message: "Login required to view private snippet" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // user is the snippet owner
    if (decoded._id.toString() === snippetDetails.owner.toString()) {
      return res.status(200).json({ snippet: snippetDetails });
    } else {
      return res.status(403).json({ message: "You are not authorized to view this snippet" });
    }

  } catch (error) {
    return res.status(500).json({ message: `ERROR: ${error.message}` });
  }
});

SnippetRouter.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, code, language, isPublic } = req.body;
    const snippetId = req.params.id;

    const snippetDetails = await SnippetModel.findById(snippetId);
    if (!snippetDetails) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    if (snippetDetails.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this snippet" });
    }

    // Update only the fields that are provided
    if (title !== undefined) snippetDetails.title = title;
    if (code !== undefined) snippetDetails.code = code;
    if (language !== undefined) snippetDetails.language = language;
    if (isPublic !== undefined) snippetDetails.isPublic = isPublic;

    await snippetDetails.save();

    res.status(200).json({ message: "Snippet updated successfully", snippet: snippetDetails });
  } catch (error) {
    res.status(500).json({ message: `ERROR: ${error.message}` });
  }
});

SnippetRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const snippetDetails = await SnippetModel.findById(req.params.id);
    if (!snippetDetails) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    if (snippetDetails.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this snippet" });
    }

    await SnippetModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `ERROR: ${error.message}` });
  }
});



module.exports = { SnippetRouter }