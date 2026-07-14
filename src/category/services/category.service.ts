import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateCategory } from '../dto/create-category.dto';
import { UpdateCategory } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategory: CreateCategory) {
    const category = this.categoryRepository.create(createCategory);

    return this.categoryRepository.save(category);
  }

  findAll(page = 1, limit = 10) {
    return this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.categoryRepository.findOneByOrFail({ id });
  }

  update(category: Category, updateCategory: UpdateCategory) {
    this.categoryRepository.merge(category, updateCategory);

    return this.categoryRepository.save(category);
  }

  remove(category: Category) {
    return this.categoryRepository.remove(category);
  }
}
