import { PrismaModule } from './../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { IssueResolver } from './issues.resolver';

@Module({
    imports: [PrismaModule],
    providers: [IssueResolver],
  })
  export class IssueModule {}
  