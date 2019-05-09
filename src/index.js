import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const ENV_PORT = process.env.PORT;
const app = express();

const schema = gql`
    type Query {
        users: [User!]
        me: User
        user(id: ID!): User
    }

    type User {
        id: ID!
        username: String!
    }
`;

const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        me: () => {
            return me;
        },
    },
};

const data = {
    me: {
        username: 'Britney Smith',
    },
};

let users = {
    1: {
        id: '1',
        username: 'Britney Smith',
    },
    2: {
        id: '2',
        username: 'Zazie Beetz',
    },
};

const me = users[1];

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

app.use(cors());

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: ENV_PORT }, () => {
    console.log(`Apollo Server listening on http://localhost:${ENV_PORT}/graphql`);
});

/*
Query:
{
  user(id: 2) {
    username
  }
  me {
    username
  }
  methough: user(id: 1) {
    username
  }
  users {
    username
  }
}

Result:
{
  "data": {
    "user": {
      "username": "Zazie Beetz"
    },
    "me": {
      "username": "Britney Smith"
    },
    "methough": {
      "username": "Britney Smith"
    },
    "users": [
      {
        "username": "Britney Smith"
      },
      {
        "username": "Zazie Beetz"
      }
    ]
  }
}
*/

/**** Stubs for REST API
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(ENV_PORT, () =>
    console.log(`Example app listening on port ${ENV_PORT}!`),
);
****/