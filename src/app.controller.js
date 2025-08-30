import ConnectToDataBase from "./DB/ConnectionDb.js";
import { userRouter } from "./modules/users/users.controller.js";
import { messageRouter } from "./modules/messages/messages.controller.js";
import cors from "cors";

import { errorHandler } from "./utils/error/globalErrorHandler.js";
export const bootstrap = async (express, app) => {
  var whitelist = [
    process.env.Domaine1,
    process.env.Domaine2,
    "http://localhost:3000",
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  // resolve cors probleme
  app.use(cors(corsOptions));

  // connection To dataBase
  ConnectToDataBase();

  // parsing data
  app.use(express.json());

  //handling Routes
  app.use("/users", userRouter);
  app.use("/messages", messageRouter);

  // handling Error
  app.use((req, res, next) => {
    next(new Error("This endPoints is not defined", { cause: 400 }));
  });
  app.use(errorHandler);
};
