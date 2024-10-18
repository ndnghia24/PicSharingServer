const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed users
  const users = [
    {
      username: 'user1',
      password: 'password1'
    },
    {
      username: 'user2',
      password: 'password2'
    }
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Seed posts
  const posts = [
    {
      userId: 'user1',
      content: JSON.stringify({
        description: 'This is the first post!',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      })
    },
    {
      userId: 'user1',
      content: JSON.stringify({
        description: 'This is the second post!',
        images: [
          'https://example.com/image3.jpg'
        ]
      })
    },
    {
      userId: 'user2',
      content: JSON.stringify({
        description: 'This is a post from user2!',
        images: []
      })
    }
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  // Seed comments
  const comments = [
    {
      postId: 1, // postId cho bài viết đầu tiên
      userId: 'user1',
      content: JSON.stringify({
        description: 'Great post!',
        images: []
      })
    },
    {
      postId: 1,
      userId: 'user2',
      content: JSON.stringify({
        description: 'Thanks for sharing!',
        images: []
      })
    },
    {
      postId: 2,
      userId: 'user1',
      content: JSON.stringify({
        description: 'Looking forward to more posts!',
        images: []
      })
    }
  ];

  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
