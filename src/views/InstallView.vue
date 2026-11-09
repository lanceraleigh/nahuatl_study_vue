<script setup>
import { ref } from 'vue';
import { offlineReady, updateAvailable, isOnline, applyUpdate } from '../services/offline';

const platform = ref('iphone');
</script>

<template>
  <section class="install-page">
    <h1>Instala la aplicación</h1>
    <p class="intro">Estudia náhuatl desde tu celular, incluso sin conexión a internet. Puedes añadir esta aplicación a la pantalla de inicio y abrirla como cualquier otra aplicación, sin descargarla de una tienda.</p>

    <div class="install-panel">
      <h2>¿Qué dispositivo utilizas?</h2>
      <div class="device-tabs" role="group" aria-label="Selecciona tu dispositivo">
        <button type="button" :class="{selected: platform === 'iphone'}" :aria-pressed="platform === 'iphone'" @click="platform = 'iphone'">iPhone / iPad</button>
        <button type="button" :class="{selected: platform === 'android'}" :aria-pressed="platform === 'android'" @click="platform = 'android'">Android</button>
      </div>

      <ol v-if="platform === 'iphone'" class="steps">
        <li><strong>Abre la página en Safari.</strong> Pulsa el botón <strong>Compartir</strong> (un cuadrado con una flecha hacia arriba).</li>
        <li><strong>Añádela a la pantalla de inicio.</strong> Selecciona «Añadir a pantalla de inicio» y confirma. Según tu versión de iOS, puede ser necesario buscar la opción en el menú.</li>
        <li><strong>Abre la aplicación desde su icono.</strong> Mantén la conexión hasta que aparezca el mensaje «Disponible sin conexión».</li>
      </ol>
      <ol v-else class="steps">
        <li><strong>Abre la página en Chrome.</strong> Visita esta aplicación desde tu dispositivo Android.</li>
        <li><strong>Instala la aplicación.</strong> Abre el menú de los tres puntos (⋮) y selecciona «Instalar aplicación» o «Añadir a pantalla de inicio».</li>
        <li><strong>Abre la aplicación desde su icono.</strong> Mantén la conexión hasta que aparezca el mensaje «Disponible sin conexión».</li>
      </ol>
    </div>

    <div class="install-panel details">
      <h2>¿Cómo funciona?</h2>
      <h3>Sin conexión a internet</h3>
      <p>Después de descargar correctamente los archivos necesarios, podrás consultar el diccionario, hacer las actividades disponibles y usar tus apuntes incluso en modo avión. La primera visita debe realizarse con internet.</p>
      <h3>Actualizaciones</h3>
      <p>Cuando vuelvas a conectarte y abras la aplicación, se buscarán nuevas versiones. Si hay una actualización, aparecerá una opción para instalarla. Tus cambios personales guardados en este dispositivo se mantienen durante las actualizaciones normales.</p>
      <h3>Tus datos</h3>
      <p>Las palabras que añadas, tus modificaciones y tus apuntes se guardan en el dispositivo. Si borras los datos del navegador o de la aplicación, puedes perderlos. Instalar la aplicación no crea una copia de seguridad ni sincroniza tus datos entre dispositivos.</p>
    </div>

    <div class="install-panel status" role="status" aria-live="polite">
      <h2>Estado de la aplicación</h2>
      <p v-if="offlineReady" class="ready">✓ Disponible sin conexión en este navegador.</p>
      <p v-else-if="!isOnline">Estás sin conexión. No se ha confirmado que todos los archivos estén guardados.</p>
      <p v-else>Conectado. Abre la aplicación y espera a que termine la preparación para usarla sin conexión.</p>
      <p v-if="updateAvailable">Hay una nueva versión disponible. <button type="button" class="update-button" @click="applyUpdate">Actualizar ahora</button></p>
      <p class="small">La disponibilidad sin conexión depende del almacenamiento del dispositivo. Si el sistema borra los datos de la aplicación, tendrás que abrirla de nuevo con internet.</p>
    </div>
  </section>
</template>

<style scoped>
.install-page{max-width:850px;margin:0 auto;padding:1rem 1rem 3rem;line-height:1.65}
.install-page h1{margin-bottom:.5rem}.intro{font-size:1.08rem;margin-bottom:1.5rem}
.install-panel{border:1px solid #cddbd2;border-radius:14px;padding:1.25rem 1.5rem;margin:1.2rem 0;background:var(--card-bg,#fff)}
.install-panel h2{font-size:1.2rem;margin:0 0 1rem}.install-panel h3{font-size:1rem;margin:1.2rem 0 .25rem;color:#315c49}
.device-tabs{display:flex;gap:.5rem;flex-wrap:wrap}.device-tabs button,.update-button{padding:.65rem 1rem;border:1px solid #315c49;border-radius:8px;background:transparent;color:inherit;cursor:pointer;font:inherit}
.device-tabs button.selected,.update-button{background:#315c49;color:white}.device-tabs button:focus-visible,.update-button:focus-visible{outline:3px solid #88bca4;outline-offset:2px}
.steps{padding-left:1.5rem}.steps li{margin:1rem 0;padding-left:.3rem}.ready{color:#246c48;font-weight:700}.small{font-size:.88rem;opacity:.85}
@media(max-width:500px){.install-panel{padding:1rem}.device-tabs button{flex:1}}

:global([data-theme="dark"]) .install-panel { background:var(--panel); border-color:var(--border); }
:global([data-theme="dark"]) .install-panel h3 { color:var(--accent); }
:global([data-theme="dark"]) .ready { color:#a5ddba; }
</style>
