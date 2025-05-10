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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/roles/roles.enum';
import { SportClassService } from '../sport-class/sport-class.service';
import { CreateSportClassDto } from './dto/create-sport-class.dto';
import { UpdateSportClassDto } from './dto/update-sports-class.dto';

@ApiTags('Sport Class')
@Controller('classes')
export class SportClassController {
  constructor(private readonly service: SportClassService) {}

  @Get()
  public getAll(@Query('sport') sport?: string) {
    return this.service.getSportClasses(sport);
  }

  @Get(':id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSportClassById(id);
  }

  // @Post('seed')
  // public createTestSportClass(@Body() dto: SportClass) {
  //   return this.service.createSportClass(dto, 'test@dummy.com');
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Post()
  public create(@Body() dto: CreateSportClassDto, @CurrentUser() user) {
    return this.service.createSportClass(dto, user.email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateSportClassDto) {
    return this.service.updateSportClass(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSportClass(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/apply')
  public applyToClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.service.applyUserToSportClass(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get(':id/applicants')
  public getApplicants(@Param('id', ParseIntPipe) id: number) {
    return this.service.getApplicants(id);
  }
}
