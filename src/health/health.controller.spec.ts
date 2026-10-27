import { ServiceUnavailableException } from '@nestjs/common';
import {
  type HealthCheckResult,
  HealthCheckService,
  type HealthCheckStatus,
  type HealthIndicatorFunction,
  type HealthIndicatorResult,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';

import { HealthController } from './health.controller.js';

function reduceResults(
  results: HealthIndicatorResult[],
): HealthIndicatorResult {
  const summary: HealthIndicatorResult = {};

  for (const result of results) {
    Object.assign(summary, result);
  }

  return summary;
}

async function checkHealthIndicators(
  indicators: HealthIndicatorFunction[],
): Promise<HealthCheckResult> {
  const success: HealthIndicatorResult[] = [];
  const errors: HealthIndicatorResult[] = [];
  const results = await Promise.allSettled(
    indicators.map((indicator) =>
      typeof indicator === 'function'
        ? indicator()
        : Promise.resolve(indicator),
    ),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      Object.entries(result.value).forEach(([key, value]) => {
        if (value.status === 'up' || value.status === 'degraded') {
          success.push({ [key]: value });
        } else if (value.status === 'down') {
          errors.push({ [key]: value });
        }
      });
    } else {
      throw new ServiceUnavailableException(result.reason);
    }
  }

  if (errors.length > 0) throw new ServiceUnavailableException();

  const status = (
    errors.length > 0 ? 'error' : 'ok'
  ) satisfies HealthCheckStatus;
  const info = reduceResults(success);
  const error = reduceResults(errors);
  const details = reduceResults([...success, ...errors]);

  return {
    details,
    error,
    info,
    status,
  };
}

describe('HealthController', () => {
  let controller: HealthController;
  let memIndicator: Mocked<MemoryHealthIndicator>;
  let ormIndicator: Mocked<TypeOrmHealthIndicator>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(HealthController)
      .mock(HealthCheckService)
      .impl(() => ({ check: checkHealthIndicators }))
      .compile();

    controller = unit;
    memIndicator = unitRef.get(
      MemoryHealthIndicator,
    ) as unknown as Mocked<MemoryHealthIndicator>;
    ormIndicator = unitRef.get(
      TypeOrmHealthIndicator,
    ) as unknown as Mocked<TypeOrmHealthIndicator>;
  });

  test('given the indicators resolves the state when all the indicators are successful then it is healthy', async () => {
    ormIndicator.pingCheck.mockResolvedValue({ database: { status: 'up' } });
    memIndicator.checkRSS.mockResolvedValue({ mem_rss: { status: 'up' } });
    memIndicator.checkHeap.mockResolvedValue({ mem_heap: { status: 'up' } });

    await expect(controller.healthCheck()).resolves.toMatchObject({
      details: {
        database: { status: 'up' },
        mem_heap: { status: 'up' },
        mem_rss: { status: 'up' },
      },
      error: {},
      info: {
        database: { status: 'up' },
        mem_heap: { status: 'up' },
        mem_rss: { status: 'up' },
      },
      status: 'ok',
    });
  });

  test('given the indicators resolves the state when one of the indicators is faulty then it is unhealthy', async () => {
    ormIndicator.pingCheck.mockResolvedValue({
      database: { status: 'down', message: 'Unable to connect' },
    });
    memIndicator.checkRSS.mockResolvedValue({ mem_rss: { status: 'up' } });
    memIndicator.checkHeap.mockResolvedValue({ mem_heap: { status: 'up' } });

    await expect(controller.healthCheck()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
