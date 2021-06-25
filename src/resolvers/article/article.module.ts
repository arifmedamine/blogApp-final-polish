import { PrismaModule } from './../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ArticleResolver } from './article.resolver';

@Module({
    imports: [PrismaModule],
    providers: [ArticleResolver],
  })
  export class ArticleModule {}
  