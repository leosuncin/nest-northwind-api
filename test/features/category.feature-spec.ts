import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { e2e } from 'pactum';

const feature = await loadFeature('./category.feature');

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new category', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new category');
    const step = testScenario.spec();

    Given('I make a POST request to /category', () => {
      step
        .post('/category')
        .stores('categoryId', '.id')
        .clean()
        .delete('/category/$S{categoryId}');
    });

    And('I set the name to {string}', (_, name: string) => {
      step.withForm('name', name);
    });

    And('I set the description to {string}', (_, description: string) => {
      step.withForm('description', description);
    });

    When('I receive the created category response', async () => {
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
      'I expect the new category should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update a category', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update a category');
    const step = testScenario.spec();

    Given('I make a PATCH request to /category/:id', () => {
      step
        .patch('/category/{categoryId}')
        .withPathParams('categoryId', '$S{categoryId}');
    });

    And('I set the new name to {string}', (_, name: string) => {
      step.withForm('name', name);
    });

    When('I receive the response', async () => {
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

    And('I expect the category name should be: {string}', (_, name: string) => {
      step.expectJson('name', name);
    });
  });

  Scenario('List the categories', async ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the categories');
    const step = testScenario.spec();

    Given('I make a GET request to /category', () => {
      step.get('/category');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      step.withQueryParams('limit', limit);
    });

    When('I receive the response with a list of categories', async () => {
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

  ScenarioOutline(
    'Get a category by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get a category by id');
      const step = testScenario.spec();

      Given('I make a GET request to /category/<id>', () => {
        step
          .get('/category/{categoryId}')
          .withPathParams('categoryId', variables.id);
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

      And('I expect the name of the category should be: <name>', () => {
        step.expectJson('name', variables.name);
      });

      And(
        'I expect the description of the category should be: <description>',
        () => {
          step.expectJson('description', variables.description);
        },
      );
    },
  );
});
