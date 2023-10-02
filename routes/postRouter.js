import express from "express";
import { prisma } from "../index.js";

export const postRouter = express.Router();

// Get posts route
postRouter.get("/", async (req, res) => {
  try {
    console.log("GET /posts route started");

    // Fetch posts from the database
    const posts = await prisma.post.findMany({
      include: {
        subreddit: true,
        parent: true,
        downvotes: true,
        upvotes: true,

        user: {
          select: {
            id: true,
            username: true,
          },
        },
        children: true,
      },
    });

    // console.log("Retrieved posts:", posts);

    res.send({ success: true, posts });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

postRouter.post("/", async (req, res) => {
  const { text, title, subredditId, parentId } = req.body;

  try {
    if (!text || !subredditId) {
      return res.send({
        success: false,
        error: "Please include text, and subreddit when creating a post",
      });
    }
    if (!req.user) {
      return res.send({
        success: false,
        error: "You must login to create a post",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        text,
        subredditId,
        //from middlewear
        parentId,
        userId: req.user.id,
      },
    });
    res.send({
      success: true,
      post,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

postRouter.put("/:postId", async (req, res) => {
  const { text, title, subredditId } = req.body;
  const { postId } = req.params;
  try {
    const update = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        text,
        subredditId,
        userId: req.user.id,
      },
    });
    res.send({
      success: true,
      update,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

postRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    // error handling
    const postCheck = await prisma.post.findUnique({ where: { id: postId } });
    if (!postCheck) {
      return res.send({
        success: false,
        error: "The post you are trying to edit does not exist",
      });
    }
    if (postCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "The post you are trying to modify is not yours",
      });
    }
    // finally we update the post
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.send({
      success: true,
      post,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
