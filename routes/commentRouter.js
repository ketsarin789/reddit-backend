import express from "express";
import { prisma } from "../index.js";

export const commentRouter = express.Router();

commentRouter.get("/", async (req, res) => {
  console.log("GET /comment route started");
  try {
    const comment = await prisma.comments.findMany();
    res.send({
      success: true,
      comment,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//POST
commentRouter.post("/", async (req, res) => {
  const { text, title } = req.body;

  try {
    if (!text) {
      return res.send({
        success: false,
        error: "Please include text",
      });
    }
    const comment = await prisma.comments.create({
      data: {
        text,
        userId: req.user.id,
        postId,
      },
    });
    res.send({
      success: true,
      comment,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//DELETE

commentRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    //look for subreddit by id
    const commentCheck = await prisma.comments.findUnique({
      where: {
        id: postId,
      },
    });
    //check if comma is exsit
    if (!commentCheck) {
      return res.send({
        success: false,
        error: "comment not found",
      });
    }
    //if subreddit creator is not the same user requesting to delete the subreddit,return false
    if (commentCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User not authorized to delete this subreddit.",
      });
    }
    const deleteComment = await prisma.comments.delete({
      where: { id: postId },
    });
    return res.send({
      success: true,
      deleteComment,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});
