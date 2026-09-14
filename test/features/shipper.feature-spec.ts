import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { e2e } from 'pactum';

const feature = await loadFeature('./shipper.feature');

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new shipper', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new shipper');
    const step = testScenario.spec();

    Given('I make a POST request to /shipper', () => {
      step
        .post('/shipper')
        .stores('shipperId', '.id')
        .clean()
        .delete('/shipper/$S{shipperId}');
    });

    And('I set the company name to {string}', (_, companyName: string) => {
      step.withForm('companyName', companyName);
    });

    And('I set the phone to {string}', (_, phone: string) => {
      step.withForm('phone', phone);
    });

    When('I receive the created shipper response', async () => {
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
      'I expect the new shipper should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update a shipper', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update a shipper');
    const step = testScenario.spec();

    Given('I make a PATCH request to /shipper/:id', () => {
      step
        .patch('/shipper/{shipperId}')
        .withPathParams('shipperId', '$S{shipperId}');
    });

    And('I set the new phone to {string}', (_, phone: string) => {
      step.withForm('phone', phone);
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

    And(
      'I expect the shipper phone should be: {string}',
      (_, phone: string) => {
        step.expectJson('phone', phone);
      },
    );
  });

  Scenario('List the shippers', async ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the shippers');
    const step = testScenario.spec();

    Given('I make a GET request to /shipper', () => {
      step.get('/shipper');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      step.withQueryParams('limit', limit);
    });

    When('I receive the response with a list of shippers', async () => {
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
    'Get a shipper by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get a shipper by id');
      const step = testScenario.spec();

      Given('I make a GET request to /shipper/<id>', () => {
        step
          .get('/shipper/{shipperId}')
          .withPathParams('shipperId', variables.id);
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

      And(
        'I expect the company name of the shipper should be: <companyName>',
        () => {
          step.expectJson('companyName', variables.companyName);
        },
      );

      And('I expect the phone of the shipper should be: <phone>', () => {
        step.expectJson('phone', variables.phone);
      });
    },
  );
});
