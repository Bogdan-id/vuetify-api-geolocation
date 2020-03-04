<template>
<v-app-bar
	app
	color="indigo"
	dense
	class="justify-space-around"
	>
	<v-toolbar-title></v-toolbar-title>
	<v-toolbar-title class="white--text">{{ $t('title.header') }}</v-toolbar-title>
	<v-toolbar-title>
		<v-menu offset-y>
		<template v-slot:activator="{ on }">
			<v-btn text small class="white--text" v-on="on">
				{{ $t('title.lang').toUpperCase() }}
			</v-btn>
		</template>
		<v-list>
			<v-list-item
				v-for="(item, index) in lang"
				:key="index"
				@click="changeLang(item)"
				>
				<v-list-item-title class="text-center">{{ item.toUpperCase() }}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
	</v-toolbar-title>
</v-app-bar>
</template>
<script lang="ts">
import { Component, Vue /* , Prop(if you use props) */ } from 'vue-property-decorator'

/* You can add (imported) components to component below like @component({ components: { ,..yourComponent } }) */
@Component 
export default class Header extends Vue {
	/* Props example */
	// @Prop() readonly msg!: string
	// https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript/

	/* data () => ({}) */
	private langPanel = false

	/* methods: {} */
	changeLang(val: string): void {
		this.$i18n.locale = val
		// this.switchLang
	}

	/* computed: {} */
	
	// get switchLang() {
	// 	return this.$store.dispatch('change_language', this.$t('title.lang'))
	// }
	get lang() {
		return Object.keys(this.$i18n.messages)
	}
	mounted() {
		console.log(this.$t('title.header'))
	}
}
</script>
<style>
	.v-toolbar__content {
		justify-content: space-around;
	}
</style>
