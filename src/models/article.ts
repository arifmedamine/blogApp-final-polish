import { Field, ID, ObjectType } from'@nestjs/graphql';
import { BaseModel } from './base.model';
import { Issue } from './issue';
import { User } from './user.model';

@ObjectType()
export class Article extends BaseModel {
    
    title: string;
    
    description: string;

    author: User;

    published: boolean;

    issue: Issue
}

