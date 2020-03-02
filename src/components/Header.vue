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
<script>
// import LangIcon from '../assets/lang-icon.vue'

export default {
	data: () => ({
		langPanel: false,
		lang: ['en', 'ru']
	}),
	methods: {
		test() {

		},
		changeLang(val) {
			this.$i18n.locale = val
			this.switchLang
		}
	},
	computed: {
		langIcon() {
			return this.langPanel ? 'lang-icon active' : 'not-active'
		},
		langMenu() {
			return this.langPanel ? 'lang-panel active' : 'lang-panel'
		},
		currentLocale() {
			return this.$i18n.locale
		},
		enColor() {
			return this.currentLocale === 'en' ? 'color: #656BF2;' : ''
		},
		ruColor() {
			return this.currentLocale === 'ru' ? 'color: #656BF2;' : ''
		},
		switchLang() {
			return this.$store.dispatch('change_language', this.$t('title.lang'))
		}
	},
	mounted() {
		this.switchLang
	},
	components: {
	},
}
</script>
<style>
	.v-toolbar__content {
		justify-content: space-around;
	}
</style>
