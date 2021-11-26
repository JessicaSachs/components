import Form from './Form.vue'
import faker from 'faker'

const description = faker.name.title()
const title = faker.name.prefix(1)
const sectionTitle = 'Person'
const dividerSelector = '[data-testid=field-divider]'
const sectionTitleSelector = '[data-testid=field-section_title]'
const fieldsSelector = '[data-testid*=field]' // All fields

describe('Form Setup', () => {
  it('renders form element with attributes', () => {
    cy.mount(<Form method="POST" action="/users/new" />)

    cy.get('form')
      .should('have.attr', 'action', '/users/new')
      .and('have.attr', 'method', 'POST')
  })
})

describe('Form Fields', () => {
  it('with a flat array of field names', () => {
    cy.mount(() => (
      <Form action="/users/new" fields={['title', 'description']} />
    ))

    cy.get('form input').should('have.length', 2)
    cy.findByLabelText('Title').should('be.visible')
    cy.findByLabelText('Description').should('be.visible')
    cy.findByRole('textbox', { name: 'Description' }).should('not.have.value')
    cy.findByRole('textbox', { name: 'Title' }).should('not.have.value')
  })

  it('with values when passed a values object', () => {
    cy.mount(() => (
      <Form fields={['title', 'description']} values={{ title, description }} />
    ))

    cy.findByRole('textbox', { name: 'Description' }).should(
      'have.value',
      description
    )
    cy.findByRole('textbox', { name: 'Title' }).should('have.value', title)
  })

  it('with a values object only', () => {
    cy.mount(() => <Form values={{ title, description }} />)

    cy.findByRole('textbox', { name: 'Description' }).should(
      'have.value',
      description
    )
    cy.findByRole('textbox', { name: 'Title' }).should('have.value', title)
  })

  it('with a values object and excludes', () => {
    cy.mount(() => (
      <Form
        action="/users/new"
        exclude={['description']}
        values={{ title, description }}
      />
    ))

    cy.findByRole('textbox', { name: 'Description' }).should('not.exist')
    cy.findByRole('textbox', { name: 'Title' }).should('have.value', title)
  })

  it('with an object', () => {
    cy.mount(() => (
      <Form
        field={[{ name: 'title' }, { name: 'description' }]}
        values={{ title: '', description: '' }}
      />
    ))

    cy.findByLabelText('Title').should('be.visible')
    cy.findByLabelText('Description').should('be.visible')
    cy.findByRole('textbox', { name: 'Title' }).should('be.visible')
    cy.findByRole('textbox', { name: 'Description' }).should('be.visible')
  })

  it('with an object & default value', () => {
    cy.mount(() => (
      <Form
        fields={[{ name: 'title', value: title }, { name: 'description' }]}
      />
    ))

    cy.findByRole('textbox', { name: 'Title' }).should('have.value', title)
    cy.findByRole('textbox', { name: 'Description' }).should('not.have.value')
  })

  it('with an object & width span', () => {
    cy.mount(() => (
      <Form
        fields={[
          { name: 'title', span: 6 },
          { name: 'description', span: 3 },
          { name: 'author_id' },
        ]}
      />
    ))

    cy.get('[data-testid="field-title"]').should('have.class', 'col-span-6')
    cy.get('[data-testid="field-description"]').should(
      'have.class',
      'col-span-3'
    )
    cy.get('[data-testid="field-author_id"]').should(
      'have.class',
      'col-span-12'
    )
  })
})

describe('Form Field Extras', () => {
  it('with a divider', () => {
    cy.mount(() => (
      <Form
        fields={[{ name: 'title' }, { divider: true }, { name: 'description' }]}
      />
    ))

    cy.get(dividerSelector).should('have.length', 1)
  })

  it('with a section titles', () => {
    cy.mount(() => (
      <Form
        fields={[
          { section_title: sectionTitle },
          { name: 'title' },
          { name: 'description' },
        ]}
      />
    ))

    cy.get(sectionTitleSelector).should('contain.text', sectionTitle)
    cy.get(fieldsSelector).should('have.length', 3)
  })
})

