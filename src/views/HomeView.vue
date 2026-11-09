<template>
  <section>
    <h1>Herramientas de estudio de náhuatl</h1>
    <p class="lead">
      Este es un diccionario de apoyo para el estudiante, elaborado por IDIEZ. Muy útil para el
aprendizaje de la lengua nahuatl, variante de la Huasteca Veracruzana. Es un proyecto que aún se
está trabajando para su mejoría. Para buscar la definición de un verbo, por ejemplo, Niccohuaz
alaxox moztla. Es necesario distinguir la raíz del verbo, en el caso de niccohuaz, la raíz es cohua.
Cohua es el verbo que se tiene que buscar en el diccionario:
    </p>

    <div class="tool-grid">
      <RouterLink class="card tool" to="/diccionario"><strong>Diccionario</strong><span>Occidente ↔ Macehualli</span></RouterLink>
      <!-- <RouterLink class="card tool" to="/traductor-conjugador"><strong>Traductor / conjugador</strong><span>Morfología y práctica verbal</span></RouterLink> -->
      <RouterLink class="card tool" to="/tareas"><strong>Tareas interactivas</strong><span>Ejercicios autocorregibles</span></RouterLink>
      <!-- <RouterLink class="card tool" to="/cartas"><strong>Cartas</strong><span>Repaso y recuperación activa</span></RouterLink> -->
      <RouterLink class="card tool" to="/notas"><strong>Notas / apuntes</strong><span>Apuntes guardados localmente</span></RouterLink>
      <!-- <RouterLink class="card tool" to="/predictor"><strong>Predictor</strong><span>Prototipo para entrada de texto</span></RouterLink> -->
      <!-- <RouterLink class="card tool" to="/infantil"><strong>Actividades infantiles</strong><span>Actividades visuales y sencillas</span></RouterLink> -->
      <!-- <RouterLink class="card tool" to="/ortografia"><strong>Ortografía</strong><span>Visualizar sistemas alternativos</span></RouterLink> -->
      <!-- <RouterLink class="card tool" to="/variantes"><strong>Variantes</strong><span>Datos regionales atribuidos</span></RouterLink> -->
    </div>
  </section>
</template>
