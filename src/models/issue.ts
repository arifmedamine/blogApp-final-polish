import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Archive } from './archive.model';
import { Article } from './article';
import { BaseModel } from './base.model';
import { User } from './user.model';

@ObjectType()
export class Issue extends BaseModel{
    title: string;
    
    description: string;

    author: User;

    published: boolean;

}
