const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userController = {
    createNewGuestUser: async (req, res) => {
        const userIp = req.clientIp || req.ip;
        const now = new Date();

        // find all users created from this IP in the last hour
        const createdUsers = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: new Date(now.getTime() - 60 * 60 * 1000)
                },
                ipAddress: userIp
            }
        });

        // if there are more than 2 accounts created from this IP in the last hour, use the existing accounts
        if (createdUsers.length > 2) {
            return createdUsers[0];
        }

        // create a new guest user
        const randomName = "Guest" + Math.floor(Math.random() * 1000000000);
        const randomPassword = Math.random().toString(36).slice(-15);
        
        try {
            const newUser = await prisma.user.create({
                data: {
                    username: randomName,
                    password: randomPassword,
                    ipAddress: userIp
                }
            });

            return newUser;
        } catch (error) {
            return { error: true, message: error.message };
        }
    }
};

module.exports = userController;
