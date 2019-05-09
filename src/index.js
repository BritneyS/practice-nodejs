import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const ENV_PORT = process.env.PORT;
const app = express();

const schema = gql`
    type Query {
        me: User
    }

    type User {
        username: String!
    }
`;

const resolvers = {
    Query: {
        me: () => {
            return {
                username: 'Britney Smith',
            };
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

app.use(cors());

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: ENV_PORT }, () => {
    console.log(`Apollo Server listening on http://localhost:${ENV_PORT}/graphql`);
});

/**** Stubs for REST API
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(ENV_PORT, () =>
    console.log(`Example app listening on port ${ENV_PORT}!`),
);
****/