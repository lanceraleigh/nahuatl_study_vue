<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">
      <img 
      src="../../img/IDIEZ_logo_no_text.png" 
      alt="IDIEZ"
      height="30px"
      />
    </RouterLink>
    <nav>
      <RouterLink to="/diccionario">Diccionario</RouterLink>
      <!-- <RouterLink to="/traductor-conjugador">Conjugador</RouterLink> -->
      <RouterLink to="/tareas">Tareas</RouterLink>
      <!-- <RouterLink to="/cartas">Cartas</RouterLink> -->
      <RouterLink to="/notas">Notas</RouterLink>
      <select id="language-select" name="language">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </nav>
    
  </header>
</template>
