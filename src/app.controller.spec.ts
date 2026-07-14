import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.jest';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: Mocked<AppService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AppController).compile();

    controller = unit;
    service = unitRef.get(AppService) as unknown as Mocked<AppService>;
  });

  test('given a request when getHello then it delegates to the service', () => {
    service.getHello.mockReturnValue('Hello World!');

    const result = controller.getHello();

    expect(result).toBe('Hello World!');
    expect(service.getHello).toHaveBeenCalled();
  });
});
