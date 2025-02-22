import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  @Get('tree')
  getMenuTree() {
    return this.menuService.getMenuTree();
  }

  @Get(':id')
  getMenuItem(@Param('id') id: string) {
    return this.menuService.getMenuItem(id);
  }

  @Patch(':id')
  updateMenuItem(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMenuItem(@Param('id') id: string) {
    await this.menuService.deleteMenuItem(id);
  }

  @Patch(':id/move')
  moveMenuItem(
    @Param('id') id: string,
    @Body('newParentId') newParentId: string | null,
  ) {
    return this.menuService.moveMenuItem(id, newParentId);
  }

  @Patch('reorder')
  reorderMenuItems(@Body() itemIds: string[]) {
    return this.menuService.reorderMenuItems(itemIds);
  }
}
