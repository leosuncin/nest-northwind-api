import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { CreateCategory } from '../dto/create-category.dto';
import { UpdateCategory } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: Mocked<CategoryService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(CategoryController).compile();

    controller = unit;
    service = unitRef.get(
      CategoryService,
    ) as unknown as Mocked<CategoryService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createCategory: CreateCategory = {
      name: 'Beverages',
      picture: 'beverages.png',
    };
    const createdCategory = { id: 1, ...createCategory } as Category;

    service.create.mockResolvedValue(createdCategory);

    const result = await controller.create(createCategory);

    expect(result).toEqual(createdCategory);
    expect(service.create).toHaveBeenCalledWith(createCategory);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const page = 2;
    const limit = 5;
    const categories: [Category[], number] = [
      [{ id: 1, name: 'Beverages', picture: 'beverages.png' }],
      1,
    ];

    service.findAll.mockResolvedValue(categories);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(categories);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const category = {
      id,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    service.findOne.mockResolvedValue(category);

    const result = await controller.findOne(id);

    expect(result).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a category and changes when update then it delegates to the service', async () => {
    const category = {
      id: 1,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;
    const changes: UpdateCategory = { name: 'Drinks' };

    service.update.mockResolvedValue(category);

    const result = await controller.update(category, changes);

    expect(result).toEqual(category);
    expect(service.update).toHaveBeenCalledWith(category, changes);
  });

  test('given a category when remove then it delegates to the service', async () => {
    const category = {
      id: 1,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    service.remove.mockResolvedValue(category);

    const result = await controller.remove(category);

    expect(result).toEqual(category);
    expect(service.remove).toHaveBeenCalledWith(category);
  });
});
