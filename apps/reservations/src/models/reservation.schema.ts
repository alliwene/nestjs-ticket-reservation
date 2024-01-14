import { AbstractDocument } from '@app/common';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class ReservationDocument extends AbstractDocument {
  @Prop()
  @Field(() => Date)
  timestamp: Date;

  @Prop()
  @Field(() => Date)
  startDate: Date;

  @Prop()
  @Field(() => Date)
  endDate: Date;

  @Prop()
  @Field(() => String)
  userId: string;

  @Prop()
  @Field(() => String)
  invoiceId: string;

  @Prop()
  @Field(() => Float)
  amount: number;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
