import { mount as realMount } from '@cypress/vue'
import vQuery from '@jetstreamkit/v-query'
import DataWrapper from '../../src/Classses/DataWrapper'
import ConnectedComponents from '../../src/Classses/ConnectedComponents'
import Permissions from '../../src/Mixins/Permissions'
import ClickOutside from '../../src/Mixins/ClickOutside'
import JetPagination from '../../src/Elements/Pagination.vue'
import JetEmpty from '../../src/Items/Empty.vue'
import { plugin as InertiaPlugin } from '@inertiajs/inertia-vue3'
import '@testing-library/cypress/add-commands'
import { createRouter, createWebHashHistory } from 'vue-router'
import FakeApp from './FakeApp.vue'

const $ = Cypress.$

document.head.appendChild(
  $(
    '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">'
  )[0]
)

Cypress.Commands.add('mount', (component, options = {}) => {
  // Possibly able to setup a test application🇺using
  // a fake router to play nicely with Inertia.
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        component: FakeApp,
      },
    ],
  })

  options.global = options.global || {}
  options.global.plugins = [ClickOutside, vQuery, InertiaPlugin, router]
  options.global.mixins = [Permissions]
  options.global.components = {
    JetPagination,
    JetEmpty,
  }
  options.global.provide = {
    $connectedComponents: new ConnectedComponents(),
    config: new DataWrapper(options),
  }
  return realMount(component, options)
})
