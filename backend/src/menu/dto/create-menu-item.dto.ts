import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  iconClass?: string;

  @IsOptional()
  @IsString()
  routePath?: string;
}
