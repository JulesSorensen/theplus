import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {
  @IsNotEmpty({ message: "Vous devez renseigner un email" })
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  email: string;

  @IsNotEmpty({ message: "Vous devez renseigner un mot de passe" })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  password: string;
}
