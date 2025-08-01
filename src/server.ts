/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./configs/env";
import { superAdminSeeder } from "./utils/seeder";
// import { envVars } from "./configs/env";

let server: Server;
const starterServer = async () => {
  try {
    // console.log(envVars.NODE_ENV)

    await mongoose.connect(envVars.DB_URL);

    console.log("connected to db");

    server = app.listen(envVars.PORT, () => {
      console.log("server is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await starterServer();
  await superAdminSeeder();
})();

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected.. server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected.. server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("uncaught Exception detected.. server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("server shutting down manually");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

export default app;
