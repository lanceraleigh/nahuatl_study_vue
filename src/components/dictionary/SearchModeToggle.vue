<script setup>
defineProps({ modelValue: { type: String, required: true } });
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>Buscar definicion desde:</div>
  <div class="mode-toggle" role="radiogroup" aria-label="Modo de búsqueda">
    

    <label>
      <input
        type="radio"
        value="macehualli"
        :checked="modelValue === 'macehualli'"
        @change="$emit('update:modelValue', 'macehualli')"
      />
      Nahuatl
    </label>
    <label>
      <input
        type="radio"
        value="occidente"
        :checked="modelValue === 'occidente'"
        @change="$emit('update:modelValue', 'occidente')"
      />
      Otra lengua
    </label>
    
  </div>
</template>
