import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, gt } from '@rapiq/core';
import { e2e } from 'pactum';

const feature = await loadFeature('./product.feature');
const codec = createURLCodec();

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new product', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new product');
    const step = testScenario.spec();
    const payload: Record<string, string | number> = {};

    Given('I make a POST request to /product', () => {
      step
        .post('/product')
        .stores('productId', '.id')
        .clean()
        .delete('/product/$S{productId}');
    });

    And('I set the name to {string}', (_, name: string) => {
      payload.name = name;
    });

    And('I set the supplier to {number}', (_, supplier: number) => {
      payload.supplier = supplier;
    });

    And('I set the category to {number}', (_, category: number) => {
      payload.category = category;
    });

    And(
      'I set the quantity per unit to {string}',
      (_, quantityPerUnit: string) => {
        payload.quantityPerUnit = quantityPerUnit;
      },
    );

    And('I set the unit price to {number}', (_, unitPrice: number) => {
      payload.unitPrice = unitPrice;
    });

    And('I set the units in stock to {number}', (_, unitsInStock: number) => {
      payload.unitsInStock = unitsInStock;
    });

    When('I receive the created product response', async () => {
      step.withJson(payload);

      await step.toss();
    });

    Then(
      'I expect the response status should be {number}',
      (_, code: number) => {
        step.expectStatus(code);
      },
    );

    And(
      'I expect the response should have a {header} header with {string}',
      (_, header: string, value: string) => {
        step.expectHeaderContains(header, value);
      },
    );

    And(
      'I expect the new product should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update a product', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update a product');
    const step = testScenario.spec();
    const payload: Record<string, number> = {};

    Given('I make a PATCH request to /product/:id', () => {
      step
        .patch('/product/{productId}')
        .withPathParams('productId', '$S{productId}');
    });

    And(
      'I set the new units in stock to {number}',
      (_, unitsInStock: number) => {
        payload.unitsInStock = unitsInStock;
      },
    );

    And(
      'I set the new units on order to {number}',
      (_, unitsOnOrder: number) => {
        payload.unitsOnOrder = unitsOnOrder;
      },
    );

    When('I receive the response', async () => {
      step.withJson(payload);

      await step.toss();
    });

    Then('I expect the response status should be {number}', (_, code) => {
      step.expectStatus(code);
    });

    And(
      'I expect the response should have a {header} header with {string}',
      (_, header: string, value: string) => {
        step.expectHeaderContains(header, value);
      },
    );

    And(
      'I expect the product units in stock should be: {number}',
      (_, unitsInStock: number) => {
        step.expectJson('unitsInStock', unitsInStock);
      },
    );

    And(
      'I expect the product units on order should be: {number}',
      (_, unitsOnOrder: number) => {
        step.expectJson('unitsOnOrder', unitsOnOrder);
      },
    );
  });

  Scenario('List the products', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the products');
    const step = testScenario.spec();

    Given('I make a GET request to /product', () => {
      step.get('/product');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      const query = defineQuery({ pagination: { limit } });

      step.withQueryParams(codec.encode(query)!);
    });

    When('I receive the response with a list of products', async () => {
      await step.toss();
    });

    Then('I expect the response should be valid', () => {
      step
        .expectStatus(200)
        .expectHeaderContains('content-type', 'application/json');
    });

    And('I expect the list should match the schema', (_, schema: string) => {
      step.expectJsonSchema(JSON.parse(schema));
    });
  });

  Scenario(
    'Filter the products with a unit price greater than 30',
    ({ And, Given, Then, When }) => {
      const testScenario = testFeature.step('Filter the products');
      const step = testScenario.spec();

      Given('I make a GET request to /product', () => {
        step.get('/product');
      });

      And('I filter the unit price to be greater than 30', () => {
        const query = defineQuery({
          filters: gt('unitPrice', 30),
        });

        step.withQueryParams(codec.encode(query)!);
      });

      When('I receive the response', async () => {
        await step.toss();
      });

      Then('I expect the response should be valid', () => {
        step
          .expectStatus(200)
          .expectHeaderContains('content-type', 'application/json');
      });

      And(
        'I expect the number of products matched should be {number}',
        (_, itemCount: number) => {
          step.expectJson('meta.itemCount', itemCount);
        },
      );
    },
  );

  ScenarioOutline(
    'Get a product by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get a product by id');
      const step = testScenario.spec();

      Given('I make a GET request to /product/<id>', () => {
        step
          .get('/product/{productId}')
          .withPathParams('productId', variables.id);
      });

      When('I receive the response', async () => {
        await step.toss();
      });

      Then(
        'I expect the response status should be {number}',
        (_, code: number) => {
          step.expectStatus(code);
        },
      );

      And(
        'I expect the response should have a {header} header with {string}',
        (_, header: string, value: string) => {
          step.expectHeaderContains(header, value);
        },
      );

      And('I expect the name of the product should be: <name>', () => {
        step.expectJson('name', variables.name);
      });

      And(
        'I expect the quantity per unit of the product should be: <quantityPerUnit>',
        () => {
          step.expectJson('quantityPerUnit', variables.quantityPerUnit);
        },
      );

      And(
        'I expect the unit price of the product should be: <unitPrice>',
        () => {
          step.expectJson('unitPrice', Number(variables.unitPrice));
        },
      );

      And(
        'I expect the units in stock of the product should be: <unitsInStock>',
        () => {
          step.expectJson('unitsInStock', Number(variables.unitsInStock));
        },
      );

      And(
        'I expect the units on order of the product should be: <unitsOnOrder>',
        () => {
          step.expectJson('unitsOnOrder', Number(variables.unitsOnOrder));
        },
      );

      And(
        'I expect the reorder level of the product should be: <reorderLevel>',
        () => {
          step.expectJson('reorderLevel', Number(variables.reorderLevel));
        },
      );

      And(
        'I expect the discontinued of the product should be: <discontinued>',
        () => {
          step.expectJson('discontinued', variables.discontinued === 'true');
        },
      );
    },
  );
});
