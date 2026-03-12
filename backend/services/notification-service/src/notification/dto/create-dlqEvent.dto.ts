import { Prisma } from '../../../generated/prisma';

export class CreateDlqEventDto {
  topic: string;
  payload: Prisma.InputJsonValue;
  error?: string;
}
