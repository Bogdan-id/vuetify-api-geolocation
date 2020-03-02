<template>
  <v-app>
      <Header/>
			<Section/>
  </v-app>
</template>

<script>
import Header from './components/Header'
import Section from './components/Section'

export default {
  name: 'App',

  components: {
		Header,
		Section
  }
}
</script>
