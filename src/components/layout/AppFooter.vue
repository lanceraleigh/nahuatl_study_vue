<template>
  <footer class="site-footer">
    
    <nav>
      <RouterLink to="/about">{{ $t("nav.about") }}</RouterLink>
      <RouterLink to="/who-are-we">{{ $t("nav.whoWeAre") }}</RouterLink>
      <RouterLink to="/contact">{{ $t("nav.contact") }}</RouterLink>
    </nav>

    <RouterLink class="brand" to="/">
      <img 
      src="../../img/IDIEZ_logo_1.png" 
      alt="IDIEZ"
      height="30px"
      />
    </RouterLink>
  </footer>
</template>
