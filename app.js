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

let events = [];

app.use(
  "/graphql",
  grqphqlHTTP({
    graphiql: true,
    schema: buildSchema(`
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type Event{
            id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(event: EventInput): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: ({ event: { title, description, price, date } }) => {
        const newObj = {
          id: Math.random().toString(),
          title,
          description,
          price: +price,
          date
        };
        events = [...events, newObj];
        return newObj;
      }
    }
  })
);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> [Server] listening on port ${PORT}`);
});
