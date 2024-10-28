import { IsIn, IsNotEmpty } from 'class-validator';
import { EInvitStatus } from '../models';

export class UpdateInvitDto {
  @IsNotEmpty()
  @IsIn([EInvitStatus.ACCEPTED, EInvitStatus.REJECTED])
  status: EInvitStatus;
}
