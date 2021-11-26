<template>
  <div>
    <form
      @submit.prevent="submit"
      class="w-full"
      :action="action"
      :method="formMethod"
    >
      <div v-if="success" class="p-5 bg-white border-b">
        <slot name="success">
          <p class="font-bold text-center text-green-700">Success!</p>
        </slot>
      </div>
      <div
        v-if="fieldsFormatted.length"
        class="grid grid-cols-12 gap-4 p-5 bg-white"
      >
        <div
          v-for="(field, index) in fieldsFormatted"
          :key="field.name"
          class="py-2"
          :class="`col-span-${field.span}`"
          :data-testid="`field-${field.name}`"
        >
          <div v-if="field.hasOwnProperty('divider')" class="pb-5 border-b" />

          <slot
            v-else-if="field.section_title"
            name="section_title"
            :value="field.section_title"
          >
            <div>
              <p
                class="
                  flex-1
                  pb-4
                  font-semibold
                  leading-tight
                  tracking-wider
                  text-gray-700
                  border-b
                "
              >
                {{ field.section_title }}
              </p>
            </div>
          </slot>

          <slot
            v-else
            :name="`field.${field.name}.all`"
            :errors="errors"
            :error="getError(field.name)"
            :index="index"
            :form="form"
          >
            <div>
              <jet-label :for="field.name" :value="field.label" />

              <div class="mt-1">
                <div>
                  <slot
                    :name="`field.${field.name}`"
                    :index="index"
                    :form="form"
                  >
                    <component
                      :is="field.component"
                      :id="field.name"
                      :name="field.name"
                      :placeholder="field.label"
                      class="w-full"
                      v-model="form[field.name]"
                      :disabled="form.processing"
                      autocomplete="new-password"
                      :class="{ disabled: form.processing }"
                      v-bind="field.props"
                    />
                  </slot>

                  <!-- TODO: errorsFormatted to avoid multiple formats                    -->
                  <!-- TODO: fields.title.error slot -->
                  <div
                    data-testid="error"
                    v-if="errors && errors.hasOwnProperty(field.name)"
                  >
                    <JetInputError
                      v-if="Array.isArray(errors[field.name])"
                      :message="errors[field.name][0]"
                    />
                    <JetInputError v-else :message="errors[field.name]" />
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
      <slot name="footer">
        <div class="flex justify-end p-5 border-t rounded-b">
          <slot
            name="cancel"
            :form="form"
            :cancel="cancel"
            v-if="hasCancelListener"
          >
            <jet-secondary-button
              class="mr-3"
              @click="cancel"
              :disabled="form.processing"
              data-testid="cancel"
              :class="{ 'opacity-25': form.processing }"
            >
              Cancel
            </jet-secondary-button>
          </slot>
          <slot name="submit" :form="form" :submit="submit">
            <jet-button
              :disabled="form.processing"
              :class="{ 'opacity-25': form.processing }"
            >
              {{ formMethod === 'POST' ? 'Create' : 'Update' }}
            </jet-button>
          </slot>
        </div>
      </slot>
    </form>
  </div>
  <div
    v-if="false"
    class="
      col-span-1
      col-span-2
      col-span-3
      col-span-4
      col-span-5
      col-span-6
      col-span-7
      col-span-8
      col-span-9
      col-span-10
      col-span-11
      col-span-12
    "
  ></div>
</template>

<script>
import { Inertia } from '@inertiajs/inertia'
import { useForm } from '@inertiajs/inertia-vue3'
import JetButton from '@/Jetstream/Button.vue'
import JetSecondaryButton from '@/Jetstream/SecondaryButton.vue'
import JetLabel from '@/Jetstream/Label.vue'
import JetInput from '@/Jetstream/Input.vue'
import JetInputError from '@/Jetstream/InputError.vue'
import Connect from '../Mixins/Connect'
import Config from '../Mixins/Config'
import axios from 'axios'