describe('Form Field Slots', () => {
  it('overrides entire field block via slot', () => {
    const slots = {
      'field.title.all': ({ form }) => (
        <>
          <label for="my-title">My Title</label>
          <input id="my-title" name="My Title" vModel={form.title} />
        </>
      ),
    }

    cy.mount(() => (
      <Form vSlots={slots} values={{ title, description: '' }}></Form>
    ))

    cy.get('form input').should('have.length', 2)
    cy.findByLabelText('Title').should('not.exist')
    cy.findByLabelText('Description').should('be.visible')
    cy.findByRole('textbox', { name: 'Description' }).should('not.have.value')
    cy.findByRole('textbox', { name: 'My Title' })
      .should('have.value', title)
      .clear()
      .type('hello world')
  })

  it('overrides a field block input and keep label & error', () => {
    const slots = {
      'field.title': ({ form }) => (
        <>
          <label for="my-title">My Title</label>
          <input id="my-title" name="my-title" vModel={form.title} />
        </>
      ),
    }

    cy.mount(() => (
      <Form
        vSlots={slots}
        fields={['title', 'description']}
        values={{ title: '', description: '' }}
      ></Form>
    ))

    cy.get('form input').should('have.length', 2)
    cy.get('label[for="my-title"]').should('contain.text', 'My Title')
    cy.get('label[for="description"]').should('contain.text', 'Description')
    cy.get('input[name="my-title"]').type('hello world')
  })
})

describe('Form Buttons', () => {
  it('submit button is "create" by default', () => {
    cy.mount(<Form fields={['title']} />)
    cy.findByRole('button', { type: 'submit' }).should('have.text', 'Create')
  })

  it('submit button is "update" when passed values', () => {
    cy.mount(<Form fields={['title']} values={{ title: 'Hello' }} />)
    cy.findByRole('button', { type: 'submit' }).should('have.text', 'Update')
  })

  it('cancel button does not exist by default', () => {
    cy.mount(<Form fields={['title']} values={{ title: 'Hello' }} />)
    cy.findByText('Cancel').should('not.exist')
  })

  it('cancel button exists when form has cancel listener', () => {
    // the cancel handler should add onCancel to $attrs which displays button
    const onCancelSpy = cy.spy().as('onCancelSpy')

    cy.mount(() => <Form onCancel={onCancelSpy} />)

    cy.findByText('Cancel')
      .should('be.visible')
      .click()
      .get('@onCancelSpy')
      .should('have.been.called')
  })
})

describe.skip('Form Submit', () => {
  // In theory, this should work, however because Inertia has particular network requirements
  // it requires a non-JSON response. This is possible to do with cy.intercept --
  // you can get a request, response callback --
  // however I don't know the shape this response wants to be in,
  // nor do I understand how to prevent Inertia from taking over the router

  it('renders single error message for field when has data.errors', () => {
    cy.intercept('/users/new', {
      statusCode: 401,
      body: { data: { errors: { name: 'Whoops!' } } },
    })

    cy.mount(() => (
      <Form action="/users/new" fields={['title', 'description']} />
    ))

    // cy.get('div[data-testid="error"]').should('have.length', 1)
    // cy.get('div[data-testid="error"]')
    //   .first()
    //   .should('have.text', 'The title field is required.')
  })

  it.skip('renders single error message for field from response', () => {
    cy.intercept('/users/new', {
      body: { data: { errors: [{ name: 'title', value: 'oh no!' }] } },
      statusCode: 400,
      headers: {
        Vary: 'Accept',
        'X-Inertia': 'true',
      },
    }).as('formSubmit')

    cy.mount(<Form action="/users/new" fields={['title', 'description']} />)

    // Inertia still can't handle submitting forms without a lot of dependencies on the url.

    // cy.get('button[type="submit"]').click()
    // cy.findByText('The title field is required')
    // cy.get('[data-testid=error]').should('have.length', 1).and('be.visible')
  })
})
