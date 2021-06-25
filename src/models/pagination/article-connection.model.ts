import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { Article } from '../article';

@ObjectType()
export class ArticleConnection extends PaginatedResponse(Article) {}
