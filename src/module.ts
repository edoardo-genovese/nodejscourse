import * as dotenv from "dotenv";

dotenv.config();

import { Application } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import { currentUser, errorHandler } from "@nodetrainingcourses/common";
import { authRouters } from "./auth/auth.routers";
import { sellerRouter } from "./seller/seller.routers";

export class AppModule {
  constructor(public app: Application) {
    app.set("trust-proxy", true);

    app.use(
      cors({
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    app.use(urlencoded({ extended: false }));
    app.use(json());
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );

    Object.setPrototypeOf(this, AppModule.prototype);
  }

  async start() {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

    if (!process.env.JWT_KEY) throw new Error("JWT_KEY is required");

    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      throw new Error("database error");
    }

    this.app.use(currentUser(process.env.JWT_KEY!)); //in start function we are sure to hae the jwt token

    this.app.use(authRouters);

    this.app.use(sellerRouter);

    this.app.use(errorHandler);

    this.app.listen(3000, () => console.log("Ok port: 3000"));
  }
}
