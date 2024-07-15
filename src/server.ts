import https from "https";
import http from "http";
import fs from "fs";
import app, { init } from "@/app";

const port = +process.env.PORT || 4000;

// Configurações para ambiente de produção (SSL)
if (process.env.NODE_ENV === "production") {
  console.log("Server is running in production mode.");
  const sslOptions = {
    key: fs.readFileSync("/var/www/html/ponto/apps.falefacilvoip.com.br.key"),
    cert: fs.readFileSync("/var/www/html/ponto/apps.falefacilvoip.com.br.crt"),
  };

  init().then(() => {
    https.createServer(sslOptions, app).listen(port, () => {
      console.log(`Server is listening on port ${port} with HTTPS.`);
    });
  });
}
// Configurações para ambiente de desenvolvimento (HTTP)
else {
  console.log("Server is running in development mode.");
  init().then(() => {
    http.createServer(app).listen(port, () => {
      console.log(`Server is listening on port ${port} with HTTP.`);
    });
  });
}
