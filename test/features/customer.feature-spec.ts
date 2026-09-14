import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, eq } from '@rapiq/core';
import { e2e } from 'pactum';

const feature = await loadFeature('./customer.feature');
const codec = createURLCodec();

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new customer', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new customer');
    const step = testScenario.spec();

    Given('I make a POST request to /customer', () => {
      step
        .post('/customer')
        .stores('customerId', '.id')
        .clean()
        .delete('/customer/$S{customerId}');
    });

    And('I set the code to {string}', (_, code: string) => {
      step.withForm('code', code);
    });

    And('I set the company name to {string}', (_, companyName: string) => {
      step.withForm('companyName', companyName);
    });

    And('I set the contact name to {string}', (_, contactName: string) => {
      step.withForm('contactName', contactName);
    });

    And('I set the contact title to {string}', (_, contactTitle: string) => {
      step.withForm('contactTitle', contactTitle);
    });

    And('I set the address to {string}', (_, address: string) => {
      step.withForm('address', address);
    });

    And('I set the city to {string}', (_, city: string) => {
      step.withForm('city', city);
    });

    And('I set the postal code to {string}', (_, postalCode: string) => {
      step.withForm('postalCode', postalCode);
    });

    And('I set the country to {string}', (_, country: string) => {
      step.withForm('country', country);
    });

    And('I set the phone to {string}', (_, phone: string) => {
      step.withForm('phone', phone);
    });

    And('I set the fax to {string}', (_, fax: string) => {
      step.withForm('fax', fax);
    });

    When('I receive the created customer response', async () => {
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
      'I expect the new customer should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update a customer', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update a customer');
    const step = testScenario.spec();

    Given('I make a PATCH request to /customer/:id', () => {
      step
        .patch('/customer/{customerId}')
        .withPathParams('customerId', '$S{customerId}');
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
      'I expect the customer phone should be: {string}',
      (_, phone: string) => {
        step.expectJson('phone', phone);
      },
    );
  });

  Scenario('List the customers', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the customers');
    const step = testScenario.spec();

    Given('I make a GET request to /customer', () => {
      step.get('/customer');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      const query = defineQuery({ pagination: { limit } });

      step.withQueryParams(codec.encode(query)!);
    });

    When('I receive the response with a list of customers', async () => {
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
    'Filter the customers located in Germany',
    ({ And, Given, Then, When }) => {
      const testScenario = testFeature.step('Filter the customers');
      const step = testScenario.spec();

      Given('I make a GET request to /customer', () => {
        step.get('/customer');
      });

      And('I filter the country to be equal to "Germany"', () => {
        const query = defineQuery({
          filters: eq('country', 'Germany'),
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
        'I expect the number of customers matched should be {number}',
        (_, itemCount: number) => {
          step.expectJson('meta.itemCount', itemCount);
        },
      );
    },
  );

  ScenarioOutline(
    'Get a customer by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get a customer by id');
      const step = testScenario.spec();

      const orNull = (value: string) => (value === '' ? null : value);

      Given('I make a GET request to /customer/<id>', () => {
        step
          .get('/customer/{customerId}')
          .withPathParams('customerId', variables.id);
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

      And('I expect the code of the customer should be: <code>', () => {
        step.expectJson('code', variables.code);
      });

      And(
        'I expect the company name of the customer should be: <companyName>',
        () => {
          step.expectJson('companyName', variables.companyName);
        },
      );

      And(
        'I expect the contact name of the customer should be: <contactName>',
        () => {
          step.expectJson('contactName', variables.contactName);
        },
      );

      And(
        'I expect the contact title of the customer should be: <contactTitle>',
        () => {
          step.expectJson('contactTitle', variables.contactTitle);
        },
      );

      And('I expect the address of the customer should be: <address>', () => {
        step.expectJson('address', variables.address);
      });

      And('I expect the city of the customer should be: <city>', () => {
        step.expectJson('city', variables.city);
      });

      And('I expect the region of the customer should be: <region>', () => {
        step.expectJson('region', orNull(variables.region));
      });

      And(
        'I expect the postal code of the customer should be: <postalCode>',
        () => {
          step.expectJson('postalCode', variables.postalCode);
        },
      );

      And('I expect the country of the customer should be: <country>', () => {
        step.expectJson('country', variables.country);
      });

      And('I expect the phone of the customer should be: <phone>', () => {
        step.expectJson('phone', variables.phone);
      });

      And('I expect the fax of the customer should be: <fax>', () => {
        step.expectJson('fax', orNull(variables.fax));
      });
    },
  );
});
