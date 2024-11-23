import "tsconfig-paths/register";
import { ApiGlobalPrefix, ApiGlobalPrefixRouteNotFound } from "./constants";
import dotenv from "dotenv";
import express from "express";
import { corsConfig, errorGlobalHandler, handleNotFound, setHeaders } from "./api";
import { URL_DATABASE } from "./constants";
import { connectToDatabaseMongoAtlas } from "./database";
import router from "./routes/routes.ts";
import cookieParse from 'cookie-parser'

dotenv.config();

const app = express();

// Coneccion a la base de datos
connectToDatabaseMongoAtlas(URL_DATABASE);

app.use(express.json());
app.use(cookieParse())
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.use(setHeaders);
app.use(corsConfig());

// Middleware global para manejo de errores
app.use(errorGlobalHandler);

app.disable("x-powered-by");

// Rutes
app.use(ApiGlobalPrefix, router);
app.use(ApiGlobalPrefixRouteNotFound, handleNotFound);
// Fastify (ejemplo)
app.get('/ping', async (request, res) => {
  res.send({ status: 'ok' });
});

export default app;
