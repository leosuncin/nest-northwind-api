import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { CreateCategory } from '../dto/create-category.dto';
import { UpdateCategory } from '../dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Mocked<Repository<Category>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(CategoryService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Category) as string,
    ) as unknown as Mocked<Repository<Category>>;
  });

  test('given a valid dto when create then it persists and returns the category', async () => {
    const createCategory: CreateCategory = {
      name: 'Beverages',
      picture: 'beverages.png',
    };
    const createdCategory = { id: 1, ...createCategory } as Category;

    repository.create.mockReturnValue(createdCategory);
    repository.save.mockResolvedValue(createdCategory);

    const category = await service.create(createCategory);

    expect(category).toEqual(createdCategory);
    expect(repository.create).toHaveBeenCalledWith(createCategory);
    expect(repository.save).toHaveBeenCalledWith(createdCategory);
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const page = 2;
    const limit = 5;
    const result: [Category[], number] = [
      [{ id: 1, name: 'Beverages', picture: 'beverages.png' }],
      1,
    ];

    repository.findAndCount.mockResolvedValue(result);

    const categories = await service.findAll(page, limit);

    expect(categories).toEqual(result);
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  test('given an id when findOne then it returns the matching category', async () => {
    const id = 1;
    const category = {
      id,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    repository.findOneByOrFail.mockResolvedValue(category);

    const found = await service.findOne(id);

    expect(found).toEqual(category);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test('given a category and changes when update then it merges and persists them', async () => {
    const category = {
      id: 1,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;
    const changes: UpdateCategory = { name: 'Drinks' };

    repository.merge.mockReturnValue(category);
    repository.save.mockResolvedValue(category);

    const result = await service.update(category, changes);

    expect(result).toEqual(category);
    expect(repository.merge).toHaveBeenCalledWith(category, changes);
    expect(repository.save).toHaveBeenCalledWith(category);
  });

  test('given a category when remove then it deletes and returns it', async () => {
    const category = {
      id: 1,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    repository.remove.mockResolvedValue(category);

    const result = await service.remove(category);

    expect(result).toEqual(category);
    expect(repository.remove).toHaveBeenCalledWith(category);
  });
});
