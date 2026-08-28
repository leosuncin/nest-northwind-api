import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { ProductController } from './product.controller.js';
import { ProductService } from '../services/product.service.js';
import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';

describe('ProductController', () => {
  let controller: ProductController;
  let service: Mocked<ProductService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(ProductController).compile();

    controller = unit;
    service = unitRef.get(ProductService) as unknown as Mocked<ProductService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createProduct: CreateProduct = { name: 'Chai' };
    const createdProduct = { id: 1, ...createProduct } as Product;

    service.create.mockResolvedValue(createdProduct);

    const result = await controller.create(createProduct);

    expect(result).toEqual(createdProduct);
    expect(service.create).toHaveBeenCalledWith(createProduct);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const page = 2;
    const limit = 5;
    const products: [Product[], number] = [
      [{ id: 1, name: 'Chai', discontinued: false }],
      1,
    ];

    service.findAll.mockResolvedValue(products);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(products);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const product = { id, name: 'Chai' } as Product;

    service.findOne.mockResolvedValue(product);

    const result = await controller.findOne(id);

    expect(result).toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a product and changes when update then it delegates to the service', async () => {
    const product = { id: 1, name: 'Chai' } as Product;
    const changes: UpdateProduct = { name: 'Updated Chai' };
    const updatedProduct = { ...product, ...changes };

    service.update.mockResolvedValue(updatedProduct);

    const result = await controller.update(product, changes);

    expect(result).toEqual(updatedProduct);
    expect(service.update).toHaveBeenCalledWith(product, changes);
  });

  test('given a product when remove then it delegates to the service', async () => {
    const product = { id: 1, name: 'Chai' } as Product;

    service.remove.mockResolvedValue(product);

    const result = await controller.remove(product);

    expect(result).toEqual(product);
    expect(service.remove).toHaveBeenCalledWith(product);
  });
});
