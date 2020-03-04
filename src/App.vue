<template>
  <v-app>
    <Header />
    <Section />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './components/Header.vue';
import Section from './components/Section.vue';

export default Vue.extend({
  name: 'App',

  components: {
		Section,
		Header
  },

  data: () => ({
    //
  }),
});
</script>
