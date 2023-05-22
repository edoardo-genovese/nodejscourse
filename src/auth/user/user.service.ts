import { UserModel } from "@nodetrainingcourses/common";
import { User } from "./user.model";
import { AuthDto } from "../dtos/auth.dto";

export class UserService {
  constructor(public userModel: UserModel) {}

  async create(createUserDto: AuthDto) {
    const user = new this.userModel({
      email: createUserDto.email,
      password: createUserDto.password,
    }); //typescript knows thtat this is a mongoose user module

    return await user.save(); //will return a UserDoc
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}

export const userService = new UserService(User);
