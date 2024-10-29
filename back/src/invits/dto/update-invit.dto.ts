import { IsIn, IsNotEmpty } from "class-validator";
import { EInvitStatus } from "../models";

export class UpdateInvitDto {
  @IsNotEmpty({ message: "Vous devez renseigner un statut" })
  @IsIn([EInvitStatus.ACCEPTED, EInvitStatus.REJECTED], {
    message: "Le statut doit être ACCEPTED (200) ou REJECTED (300)",
  })
  status: EInvitStatus;
}
