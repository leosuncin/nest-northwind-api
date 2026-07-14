import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.jest';

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

  test('given a category id when transform then it returns the category from the service', async () => {
    const id = 1;
    const category = {
      id,
      name: 'Beverages',
      picture: 'beverages.png',
    } as Category;

    service.findOne.mockResolvedValue(category);

    const result = await pipe.transform(id);

    expect(result).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });
});
