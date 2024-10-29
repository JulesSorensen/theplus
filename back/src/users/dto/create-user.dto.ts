import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Votre nom est obligatoire" })
  @IsString({ message: "Votre nom doit être une chaîne de caractères" })
  @Length(1, 20, {
    message: "Votre nom doit contenir entre 1 et 20 caractères",
  })
  name: string;

  @IsNotEmpty({ message: "Votre email est obligatoire" })
  @IsString({ message: "Votre email doit être une chaîne de caractères" })
  @Length(5, 100, {
    message: "Votre email doit contenir entre 5 et 100 caractères",
  })
  @IsEmail({}, { message: "Votre email doit être une adresse email valide" })
  email: string;

  @IsNotEmpty({ message: "Votre mot de passe est obligatoire" })
  @IsString({
    message: "Votre mot de passe doit être une chaîne de caractères",
  })
  @Length(4, 500, {
    message: "Votre mot de passe doit contenir entre 4 et 500 caractères",
  })
  password: string;
}
