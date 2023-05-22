import { JwtPayload } from "@nodetrainingcourses/common";
import { AppModule } from "./module";
import express from "express";

declare global {
  namespace express {
    interface Req {
      currentUser?: JwtPayload;
    }
  }
}

const bootstrap = () => {
  const app = new AppModule(express()); //will give express application

  app.start();
};

bootstrap();
