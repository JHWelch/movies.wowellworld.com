<script lang="ts" setup>
defineProps<{
  modelValue: string,
  name: string,
  label?: string,
  type?: string,
  error?: string,
  placeholder?: string,
}>()

defineEmits([
  'clear-error',
  'update:modelValue',
])
</script>

<template>
  <div>
    <label
      :for="name"
      class="block text-sm font-medium leading-6 text-gray-900"
      v-text="label ?? name.charAt(0).toUpperCase() + name.slice(1)"
    />

    <div class="relative mt-2">
      <input
        :id="name"
        :value="modelValue"
        required
        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        :placeholder="placeholder ?? ''"
        :type="type ?? 'text'"
        :name="name"
        :aria-describedby="name + '-error'"
        :aria-invalid="error ? 'true' : 'false'"
        :class="{
          'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
          'ring-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-violet-600': !error,
        }"
        @change="$emit('clear-error', name)"
        @input="$emit('update:modelValue', $event.target.value)"
      >

      <div
        x-show="errors.<%= name %>"
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
