import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import axios from "axios";
import { importSchema } from "graphql-import";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const data = {
  warriorsAndWeapons: [
    { id: "001", name: "Jaime", lname: "Lannister" },
    { id: "002", name: "Jorah", lname: "Mormont" },
    { id: "003", name: "Daenerys", lname: "Targaryen" },
    { id: "004", name: "Tyrion", lname: "Lannister" },
    { id: "005", name: "Jon", lname: "Snow" },
    { id: "006", name: "Sansa", lname: "Stark" },
    { id: "007", name: "Arya", lname: "Stark" },
    { id: "008", name: "Bran", lname: "Stark" },
    // weapons
    { id: "009", name: "Longclaw", type: "Sword" },
    { id: "010", name: "Oathkeeper", type: "Sword" },
    { id: "011", name: "Needle", type: "Dagger" },
    { id: "012", name: "Lightbringer", type: "Sword" },
    { id: "013", name: "Ice", type: "Sword" },
    { id: "014", name: "Widow's Wail", type: "Sword" },
    { id: "015", name: "Widow's Wail", type: "Sword" },
  ],
};

let typeDefs = importSchema("./emissions.graphql");

const getEmissionsData = async () => {
  return axios.get("http://localhost:4000/data").then((response) => {
    return { Emissions: response.data};
  })
  .catch((error) => error);
};


const getFilteredEmissionsData = async (year) => {
  try {
    let data = await getEmissionsData();
    data = data.Emissions.filter((item) => item.Year == year);
    return data;
  } catch (error) {
    return error;
  }
};

const getCompanyData = async () => {
  return axios.get("http://localhost:4001/data").then((response) => {
    return response.data;
  });
};

const getMicroSoftImages = async () => {
  return axios.get("http://localhost:4002/data").then((response) => {
    return response.data;
  });
};

// Resolver for warriors
let resolvers = {
  WarriorResult: {
    __resolveType(obj, context, info) {
      if (obj.lname) {
        return "Warrior";
      }
      if (obj.type) {
        return "Weapon";
      }
      return null;
    },
  },
  EmissionsResult: {
    __resolveType(obj, context, info) {
      if (obj.Emissions) {
        return "CountryEmissions";
      }
      if (obj.port) {
        return "ConnectionError";
      }
      return null;
    },
  },
  Query: {
    getEmissions: (obj, args, context) => getEmissionsData(),
    getYear: (obj, args, context) => getFilteredEmissionsData(args.year.toString()),
    getWarriorsOrWeapons: (obj, args, context) => context.warriorsAndWeapons,
    getCompanies: (obj, args, context) => getCompanyData(),
    getCOCO: (obj, args, context) => getMicroSoftImages(),
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(
  "/graphql/",
  graphqlHTTP({
    schema: executableSchema,
    context: data,
    graphiql: true,
  })
);


app.get("/data", async (req, res) => {
    axios.get("http://localhost:4000/data").then((response) => {
      res.send(response.data);
    })
    .catch((error) => res.send(error));
});


app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});

/*

{
  
#   getCompanies { company_name}
  
#   getWarriorsOrWeapons {
#     __typename
#     ... on Warrior {
#       name
#       lname
#     }
#     ... on Weapon {
#       type
#       name
#     }
#   }
  
   # getYear(year:2020) { Country Total}
  
  getCOCO {
    info { year description}
    images { coco_url height width}
  }
  
  getEmissions { 
    __typename
    ... on CountryEmissions {
      Emissions { Country Total }
    }
    ... on ConnectionError {
      port
    }
  }
}


*/
