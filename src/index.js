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

        messages: [Message!]!
        message(id: ID!): Message!
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`; // adding associated 'user' to 'Message' schema establishes type relationship

const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, { id }) => {
            return messages[id];
        },
    },
    User: {
        messages: user => {
            return Object.values(messages).filter(
                message => message.userId === user.id,
            );
        },
    },
    Message: {
        user: message => {
            return users[message.userId];
        },
    },
    // all arguments in a resolver: (parent, args, context, info) => { ... }
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
        messageIds: [1],
    },
    2: {
        id: '2',
        username: 'Zazie Beetz',
        messageIds: [2],
    },
};

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'Bye World',
        userId: '2',
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: { // context of resolver, replaced let me = users[1];
        me: users[1],
    },
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
    id
  	messages {
      id
      text
      user {
        username
      }
    }
  }
  messages {
    id
    text
  }
  message(id: 2) {
    id
    text
    user {
      id
      username
    }
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
        "username": "Britney Smith",
        "id": "1",
        "messages": [
          {
            "id": "1",
            "text": "Hello World",
            "user": {
              "username": "Britney Smith"
            }
          }
        ]
      },
      {
        "username": "Zazie Beetz",
        "id": "2",
        "messages": [
          {
            "id": "2",
            "text": "Bye World",
            "user": {
              "username": "Zazie Beetz"
            }
          }
        ]
      }
    ],
    "messages": [
      {
        "id": "1",
        "text": "Hello World"
      },
      {
        "id": "2",
        "text": "Bye World"
      }
    ],
    "message": {
      "id": "2",
      "text": "Bye World",
      "user": {
        "id": "2",
        "username": "Zazie Beetz"
      }
    }
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