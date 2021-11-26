import Finder from './Finder.vue'

describe('Finder Setup', () => {
  it.only('can search', () => {
    cy.mount(<Finder />)

    // cy.get('input[name="search"]').type('hello')

    // Help please :) how do I
    // assert url has ?search=hello
  })

  it.skip('can sort', () => {
    cy.mount(<Finder />, {
      props: {
        sort: ['title'],
      },
    })

    cy.get('option[data-name="sort"][value="title"]"').should(
      'have.text',
      'Title (asc)'
    )
    cy.get('option[data-name="sort-desc"][value="title"]').should(
      'have.text',
      'Title (desc)'
    )

    // Help please :) how do I
    // select index 0
    // assert url has ?sort=title
    // select index 1
    // assert url has ?sort-desc=title
  })
})
