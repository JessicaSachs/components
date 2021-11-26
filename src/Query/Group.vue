<template>
  <form v-if="!inline" @submit.prevent="filter" :id="`query-${$.uid}`">
    <div class="space-y-3" ref="inputs">
      <slot :filter="filters" />
    </div>
    <div class="flex justify-end pt-3 mt-3 border-t border-gray-200">
      <div class="flex space-x-2">
        <jet-secondary-button @click.stop="clear"> Clear </jet-secondary-button>
        <jet-button type="submit"> Filter </jet-button>
      </div>
    </div>
  </form>
  <div v-else>
    <form class="flex justify-center" @submit.prevent="filter">
      <slot :filter="filters" />
      <button type="submit">
        <slot name="submit">
          <jet-button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </jet-button>
        </slot>
      </button>
    </form>
  </div>
</template>

<script>
import JetInput from '@/Jetstream/Input.vue'
import JetButton from '@/Jetstream/Button.vue'
import JetSecondaryButton from '@/Jetstream/SecondaryButton.vue'

export default {
  components: {
    JetInput,
    JetButton,
    JetSecondaryButton,
  },
  props: {
    name: {
      type: String,
    },
    inline: {
      type: Boolean,
    },
  },
  data() {
    return {
      filters: {},
      baseUrl: null,
      parameters: null,
      filterGroup: true,
    }
  },
  mounted() {
    this.fillValues()
  },
  updated() {
    alert()
    // this.fillValues()
  },
  methods: {
    fillValues() {
      this.baseUrl = window.location.origin + window.location.pathname

      this.parameters = new URLSearchParams(window.location.search)

      for (const key of this.parameters.keys()) {
        let element = document.querySelector(
          `#query-${this.$.uid} [name="${key}"]`
        )

        console.log(`#query-${this.$.uid} [name="${key}"]`)

        if (element) {
          element.value = this.parameters.get(key)
        }
      }
    },
    clear() {
      this.$inertia.get(window.location.pathname)
    },
    filter() {
      this.parse(this.$refs.inputs.children)

      this.$inertia.get(window.location.pathname, this.filters)
    },

    parse(collection) {
      Array.from(collection).forEach((element) => {
        if (this.hasValue(element)) {
          this.filters[element.name] = element.value
        } else if (element.children.length && this.isParsable(element)) {
          this.parse(element.children)
        }
      })
    },

    hasValue(element) {
      let tagname = element.tagName.toLowerCase()

      return ['select', 'input', 'button'].includes(tagname)
    },

    isParsable(element) {
      let tagname = element.tagName.toLowerCase()

      return !['svg'].includes(tagname)
    },
  },
}
</script>
