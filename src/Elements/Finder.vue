<template>
  <div>
    <div class="flex space-x-4 p-5">
      <div class="flex-1">
        <div class="relative rounded-md shadow-sm">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            autocomplete="off"
            v-query:[connect]="update"
            type="text"
            name="search"
            id="search"
            class="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search"
          />
        </div>
      </div>

      <jet-select
        v-if="trashed"
        :options="trashOptions"
        empty="Not Trashed"
        v-query:[connect]="update"
      />

      <jet-select
        v-if="sort"
        :options="sortOptions"
        empty="Sort"
        v-query:[connect]="update"
      />

      <span
        v-if="$slots['filters']"
        class="select rounded-md border border-gray-300 cursor-pointer"
        @click="filtering = true"
        :class="{
          'bg-blue-100 border-2 border-blue-500': isFiltering,
          'bg-white': !isFiltering,
        }"
      >
        Filters
      </span>
    </div>
    <div
      v-if="$slots['filters'] && filtering"
      class="fixed inset-0 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          @click="filtering = false"
          class="absolute inset-0 transition-opacity"
          aria-hidden="true"
        ></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="relative w-screen max-w-md">
            <div
              class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4"
            >
              <button
                @click="filtering = false"
                type="button"
                class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span class="sr-only">Close panel</span>
                <!-- Heroicon name: outline/x -->
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll"
            >
              <div class="px-4 sm:px-6 pb-6 border-b">
                <h2
                  class="text-lg font-medium text-gray-900"
                  id="slide-over-title"
                >
                  Filters
                </h2>
              </div>
              <div class="mt-6 relative flex-1 px-4 sm:px-6">
                <div class="absolute inset-0 px-4 sm:px-6">
                  <div
                    class="h-full flex justify-between flex-col"
                    aria-hidden="true"
                  >
                    <div class="flex-1 overflow-auto">
                      <slot name="filters" :filters="filterValues" />
                    </div>
                    <div class="flex space-x-4 pb-8 pt-4 border-t mt-4">
                      <jet-button @click="filter">Filter</jet-button>
                      <jet-secondary-button @click="clearFilters"
                        >Clear</jet-secondary-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>
<script>
import JetInput from '@/Jetstream/Input';
import JetSelect from '../Inputs/Select';
import Connect from '../Mixins/Connect';
import { Inertia } from '@inertiajs/inertia';
import JetButton from '@/Jetstream/Button';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';

export default {
  props: {
    sort: Array,
    trashed: Boolean,
    filters: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [Connect],
  components: {
    JetInput,
    JetSelect,
    JetButton,
    JetSecondaryButton,
  },
  beforeMount() {
    Inertia.on('start', () => {
      this.filtering = false;
    });

    this.initFilters();
  },
  data() {
    return {
      filterValues: {},
      filtering: false,
      searching: null,
      sorting: null,
      trashing: null,
    };
  },
  methods: {
    clearFilters() {
      this.filters.forEach((filter) => {
        this.filterValues[filter] = null;
      });
      this.filter();
    },
    filterValue(key) {
      return this.filterValues[key];
    },
    initFilters() {
      this.filters.forEach((filter) => {
        this.filterValues[filter] = null;
      });

      let search = window.location.search;

      if (this.connect) {
        search = localStorage.getItem(this.connect);
      }

      let parameters = Object.fromEntries(
        new URLSearchParams(search).entries()
      );

      Object.keys(this.filterValues).forEach((key) => {
        if (parameters.hasOwnProperty(key)) {
          this.filterValues[key] = parameters[key];
        }
      });
    },
    filter() {
      let filters = JSON.parse(JSON.stringify(this.filterValues));

      Object.keys(filters).forEach(
        (k) => filters[k] == null && delete filters[k]
      );

      Inertia.get(window.location.pathname, filters, { preserveState: true });

      this.$emit('filter', filters);
    },
    update(payload) {
      if (this.connect) {
        this.connectChanged('updateQuery', payload);
      } else {
        this.$inertia.get(window.location.pathname, payload, {
          preserveState: true,
        });
      }
    },
    displayFormat(item) {
      return item
        .replace('_', ' ')
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    },
  },
  computed: {
    isFiltering() {
      return (
        Object.keys(this.filterValues).filter((key) => this.filterValues[key])
          .length > 0
      );
    },
    trashOptions() {
      return [
        {
          name: 'with-deleted',
          value: 'true',
          display: 'With Trashed',
        },
        {
          name: 'deleted',
          value: 'true',
          display: 'Only Trashed',
        },
      ];
    },
    sortOptions() {
      if (!this.sort) {
        return [];
      }

      let options = [];

      this.sort.forEach((item) => {
        if (item instanceof Object) {
          options.push(item);
        } else {
          options.push({
            name: 'sort',
            value: item,
            display: this.displayFormat(item) + ' (asc)',
          });

          options.push({
            name: 'sort-desc',
            value: item,
            display: this.displayFormat(item) + ' (desc)',
          });
        }
      });

      return options;
    },
  },
};
</script>
