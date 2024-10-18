const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userController = require('./userController');

const postController = {
    getPosts: async (req, res) => {
        try {
            // sort by createdAt in descending order

            const posts = await prisma.post.findMany({
                select: {
                    id: true,
                    userId: true,
                    content: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            
            const formatedPosts = posts.map(formatPostAndComment);
            res.json(formatedPosts);

        } catch (error) {
            return handleError(res, "Error retrieving posts", error);
        }
    },

    createPost: async (req, res) => {
        let { userId, description, imageUrls } = req.body;

        try {
            // Check user exists in database, if userId = null, create a new user
            const user = await prisma.user.findFirst({ where: { username: userId } });
            if (!user || !userId) {
                const newUser = await userController.createNewGuestUser(req, res);
                if (newUser.error) {
                    return handleError(res, newUser.message, null, 429);
                }
                userId = newUser.username;
            }

            // Validate imageUrls and description
            validatePostInput(description, imageUrls);

            const content = JSON.stringify({ description, imageUrls });

            // Validate post input to fit schema datatypes
            if (userId.length > 255) {
                return res.status(400).json({ message: "Invalid userId" });
            }
            
            const newPost = await prisma.post.create({ data: { userId, content } });
            res.status(201).json(formatPostAndComment(newPost));
        } catch (error) {
            return handleError(res, "Error creating post", error);
        }
    },

    getPostById: async (req, res) => {
        const postId = parseInt(req.params.id);
        try {
            const post = await prisma.post.findFirst({ where: { id: postId } });
            if (post) {
                res.json(formatPostAndComment(post));
            } else {
                res.status(404).json({ message: "Post not found" });
            }
        } catch (error) {
            return handleError(res, "Error retrieving post", error);
        }
    },
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

// Utility function for error handling
const handleError = (res, message, error, statusCode = 500) => {
    console.error(error); // Log the error for debugging
    return res.status(statusCode).json({ message, error: error?.message });
};

// Validate post input
const validatePostInput = (description, imageUrls) => {
    if (imageUrls.length === 0) {
        throw new Error("Image URLs are required");
    }
};

module.exports = postController;
