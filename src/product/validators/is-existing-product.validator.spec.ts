import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingProduct,
  IsExistingProductConstraint,
} from './is-existing-product.validator';
import { ProductService } from '../services/product.service';

describe('IsExistingProduct validator', () => {
  class TestDto {
    @IsExistingProduct()
    readonly productId!: number;
  }

  let service: Mocked<ProductService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useFactory: mock,
        },
        IsExistingProductConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<ProductService>>(ProductService);
  });

  it('given a DTO when the product id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { productId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the product id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { productId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingProduct": "Product with id 1 does not exist",
      }
    `);
  });
});
