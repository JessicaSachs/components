const Dropdown = require('./Dropdown.vue')
const { mount } = require('@vue/test-utils')
const { h } = require('vue')

const slotSelector = '[data-testid=inner-content]'
const triggerSelector = '[data-testid=dropdown-trigger]'

describe('Dropdown', () => {
  it('renders', async () => {
    const wrapper = await mount(Dropdown, {
      slots: {
        default() {
          return h('div', { 'data-testid': 'inner-content' }, 'Content')
        },
      },
    })

    console.log(wrapper.exists())
    // await wrapper.find(triggerSelector).trigger('click')
    // expect(await wrapper.find(slotSelector)).toBeVisible()
  })
})