export default {
  components: {
    JetLabel,
    JetInput,
    JetButton,
    JetInputError,
    JetSecondaryButton,
  },
  mixins: [Connect, Config],
  props: {
    action: String,
    method: String,
    autocomplete: {
      type: String,
      default: 'new-password',
    },
    formHandler: {
      type: Object,
    },
    exclude: {
      type: Array,
      default: [
        'id',
        'uuid',
        'created_at',
        'updated_at',
        'deleted_at',
        'parent_deleted_at',
      ],
    },
    fields: {
      default: (props) => {
        if (!props.fields && props.values !== undefined) {
          return Object.keys(props.values).filter(
            (field) => !props.exclude.includes(field)
          )
        } else {
          return []
        }
      },
    },
    values: Object,
  },
  data() {
    return {
      form: null,
      success: false,
      formMethod: null,
      errors: null,
    }
  },
  beforeMount() {
    this.setFormMethod()
    let values = this.getInitialFormValues()
    this.setForm(values)
  },

  methods: {
    getInitialFormValues() {
      let values = {}

      if (this.values) {
        values = JSON.parse(JSON.stringify(this.values))
      }

      this.fieldsFormatted.forEach((field) => {
        values[field.name] = values.hasOwnProperty(field.name)
          ? values[field.name]
          : field.value
      })

      return values
    },
    setFormMethod() {
      if (this.method) {
        this.formMethod = this.method
      } else {
        this.formMethod =
          this.values && Object.keys(this.values).length !== 0 && !this.method
            ? 'PUT'
            : 'POST'
      }
    },
    setForm(values) {
      if (this.connect) {
        this.form = values
      } else if (!this.formHandler) {
        this.form = useForm(values)
      } else {
        this.form = this.formHandler
      }
      if (this.formMethod === 'PUT') {
        this.form._method = 'put'
      }
    },
    labelize(label) {
      return label
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
    },
    defaultFieldFormat(field) {
      let output = {
        name: field,
        label: this.labelize(field),
        component: 'jet-input',
        props: {
          type: 'text',
        },
        span: '12',
      }

      let fieldConfig = this.config.get(`fields.${field}`, {})

      Object.keys(fieldConfig).forEach((setting) => {
        output[setting] = this.config.get(`fields.${field}.${setting}`)
      })

      return output
    },
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.success = false
      this.errors = null
      debugger

      if (this.connect) {
        this.makeAxiosRequest()
      } else {
        this.makeInertiaRequest()
      }
    },
    makeAxiosRequest() {
      axios({
        method: this.formMethod.toLowerCase(),
        url: this.action,
        data: this.form,
        headers: { 'Wants-Json': true },
      })
        .then((response) => {
          this.connectChanged('refresh')
          this.$emit('success', response.data)
        })
        .catch((errors) => {
          if (errors.response && errors.response.status === 401) {
            Inertia.get(window.location)
          }
          this.errors = errors.response.data.errors
        })
    },
    makeInertiaRequest() {
      this.form.submit(this.formMethod.toLowerCase(), this.action, {
        preserveScroll: true,
        onError: () => {
          this.errors = this.$page.props.errors
        },
        onSuccess: () => {
          this.success = true
          this.form.reset()
        },
      })
    },
    getError(name) {
      // todo: normalize the errors array instead
      if (this.errors && this.errors.hasOwnProperty(name)) {
        if (Array.isArray(this.errors[name])) {
          return this.errors[name][0]
        } else {
          return this.errors[name]
        }
      }

      return null
    },
    addFieldMissing(field) {
      if (field.hasOwnProperty('divider')) {
        return { ...field, name: 'divider', span: 12 }
      } else if (field.hasOwnProperty('section_title')) {
        return { ...field, name: 'section_title', span: 12 }
      }

      if (!field.hasOwnProperty('span')) {
        field.span = '12'
      }

      if (!field.hasOwnProperty('label')) {
        field.label = this.labelize(field.name)
      }

      if (!field.hasOwnProperty('component')) {
        field.component = 'jet-input'
      }

      if (!field.hasOwnProperty('props') && field.component === 'jet-input') {
        field.props = { type: 'text' }
      }

      return field
    },
  },
  computed: {
    hasCancelListener() {
      return this.$attrs && this.$attrs.onCancel
    },
    fieldsFormatted() {
      if (this.fields.length === 0) {
        return []
      }

      if (typeof this.fields[0] === 'string') {
        return this.fields.map((field) => {
          return this.defaultFieldFormat(field)
        })
      }

      return this.fields.map((field) => {
        return this.addFieldMissing(field)
      })
    },
  },
}
</script>
