import express from "express";

import { prisma } from "../index.js";

export const voteRouter = express.Router();

voteRouter.post("/downvotes/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const downvoteCheck = await prisma.downvotes.findUnique({
      where: {
        // postId,
        // userId: req.user.id,
        id: postId,
      },
    });
    if (!downvoteCheck) {
      return res.send({
        success: false,
        error: "The votes does not exist",
      });
    }
    if (!req.user.id) {
      return res.send({
        success: false,
        error: "Please login.",
      });
    }
    const downvote = await prisma.downvotes.create({
      data: {
        userId: req.user.id,
        postId,
      },
    });
    res.send({
      success: true,
      downvote,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});
//delete downvotes

voteRouter.delete("/downvotes/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const downvoteCheck = await prisma.downvotes.findUnique({
      where: {
        id: postId,
      },
    });
    if (!downvoteCheck) {
      return res.send({
        success: false,
        error: "The votes does not exist",
      });
    }
    if (downvoteCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User not authorized to vote this content.",
      });
    }
    const deleteDownvote = await prisma.downvotes.delete({
      where: {
        userId: req.body.id,
        postId,

        // _postId: { userId: req.user.id, postId },
      },
    });
    res.send({
      success: true,
      deleteDownvote,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

//upvotes
voteRouter.post("/upvotes/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    if (!req.user.id || !req.user) {
      return res.send({
        success: false,
        error: "Please login to vote.",
      });
    }
    //create new uppost
    const upvote = await prisma.upvotes.create({
      data: {
        userId: req.user.id,
        postId: postId,
      },
    });
    res.send({
      success: true,
      upvote,
    });
  } catch (error) {
    return res.send({
      success: true,
      error: error.message,
    });
  }
});

//delete upvote
voteRouter.delete("/upvotes/:postId", async (req, res) => {
  try {
    const upvoteCheck = await prisma.upvotes.findUnique({
      where: {
        id: postId,
      },
    });
    //check is the vote is exsit
    if (!upvoteCheck) {
      return res.send({
        success: false,
        error: "The votes does not exist",
      });
    }
    if (upvoteCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User not authorized to votes this content.",
      });
    }
    const { postId } = params;

    const upvotes = await prisma.upvotes.delete({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
        // userId: req.user.id,
        // postId,
        // id: postId,
      },
    });
    res.send({
      success: true,
      upvotes,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});
