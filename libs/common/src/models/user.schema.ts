import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';

import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
@ObjectType()
export class UserDocument extends AbstractDocument {
  @Prop({ unique: true })
  @Field()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  @Field(() => [String], { nullable: true })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
