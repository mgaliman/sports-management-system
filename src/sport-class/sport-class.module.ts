import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportClassService } from '../sport-class/sport-class.service';
import { User } from '../user/entities/user.entity';
import { SportClass } from './entities/sport-class.entity';
import { SportClassController } from './sport-class.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SportClass, User])],
  controllers: [SportClassController],
  providers: [SportClassService],
})
export class SportClassModule {}
