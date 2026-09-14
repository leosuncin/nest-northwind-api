import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { createURLCodec } from '@rapiq/codec-url';
import { contains, defineQuery } from '@rapiq/core';
import { e2e } from 'pactum';

const feature = await loadFeature('./supplier.feature');
const codec = createURLCodec();

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new supplier', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new supplier');
    const step = testScenario.spec();

    Given('I make a POST request to /supplier', () => {
      step
        .post('/supplier')
        .stores('supplierId', '.id')
        .clean()
        .delete('/supplier/$S{supplierId}');
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

    And('I set the region to {string}', (_, region: string) => {
      step.withForm('region', region);
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

    And('I set the home page to {string}', (_, homePage: string) => {
      step.withForm('homePage', homePage);
    });

    When('I receive the created supplier response', async () => {
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
      'I expect the new supplier should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update a supplier', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update a supplier');
    const step = testScenario.spec();

    Given('I make a PATCH request to /supplier/:id', () => {
      step
        .patch('/supplier/{supplierId}')
        .withPathParams('supplierId', '$S{supplierId}');
    });

    And(
      'I set the new contact title to {string}',
      (_, contactTitle: string) => {
        step.withForm('contactTitle', contactTitle);
      },
    );

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
      'I expect the supplier contact title should be: {string}',
      (_, contactTitle: string) => {
        step.expectJson('contactTitle', contactTitle);
      },
    );
  });

  Scenario('List the suppliers', async ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the suppliers');
    const step = testScenario.spec();

    Given('I make a GET request to /supplier', () => {
      step.get('/supplier');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      step.withQueryParams('limit', limit);
    });

    When('I receive the response with a list of suppliers', async () => {
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
    'Filter the suppliers which contact title contains "sales" in it',
    ({ And, Given, Then, When }) => {
      const testScenario = testFeature.step('Filter the suppliers');
      const step = testScenario.spec();

      Given('I make a GET request to /supplier', () => {
        step.get('/supplier');
      });

      And(
        'I filter the contact title to contain {string}',
        (_, contactTitle) => {
          const query = defineQuery({
            filters: contains('contactTitle', contactTitle),
          });

          step.withQueryParams(codec.encode(query)!);
        },
      );

      When('I receive the response', async () => {
        await step.toss();
      });

      Then('I expect the response should be valid', () => {
        step
          .expectStatus(200)
          .expectHeaderContains('content-type', 'application/json');
      });

      And(
        'I expect the number of suppliers matched should be {number}',
        (_, itemCount: number) => {
          step.expectJson('meta.itemCount', itemCount);
        },
      );
    },
  );

  ScenarioOutline(
    'Get a supplier by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get a supplier by id');
      const step = testScenario.spec();

      Given('I make a GET request to /supplier/<id>', () => {
        step
          .get('/supplier/{supplierId}')
          .withPathParams('supplierId', variables.id);
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

      const orNull = (value: string) => (value === '' ? null : value);

      And(
        'I expect the company name of the supplier should be: <companyName>',
        () => {
          step.expectJson('companyName', variables.companyName);
        },
      );

      And(
        'I expect the contact name of the supplier should be: <contactName>',
        () => {
          step.expectJson('contactName', variables.contactName);
        },
      );

      And(
        'I expect the contact title of the supplier should be: <contactTitle>',
        () => {
          step.expectJson('contactTitle', variables.contactTitle);
        },
      );

      And('I expect the address of the supplier should be: <address>', () => {
        step.expectJson('address', variables.address);
      });

      And('I expect the city of the supplier should be: <city>', () => {
        step.expectJson('city', variables.city);
      });

      And('I expect the region of the supplier should be: <region>', () => {
        step.expectJson('region', orNull(variables.region));
      });

      And(
        'I expect the postal code of the supplier should be: <postalCode>',
        () => {
          step.expectJson('postalCode', variables.postalCode);
        },
      );

      And('I expect the country of the supplier should be: <country>', () => {
        step.expectJson('country', variables.country);
      });

      And('I expect the phone of the supplier should be: <phone>', () => {
        step.expectJson('phone', variables.phone);
      });

      And('I expect the fax of the supplier should be: <fax>', () => {
        step.expectJson('fax', orNull(variables.fax));
      });

      And(
        'I expect the home page of the supplier should be: <homePage>',
        () => {
          step.expectJson('homePage', orNull(variables.homePage));
        },
      );
    },
  );
});
