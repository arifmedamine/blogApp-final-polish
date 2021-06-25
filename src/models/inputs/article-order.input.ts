import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum ArticleOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  title = 'title',
  description = 'description',
}

registerEnumType(ArticleOrderField, {
  name: 'articleOrderField',
  description: 'Properties by which article connections can be ordered.',
});

@InputType()
export class ArticleOrder extends Order {
  field: ArticleOrderField;
}
