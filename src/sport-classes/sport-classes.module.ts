import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SportClass } from './entities/sport-class.entity';
import { SportClassesController } from './sport-classes.controller';
import { SportClassesService } from './sport-classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SportClass, User])],
  controllers: [SportClassesController],
  providers: [SportClassesService],
})
export class SportClassesModule {}
