import { PrismaService } from './../../prisma/prisma.service';
import { PaginationArgs } from '../../common/pagination/pagination.args';
import { IssueIdArgs } from '../../models/args/issue-id.args';
import { UserIdArgs } from '../../models/args/user-id.args';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { Issue } from '../../models/issue';
import {IssueOrder} from '../../models/inputs/issue-order.input';
import { IssueConnection } from 'src/models/pagination/issue-connection.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions/';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateIssueInput } from './dto/createIssue.input'
import { UserEntity } from 'src/decorators/user.decorator';
import { User } from 'src/models/user.model';

const pubSub = new PubSub();

@Resolver((of) => Issue)
export class IssueResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription((returns) => Issue)
  issueCreated() {
    return pubSub.asyncIterator('issueCreated');
  }

  // @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Issue)
  async createIssue(
    @UserEntity() user: User,
    @Args('data') data: CreateIssueInput
  ) {
    const newIssue = this.prisma.issue.create({
      data: {
        published: true,
        title: data.title,
        description: data.description,
        // authorId: user.id,
      },
    });
    pubSub.publish('issueCreated', { issueCreated: newIssue });
    return newIssue;
  }

  @Query((returns) => IssueConnection)
  async publishedIssues(
    @Args() { skip, after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => IssueOrder,
      nullable: true,
    })
    orderBy: IssueOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.issue.findMany({
          include: { author: true },
          where: {
            published: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
        }),
      () =>
        this.prisma.issue.count({
          where: {
            published: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => [Issue])
  async getAllIssues() {
    return await this.prisma.issue.findMany();
  }

  @Query((returns) => [Issue])
  userIssues(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .issues({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query((returns) => Issue)
  async issue(@Args() id: IssueIdArgs) {
    return this.prisma.issue.findUnique({ where: { id: id.issueId } });
  }

}
