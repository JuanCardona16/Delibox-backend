import cors from 'cors'

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://delibox-client.onrender.com',
  'https://delibox-admin.onrender.com'
]

export const corsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      // Si el origen no está definido (ejemplo: solicitudes desde herramientas como Postman) o está en la lista permitida, permite el acceso
      console.log("Solicitud desde origen:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Origen no permitido por CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization', 'X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    preflightContinue: false,
    maxAge: 600,
    // secure: true, // Uncomment if using HTTPS
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Uncomment if using HTTPS
    // originWhitelist: ['https://example.com'], // Uncomment if using a specific origin whitelist
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Uncomment if using a specific header whitelist
    // exposedHeaders: ['Authorization', 'X-Total-count'], // Uncomment if using exposed headers
    // methods
  })
}