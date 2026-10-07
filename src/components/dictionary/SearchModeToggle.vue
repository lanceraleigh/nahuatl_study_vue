<script setup>
defineProps({ modelValue: { type: String, required: true } });
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="mode-toggle" role="radiogroup" aria-label="Modo de búsqueda">
    <label>
      <input
        type="radio"
        value="occidente"
        :checked="modelValue === 'occidente'"
        @change="$emit('update:modelValue', 'occidente')"
      />
      Occidente
    </label>
    <label>
      <input
        type="radio"
        value="macehualli"
        :checked="modelValue === 'macehualli'"
        @change="$emit('update:modelValue', 'macehualli')"
      />
      Macehualli
    </label>
  </div>
</template>
