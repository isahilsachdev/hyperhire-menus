import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateMenuItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  ordering?: number;

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
