<script lang="ts" setup>
withDefaults(defineProps<{
  name: string,
  hideLabel?: boolean,
  label?: string,
  type?: string,
  error?: string,
  placeholder?: string,
  required?: boolean,
}>(), {
  hideLabel: false,
  type: 'text',
  placeholder: '',
  error: undefined,
  label: undefined,
  required: false,
})

defineEmits([
  'clear-error',
  'enter',
])

const model = defineModel<string>()
</script>

<template>
  <div class="w-full">
    <label
      v-if="!hideLabel"
      :for="name"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label ?? name.charAt(0).toUpperCase() + name.slice(1) }}

      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </label>

    <div
      class="relative"
      :class="{ 'mt-2': !hideLabel }"
    >
      <input
        :id="name"
        v-model="model"
        :data-testid="'input-' + name"
        :required="required"
        :placeholder="placeholder"
        :type="type"
        :name="name"
        :aria-describedby="name + '-error'"
        :aria-invalid="error ? 'true' : 'false'"
        :class="{
          'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6': true,
          'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
          'ring-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-brat-500': !error,
        }"
        @input="
          $emit('clear-error', name)
        "
        @keyup.enter="$emit('enter')"
      >

      <div
        v-show="error"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <p
      v-show="error"
      :id="name + '-error'"
      class="mt-2 text-sm text-red-600"
      v-text="error"
    />
  </div>
</template>
