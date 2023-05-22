import {
  UserModel,
  UserDoc,
  AuthentiationService,
} from "@nodetrainingcourses/common";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    //transform the schema into a json and we remove id and password for secure reasons
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

//check that the password is hashed before saving
schema.pre("save", async function (done) {
  const authenticationService = new AuthentiationService();
  //check if password is modified or the document is new
  if (this.isModified("password") || this.isNew) {
    const hashedPwd = authenticationService.pwdToHash(this.get("password")); //get password from document
    this.set("password", hashedPwd);
  }

  done();
});

export const User = mongoose.model<UserDoc, UserModel>("User", schema);
