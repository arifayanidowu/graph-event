require("dotenv").config();
const express = require("express");
const cors = require("cors");
const grqphqlHTTP = require("express-graphql");
const app = express();
const { buildSchema } = require("graphql");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/graphql",
  grqphqlHTTP({
    graphiql: true,
    schema: buildSchema(`
        input eventInput {
            id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type Event{
            id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event]!
        }

        type RootMutation {
            createEvent(name: String): String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["Romantic cooking", "Sailing", "All-Night coding"];
      },
      createEvent: args => {
        const eventName = args.name;
        return eventName;
      }
    }
  })
);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> [Server] listening on port ${PORT}`);
});
