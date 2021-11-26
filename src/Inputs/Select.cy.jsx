import Select from './Select.vue'
import faker from 'faker'

// Generate an array of options to be used as the default
// inputs into this component
// [{ name: 'd-animalName', display: 'Animal Name', value: 'animal-name-{uuid}' }]
const options = Array.from(Array(10).keys()).map(() => {
  const animal = faker.animal.cat()
  return {
    value: `${faker.helpers.slugify(animal.toLowerCase())}-
      ${faker.datatype.uuid().slice(0, 5)}`,
    name: 'd-' + animal,
    display: animal,
  }
})

const emptyLabel = 'Choose a cat...'

// Q: How to call a computed method?
// A: You don't invoke computed methods.
// You can get at their resolved values when you render them to the DOM
describe('Select', () => {
  describe('with options', () => {
    beforeEach(() => {
      cy.mount(() => (
        <div>
          <p class="text-lg">Types of cats</p>
          <Select options={options} />
        </div>
      ))
    })

    it('renders the options passed in', () => {
      cy.get('select option').should('have.length', options.length)
    })

    it('selects the first option by default', () => {
      cy.get('select').should('have.value', options[0].value)
    })

    it('can be updated to another option', () => {
      const lastOption = options[options.length - 1]
      cy.get('select')
        .select(lastOption.value)
        .should('have.value', lastOption.value)
    })

    it('renders the display values for each of the options', () => {
      cy.get('select option').each(($el, idx) => {
        cy.wrap($el).should('have.text', options[idx].display)
      })
    })

    it('renders the data-name values for each of the options', () => {
      cy.get('select option').each(($el, idx) => {
        cy.wrap($el).should('have.attr', 'data-name', options[idx].name)
      })
    })
  })

  it('renders an empty option when the empty prop is passed in', () => {
    cy.mount(() => <Select options={options} empty={emptyLabel} />)
      .get('select option')
      .should('have.length', options.length + 1)
      .get('select option')
      .first()
      .should('not.have.value')
      .and('have.text', emptyLabel)
  })
})
