import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OEmbedService } from 'src/common/oembed/oembed.service';

import { User } from '../user/entity/user.entity';

import { Content } from './entity/content.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content, User])],
  providers: [ContentService, JwtService, OEmbedService],
  controllers: [ContentController],
})
export class ContentModule {}
