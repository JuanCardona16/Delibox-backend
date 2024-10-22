import app from "../config/app.ts";
import { PORT } from "@/config/constants";  

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} -> http://localhost:${PORT}`);
  console.log("Preciona ctrol + C para detener el servicio");
});
