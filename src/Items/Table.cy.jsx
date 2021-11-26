import Table from './Table.vue';

describe('Table cells', () => {
  it('with cells as an array', () => {
    cy.mount(<Table />, {
      props: {
        data: [{ title: 'Titanic', description: 'a movie' }],
        cells: ['title', 'description'],
      },
    });

    cy.get('th').eq(0).should('have.text', 'title');
    cy.get('th').eq(1).should('have.text', 'description');
    cy.get('td').eq(0).should('have.text', 'Titanic');
    cy.get('td').eq(1).should('have.text', 'a movie');
  });

  it('with nested cells', () => {
    cy.mount(<Table />, {
      props: {
        data: [{ user: { name: 'Brian' } }],
        cells: ['user.name'],
      },
    });

    cy.get('th').eq(0).should('have.text', 'user');
    cy.get('td').eq(0).should('have.text', 'Brian');
  });
});

describe('Table cell slots', () => {
  it.skip('with td override', () => {
    // cy.mount(() => (
    //     <Table>
    //         <template #td.title="{ item, value: title }">
    //             <span id="title_slot">{{ title }}</span>
    //         </template>
    //     </Table>
    // ), {
    //     props: {
    //         data: [{title: 'Titanic', description: 'a movie'}],
    //         cells: ['title', 'description']
    //     }
    // })

    cy.get('#title_slot').should('have.text', 'Titanic');
  });

  it.skip('with th override', () => {
    // cy.mount(() => (
    //     <Table>
    //         <template #th.title>
    //             <span>Custom Header</span>
    //         </template>
    //     </Table>
    // ), {
    //     props: {
    //         data: [{title: 'Titanic', description: 'a movie'}],
    //         cells: ['title', 'description']
    //     }
    // })

    cy.get('th').should('have.length', 2);
    cy.get('th').eq(0).should('have.text', 'Custom Header');
    cy.get('th').eq(1).should('have.text', 'Description');
  });
});
