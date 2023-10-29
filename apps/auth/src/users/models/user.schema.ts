import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

import { AbstractEntity } from '@app/common';

@Schema({ versionKey: false })
export class UserDocument extends AbstractEntity {
  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
