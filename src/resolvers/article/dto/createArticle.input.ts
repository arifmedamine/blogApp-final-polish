import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  title: string;
}
