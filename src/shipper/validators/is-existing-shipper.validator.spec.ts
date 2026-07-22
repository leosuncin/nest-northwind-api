import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingShipper,
  IsExistingShipperConstraint,
} from './is-existing-shipper.validator';
import { ShipperService } from '../services/shipper.service';

describe('IsExistingShipper validator', () => {
  class TestDto {
    @IsExistingShipper()
    readonly shipperId!: number;
  }

  let service: Mocked<ShipperService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ShipperService,
          useFactory: mock,
        },
        IsExistingShipperConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<ShipperService>>(ShipperService);
  });

  it('given a DTO when the shipper id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { shipperId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the shipper id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { shipperId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingShipper": "Shipper with id 1 does not exist",
      }
    `);
  });
});
