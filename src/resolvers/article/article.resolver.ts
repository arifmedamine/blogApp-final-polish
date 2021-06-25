import { PrismaService } from './../../prisma/prisma.service';
import { PaginationArgs } from '../../common/pagination/pagination.args';
import { ArticleIdArgs } from '../../models/args/article-id.args';
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
import { Article } from '../../models/article';
import {ArticleOrder} from '../../models/inputs/article-order.input';
import { ArticleConnection } from 'src/models/pagination/article-connection.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions/';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateArticleInput } from './dto/createArticle.input'
import { UserEntity } from 'src/decorators/user.decorator';
import { User } from 'src/models/user.model';

const pubSub = new PubSub();

@Resolver((of) => Article)
export class ArticleResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription((returns) => Article)
  ArticleCreated() {
    return pubSub.asyncIterator('ArticleCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Article)
  async createArticle(
    @UserEntity() user: User,
    @Args('data') data: CreateArticleInput
  ) {
    const newArticle = this.prisma.article.create({
      data: {
        published: true,
        title: data.title,
        description: data.description,
        authorId: user.id,
      },
    });
    pubSub.publish('ArticleCreated', { articleCreated: newArticle });
    return newArticle;
  }

  @Query((returns) => ArticleConnection)
  async publishedArticle(
    @Args() { skip, after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => ArticleOrder,
      nullable: true,
    })
    orderBy: ArticleOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.article.findMany({
          include: { author: false },
          where: {
            published: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
        }),
      () =>
        this.prisma.article.count({
          where: {
            published: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query((returns) => [Article])
  userArticle(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .aricles({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query((returns) => Article)
  async article(@Args() id: ArticleIdArgs) {
    return this.prisma.article.findUnique({ where: { id: id.articleId } });
  }

  @ResolveField('author')
  async author(@Parent() article: Article) {
    return this.prisma.article.findUnique({ where: { id: article.id } }).author();
  }
}

