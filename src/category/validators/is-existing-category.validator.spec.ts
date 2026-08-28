import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingCategory,
  IsExistingCategoryConstraint,
  IsNotExistingCategory,
} from './is-existing-category.validator.js';
import { CategoryService } from '../services/category.service.js';

describe('IsExistingCategory validator', () => {
  class TestDto {
    @IsExistingCategory()
    readonly categoryId!: number;
  }

  let service: Mocked<CategoryService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useFactory: mock,
        },
        IsExistingCategoryConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<CategoryService>>(CategoryService);
  });

  it('given a DTO when the category id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { categoryId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the category id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { categoryId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingCategory": "Category with id 1 does not exist",
      }
    `);
  });
});

describe('IsNotExistingCategory validator', () => {
  class TestDto {
    @IsNotExistingCategory()
    readonly categoryId!: number;
  }

  let service: Mocked<CategoryService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useFactory: mock,
        },
        IsExistingCategoryConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<CategoryService>>(CategoryService);
  });

  it('given a DTO when the category id does not exist then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { categoryId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the category id exists then it should return an error', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { categoryId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingCategory": "Category with id 1 already exists",
      }
    `);
  });
});
