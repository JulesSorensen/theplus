import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userLogin: AuthLoginDto) {
    if (!userLogin.email || !userLogin.password)
      throw new NotFoundException(["Email and password are required"]);

    const user = await this.usersService.findOneByEmail(userLogin.email);
    if (!user) throw new UnauthorizedException();

    const rightPassword = await bcrypt.compare(
      userLogin.password,
      user.password,
    );
    if (!rightPassword) throw new UnauthorizedException();

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async parseJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
