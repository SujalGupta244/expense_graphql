import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv'
import path from 'path';

import passport from 'passport'
import session  from 'express-session';
import connectMongo from 'connect-mongodb-session'
import {  buildContext } from "graphql-passport";

import { ApolloServer } from "@apollo/server"
// import { startStandaloneServer } from "@apollo/server/standalone"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {connectDB} from './db/connectDB.js'
import { configurePassport } from './passport/passport.config.js';

import mergeResolver from "./resolvers/index.js"
import mergeTypeDef from "./typeDefs/index.js"
 
dotenv.config()
configurePassport()

const __dirname = path.resolve()

const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
})

store.on("error",(err)=> console.log(err))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this option specifies whether to save the session to the store on every request
    saveUninitialized: false, // option specifies whether to save uninitialized sessions
    cookie:{
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week 
      httpOnly: true // this option prevents the Cross site scripting (XSS) attack
    },
    store: store
  })
)

app.use(passport.initialize())
app.use(passport.session())


const server = new ApolloServer({
  typeDefs : mergeTypeDef,
  resolvers: mergeResolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();



app.use(
  '/graphql',
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req,res }) => buildContext({ req,res }),
  }),
);

// npm run build will make frontend app, and it will the optimzied version of the app
app.use(express.static(path.join(__dirname,"frontend/dist")))

app.get("*" ,(req, res) =>{
  res.sendFile(path.join(__dirname,"frontend/dist","index.html"))
})

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB()

console.log(`🚀 Server ready at http://localhost:4000/graphql`);

// const { url } = await startStandaloneServer(server)
// console.log(`🚀 Server ready at ${url}`)