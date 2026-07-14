import { PartialType } from '@nestjs/mapped-types';

import { CreateCategory } from './create-category.dto';

export class UpdateCategory extends PartialType(CreateCategory) {}
