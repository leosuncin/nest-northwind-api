import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateCategory } from '../dto/create-category.dto.js';
import { UpdateCategory } from '../dto/update-category.dto.js';
import { Category } from '../entities/category.entity.js';

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

  findAll(filters: IQuery) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    const adapter = new TypeormAdapter({ queryBuilder });

    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
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

  async exists(id: Category['id']) {
    const count = await this.categoryRepository.countBy({ id });

    return count > 0;
  }
}
