const path = require('path');
const dirname = require('path');
const fileURLToPath = require('url');
const swaggerAutogen = require('swagger-autogen');

const doc = {
  // общая информация
  info: {
    title: 'Kitchen API',
    description: 'API бэкенда проектной кухни',
  },
  // модели
  definitions: {
    // модель автора статьи
    Author: {
      username: 'John Smith',
      image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
      bio: 'My name is John',
      following: false,
    },
    // модель статьи
    Article: {
      slug: 'title-4ez0lb',
      title: 'title',
      description: 'about my acticle',
      body: 'lorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
      createdAt: '2022-04-25T02:21:26.643Z',
      updatedAt: '2022-04-25T02:21:26.643Z',
      tagList: ['tag1', 'tag2'],
      favorited: false,
      favoritesCount: 3,
      author: {
        $ref: '#/definitions/Author',
      },
    },
    // модель статьи, добавленной в избранное
    FavoritedArticle: {
      slug: 'title-4ez0lb',
      title: 'My Article!',
      description: 'About my acticle',
      body: 'LorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
      createdAt: '2022-04-25T02:21:26.643Z',
      updatedAt: '2022-04-25T02:21:26.643Z',
      tagList: ['tag1', 'tag2'],
      favorited: true,
      favoritesCount: 3,
      author: {
        $ref: '#/definitions/Author',
      },
    },
    // модель массива статей
    Articles: [
      {
        $ref: '#/definitions/Article',
      },
    ],
    // модель аутентификация
    Auth: {
      user: {
        username: 'John Smith',
        email: 'john@gmail.com',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmVjZmNmNjQ4N2Y4MDAxNDJiNDFhYSIsInVzZXJuYW1lIjoiMTIzIiwiZXhwIjoxNjU2NjEzMzI3LCJpYXQiOjE2N',
        bio: 'My name is John',
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
      },
    },
    // модель профиля пользователя
    Profile: {
      profile: {
        username: 'John Smith',
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        bio: 'My name is John',
        following: false,
      },
    },
    // модель профиля пользователя, которого зафолловили
    NewFollowing: {
      profile: {
        username: 'Thomas Andersen',
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        bio: 'My name is Neo',
        following: true,
      },
    },
    // модель комментария
    Comment: {
      id: "626ee769ccf6c3001528370e",
      body: 'Awesome comment about anything!',
      createdAt: '2022-04-25T02:21:26.643Z',
      author: {
        $ref: '#/definitions/Author',
      },
    },
    // модель массива комметариев
    Comments: {
      comments: [
        {
          $ref: '#/definitions/Comment',
        },
      ],
    },
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

// путь и название генерируемого файла
const outputFile = path.join(__dirname, 'output.json');
// массив путей к роутерам
const endpointsFiles = [path.join(__dirname, '../routes/index.js')];

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(
  ({ success }) => {
    console.log(`Generated: ${success}`);
  },
);
