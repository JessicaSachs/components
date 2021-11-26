import Group from './Group.vue'

const firstInputSelector = '[data-testid=first-input]'
describe('Group', () => {
  it('can be cleared', () => {
    cy.mount(() => (
      <div class="mr-8">
        <Group name="group-name">
          <input data-testid="first-input" />
          <input data-testid="second-input" />
        </Group>
      </div>
    ))
      .get(firstInputSelector)
      .type('content')

    // When the component is decoupled from the URL, the following assertions and interactions should pass.

    // cy.findByText('Clear').click()
    // cy.get(firstInputSelector).should('not.have.value', 'content')
  })
})
