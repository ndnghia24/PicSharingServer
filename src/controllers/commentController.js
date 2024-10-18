const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userController = require('./userController');

const commentController = {
    createComment: async (req, res) => {
        const postId = parseInt(req.params.id);
        let { userId, description, imageUrls } = req.body;

        // Check if post exists, if not return 404
        const post = await prisma.post.findFirst({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check user exists in database, if userId = null, create a new user
        let user;
        if (userId != null) {
            user = await prisma.user.findUnique({ where: { username: userId } });
        }
        if (!user) {
            const newUser = await userController.createNewGuestUser(req, res);
            if (newUser.error) {
                return handleError(res, newUser.message, null, 429);
            }
            userId = newUser.username;
        }

        try {
            // Validate imageUrls and description
            validateCommentInput(description, imageUrls);

            const content = JSON.stringify({ description, imageUrls });
            
            // Validate post input to fit schema datatypes
            if (userId.length > 255) {
                return res.status(400).json({ message: "Invalid userId" });
            }

            const newPost = await prisma.comment.create({ data: { postId, userId, content } });
            res.status(201).json(formatPostAndComment(newPost));
        } catch (error) {
            res.status(500).json({ message: "Error creating comment", error: error.message });
        }
    },

    getComments: async (req, res) => {
        const postId = parseInt(req.params.id);

        try {
            const post = await prisma.post.findUnique({ where: { id: postId } });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const comments = await prisma.comment.findMany({
                where: { postId },
                select: {
                    userId: true,
                    content: true,
                    createdAt: true
                }
            });

            res.json(comments.map(formatPostAndComment));
        } catch (error) {
            res.status(500).json({ message: "Error retrieving comments", error: error.message });
        }
    }
};

const formatPostAndComment = (post) => {
    const content = JSON.parse(post.content);
    return {
        id: post.id,
        userId: post.userId,
        description: content.description,
        imageUrls: content.images || content.imageUrls || [],
        createdAt: post.createdAt,
    };
};


// Validate post input
const validateCommentInput = (description, imageUrls) => {
    if (description.length === 0) {
        throw new Error("Invalid description");
    }
};

module.exports = commentController;
