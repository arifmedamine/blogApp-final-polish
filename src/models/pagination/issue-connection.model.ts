import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { Issue } from '../issue';

@ObjectType()
export class IssueConnection extends PaginatedResponse(Issue) {}
