import { HttpStatus } from '@nestjs/common';
import { reporter, flow } from 'pactum';

import { beverages } from '../src/database/seeds/category.seeder';
import { addFlowReporter } from './helpers';

describe('Category consumer', () => {
  beforeAll(() => {
    addFlowReporter('Category', true);
  });

  afterAll(async () => {
    try {
      await reporter.end();
    } catch {
      /* empty */
    }
  });

  it('get a category by id from the API', async () => {
    await flow('get a category')
      .get('/category/{category_id}')
      .withPathParams('category_id', beverages.id)
      .expectStatus(HttpStatus.OK)
      .expectJson({
        ...beverages,
        id: beverages.id.toString(),
        picture: null,
      });
  });

  it('create a new category via the API', async () => {
    await flow('create a new category')
      .post('/category')
      .withJson({
        name: 'Something',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectJsonSchema({
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: ['string', 'null'] },
          picture: { type: ['string', 'null'] },
        },
        required: ['id', 'name'],
      });
  });
});
