import { Component, Vue /* , Prop(if you use props) */ } from 'vue-property-decorator'

/* You can add (imported) components to component below like @component({ components: { ,..yourComponent } }) */
@Component 
export default class Header extends Vue {
	/* Props example */
	// @Prop() readonly msg!: string
	// https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript/

	/* data () => ({}) */
	// private langPanel = false

	/* methods: {} */
	public changeLang(val: string): void {
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
}