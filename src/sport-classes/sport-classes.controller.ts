import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';
import { SportClassesService } from './sport-classes.service';

@Controller('classes')
export class SportClassesController {
  constructor(private readonly service: SportClassesService) {}

  @Get()
  public getAll(@Query('sport') sport?: string) {
    return this.service.getSportClasses(sport);
  }

  @Get(':id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSportClassById(id);
  }

  // @Post('seed')
  // public createTestClass(@Body() dto: SportClass) {
  //   return this.service.createSportClass(dto, 'test@dummy.com');
  // }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Post()
  public create(@Body() dto: CreateSportsClassDto, @CurrentUser() user) {
    return this.service.createSportClass(dto, user.email);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateSportsClassDto) {
    return this.service.updateSportClass(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSportClass(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/apply')
  public applyToClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.service.applyUserToSportClass(id, user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get(':id/applicants')
  public getApplicants(@Param('id', ParseIntPipe) id: number) {
    return this.service.getApplicants(id);
  }
}
