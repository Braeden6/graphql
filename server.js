import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const port = 4000;

const results = [];
fs.createReadStream("data/GCB2022v27_MtCO2_flat.csv")
        .pipe(csv())
        .on('data', (data) => results.push(data));


app.get("/data", (req, res) => {
    res.send(results);
  });

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});


/*


// String, Int, Float, Boolean, ID
let typeDefs = `
type Post {
  id: ID!
  description: String
  slug: String!
  updated: String
  author_id: ID!
  solution_id: ID
  title: String!
  created: String!
  test: String!
}

type Query {
    posts: [Post]
}
`;

// CONTINENT GDP_MD POP_EST NAME
  typeDefs = `
  type property {
    CONTINENT: String!
    GDP_MD: String!
    POP_EST: String!
    NAME: String!
  }

  type geometry {
    type: String!
    coordinates: [[[[Float]]]]
  }


  type country {
    type: String!
    properties : property
    geometry: geometry
  }
  
  type Query {
      countries: [country]
      test: String
      random: Int
      add(a: Int, b: Int): Int
  }
  `;
  
  let resolvers = {
      Query: {
        countries: (obj, args, context) =>  context.features,
        test: (obj, args, context) => "test",
        random: (obj, args, context) => Math.floor(Math.random() * 100),
        add: (obj, args, context) => args.a + args.b
      },
    };

    const locationsResolver = makeExecutableSchema({
      typeDefs,
      resolvers,
    });


    app.use(
        "/graphql/locations",
        graphqlHTTP({
          schema: locationsResolver,
          graphiql: true,
        })
      );
*/
