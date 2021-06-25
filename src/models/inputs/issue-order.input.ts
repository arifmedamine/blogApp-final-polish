import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum IssueOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  title = 'title',
  description = 'description',
}

registerEnumType(IssueOrderField, {
  name: 'issueOrderField',
  description: 'Properties by which issue connections can be ordered.',
});

@InputType()
export class IssueOrder extends Order {
  field: IssueOrderField;
}
