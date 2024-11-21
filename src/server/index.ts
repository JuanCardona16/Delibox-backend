import app from "../config/app.ts";
import { PORT } from "@/config/constants";  
import http from 'http';
import SocketService from '../modules/orders/service.ts'

// Socket.io setup
const server = http.createServer(app);
SocketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT} -> http://localhost:${PORT}`);
  console.log("Preciona ctrol + C para detener el servicio");
});
