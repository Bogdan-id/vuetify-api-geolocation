import { Component, Vue, Watch } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { ipAddress } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

@Component({
	mixins:[validationMixin],
	validations: {
    ip: {
      ipAddress,
    }
	},
	apollo: {
		postIP: {
			query: gql`query rundomFunc($ip: String!, $lang: String!) {
				postIP(ip: $ip, lang: $lang) {
					language
					ip
					countryCode
					countryName
					continentCode
					continentName
					city
					postCode
					latitude
					longitude
				}
			}`,
			variables () {
				return {
					ip: this.ip,
					lang: this.postIPLang
				}
			},
			skip () {
				return this.skipQuery
			},
		}
	}
})
export default class Section extends Vue {
	// data 
	public ip: string | null = null
	public postIP: object | string = ''
	public postIPLang: null | string = null
	public currentIndex = 0
	public ipHistory: object = {}

	addIpHistoryLang() {
		this.availableLang.forEach(v => {
			this.$set(this.ipHistory, v, [])
		})
	}
	applyIpMask() {
		const el: object = document.getElementById('ip')
		const numOctet = 4
		const temp = el.value
			.replace(/[^\d.]/g, '')
			.replace(/[.]{2,3}/g, '.')
		let find = temp.match(/\d{1,3}(?=\.)|\d{1,3}/g)
		if (find != null) {
			find = find.map(v => {
				if (v > 255) return 255
				return v
			})
		}
		if (find != null && find.length >= numOctet){
			if (el.value !== find.slice(0, numOctet).join('.')) {
				el.value = find.slice(0, numOctet).join('.')
				el.dispatchEvent(this.inputEvent)
			}
		} else if(find != null && /\.$/.test(el.value)) {
			if(el.value !== find.join('.') + '.'){
				el.value = find.join('.') + '.'
				el.dispatchEvent(this.inputEvent)
			}
		} else if (find != null && el.value !== find.join('.')){
			el.value = find.join('.')
			el.dispatchEvent(this.inputEvent)
		}
	}
	clearHistory() {
		Object.keys(this.ipHistory).map(v => {
			this.ipHistory[v] = []
		})
	}
	skipQuery(state: boolean, index: number) {
			this.postIPLang = this.availableLang[index]
			this.$apollo.queries.postIP.skip = state
	}
	createObject(v) {
		const t = val => val != null 
		const r = val => Math.round(val * 100) / 100
		return {
			'ip': v.ip,
			'continent': `${t(v.continentName) ? v.continentName + '/' + v.continentCode : '--'}`,
			'country': `${t(v.countryName) ? v.countryName + '/' + v.countryCode : '--'}`,
			'city': `${t(v.city) ? v.city : '--'}`,
			'postCode': `${t(v.postCode) ? v.postCode : '--'}`,
			'coordinates': `${t(v.latitude) ? r(v.latitude) + ' / ' + r(v.longitude) : '--'}`
		}
	}
	toggleLanguage() {
		const indexes = this.availableLang.length - 1
		if(this.inputValid){
			if(this.currentIndex <= indexes){
				this.skipQuery(false, this.currentIndex)
				this.currentIndex ++
			} else {
				this.currentIndex = 0
				this.postIPLang = null
			}
		} else {
			const el = document.getElementById('ip')
			el.value = '1.1.1.1'
			el.dispatchEvent(this.inputEvent)
		}
	}
	chooseArrLang(val) {
		this.ipHistory[val.language] == null
			? this.$set(this.ipHistory, val.language, [])
			: false
		this.ipHistory[val.language].push(this.createObject(val))
		this.toggleLanguage()
	}
	checkValue(ip) {
		this.$apollo.queries.postIP.skip = true
		if (ip[0].ip != null) {
			this.chooseArrLang(ip[0])
		}
	}

	get inputValid () {
		return this.$v.ip.ipAddress && this.$v.ip.$dirty
	}
	get availableLang () {
		return Object.keys(this.$i18n.messages)
	}
	get valPresent () {
		return this.ipHistory[this.$t('title.lang')].length > 0
	}
	get inputEvent () {
		return new Event('input', {bubbles: true})
	}
	get interfaceLang () {
		return this.$t('title.lang')
	}
	get ipError () {
		const errors = []
		!this.$v.ip.ipAddress && errors.push(this.$t('input.ivalidIp'))
		return errors
	}
	get ipTableHeader () {
		return [
				{text: this.$t('table.ip'), value: 'ip'},
				{text: this.$t('table.continent'), value: 'continent'},
				{text: this.$t('table.country'), value: 'country'},
				{text: this.$t('table.city'), value: 'city'},
				{text: this.$t('table.postal'), value: 'postCode'},
				{text: this.$t('table.coordinates'), value: 'coordinates'}
			]
	}
	@Watch('postIP')
	changePostIP(val) {
		val != null 
				? this.checkValue(val) 
				: false
	}
	@Watch('interfaceLang')
	changeInterface() {
		const rowDescription = document.querySelector('.v-data-footer__select').firstChild
		rowDescription.nodeValue = this.$t('tableDesc.row')
		for (const key of document.getElementsByTagName("td")) {
			// eslint-disable-next-line
			if(key.textContent === 'No data available' || 'Нет данных' && !this.valPresent) {
				key.firstChild.nodeValue = this.$t('tableDesc.noData')
			}
		}
	}
	created () {
		this.addIpHistoryLang()
	}
}