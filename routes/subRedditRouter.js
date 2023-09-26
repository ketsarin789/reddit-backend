import express from "express";
import { prisma } from "../index.js";

export const subredditRouter = express.Router();

subredditRouter.get("/", async (req, res) => {
  console.log("GET /subreddit route started");
  try {
    const subreddits = await prisma.subreddit.findMany();
    res.send({
      success: true,
      subreddits,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//POST
subredditRouter.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    if (!req.user.id) {
      return res.send({
        success: false,
        error: "Please login.",
      });
    }
    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        userId: req.user.id,
      },
    });
    res.send({
      success: true,
      subreddit,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//DELETE

subredditRouter.delete("/:subredditId", async (req, res) => {
  const { subredditId } = req.params;

  try {
    //look for subreddit by id
    const subredditCheck = await prisma.subreddit.findUnique({
      where: {
        id: subredditId,
      },
    });
    //check if subreddit is exsit
    if (!subredditCheck) {
      return res.send({
        success: false,
        error: "Subreddit not found",
      });
    }
    //if subreddit creator is not the same user requesting to delete the subreddit,return false
    if (subredditCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User not authorized to delete this subreddit.",
      });
    }
    const deleteSubreddit = await prisma.subreddit.delete({
      where: { id: subredditId },
    });
    return res.send({
      success: true,
      deleteSubreddit,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});
