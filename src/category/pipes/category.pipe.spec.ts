import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { CategoryPipe } from './category.pipe';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';

describe('CategoryPipe', () => {
  let pipe: CategoryPipe;
  let service: Mocked<CategoryService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(CategoryPipe).compile();

    pipe = unit;
    service = unitRef.get(
      CategoryService,
    ) as unknown as Mocked<CategoryService>;
  });

  test('given a param type when the value is an id then it transforms it to a category', async () => {
    const id = 1;
    const category = {
      id,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    void service.findOne.mockResolvedValue(category);

    const result = await pipe.transform(id, { type: 'param' });

    expect(result).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test("given a body type when the value is an object with the category's id then it transforms it to a category", async () => {
    const id = 1;
    const category = {
      id,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    void service.findOne.mockResolvedValue(category);

    const result = await pipe.transform({ category: id }, { type: 'body' });

    expect(result).toEqual({ category });
    expect(service.findOne).toHaveBeenCalledWith(id);
  });
});
