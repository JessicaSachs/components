const { mount: realMount } = require('@vue/test-utils')
const vQuery = require('@jetstreamkit/v-query')
const DataWrapper = require('./src/Classses/DataWrapper')
const ConnectedComponents = require('./src/Classses/ConnectedComponents')
const Permissions = require('./src/Mixins/Permissions')
const ClickOutside = require('./src/Mixins/ClickOutside')
const JetPagination = require('./src/Elements/Pagination.vue')
const JetEmpty = require('./src/Items/Empty.vue')

global.mount = (component, options = {}) => {
  options.global = options.global || {}
  options.global.plugins = [ClickOutside, vQuery]
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
}
