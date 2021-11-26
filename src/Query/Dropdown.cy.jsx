import Dropdown from './Dropdown.vue'

const slotSelector = '[data-testid=inner-content]'
const triggerSelector = '[data-testid=dropdown-trigger]'

describe('Dropdown', () => {
  it('renders', () => {
    cy.mount(() => (
      <div class="mr-8">
        <Dropdown name="my-dropdown">
          <span data-testid="inner-content">Content</span>
        </Dropdown>
      </div>
    ))
      .get(triggerSelector)
      .click()
      .get(slotSelector)
      .should('be.visible')
      .get('body')
      .click()
      .get(slotSelector)
      .should('not.be.visible')
  })
})
