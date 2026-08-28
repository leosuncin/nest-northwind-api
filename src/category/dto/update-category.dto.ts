import { PartialType } from '@nestjs/mapped-types';

import { CreateCategory } from './create-category.dto.js';

export class UpdateCategory extends PartialType(CreateCategory) {}
