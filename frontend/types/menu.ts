export interface IMenu {
  id: string;
  name: string;
  slug: string;
  depth: number;
  ordering: number;
  parentId: string | null;
  routePath: string | null;
  iconClass: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  children?: IMenu[];
}

export interface IUserSchema {
  name: string;
  depth: number;
  parentId?: string | null;
  id?: string;
}
