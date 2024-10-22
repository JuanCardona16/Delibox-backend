import "tsconfig-paths/register";
import { ApiGlobalPrefix, ApiGlobalPrefixRouteNotFound } from "./constants";
import dotenv from "dotenv";
import express from "express";
import { corsConfig, errorGlobalHandler, handleNotFound, setHeaders } from "./api";
import { URL_DATABASE } from "./constants";
import { connectToDatabaseMongoAtlas } from "./database";
import router from "./routes/routes.ts";

dotenv.config();

const app = express();

// Coneccion a la base de datos
connectToDatabaseMongoAtlas(URL_DATABASE);

app.use(express.json());
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.use(setHeaders);
app.use(corsConfig());

// Middleware global para manejo de errores
app.use(errorGlobalHandler);

app.disable("x-powered-by");

// Rutes
app.use(ApiGlobalPrefix, router);
app.use(ApiGlobalPrefixRouteNotFound, handleNotFound);



export default app;
