import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportClass } from './entities/sport-class.entity';
import { SportClassesController } from './sport-classes.controller';
import { SportClassesService } from './sport-classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SportClass])],
  controllers: [SportClassesController],
  providers: [SportClassesService],
})
export class SportClassesModule {}
