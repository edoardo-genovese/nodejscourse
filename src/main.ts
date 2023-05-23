import { JwtPayload } from "@nodetrainingcourses/common";
import { AppModule } from "./module";
import express from "express";

declare global {
  namespace Express {
    interface Req {
      currentUser?: JwtPayload;
      uploaderError?: Error;
    }
  }
}

const bootstrap = () => {
  const app = new AppModule(express()); //will give express application

  app.start();
};

bootstrap();
