import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Article } from './article';
import { Issue } from './issue';
import { User } from './user.model';

@ObjectType()
export class Archive {
    @Field(() => ID, { nullable: true })
    id: string;

    user: User;

    articles: Article[];

    issues: Issue[];

    // archive: Archive[];
}
