import { Component, Vue, Watch } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { ipAddress } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

interface IpObject {
	ip: string;
	continent: string;
	country: string;
	city: string;
	postCode: string;
	coordinates: string;
}
interface RowIpObject {
	language: string;
	ip: string;
	countryCode: string;
	countryName: string;
	continentCode: string;
	continentName: string;
	city: string;
	postCode: string;
	latitude: number;
	longitude: number;
}

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
	public ipHistory: any = {}

	addIpHistoryLang(): void {
		this.availableLang.forEach((v: string) => {
			this.$set(this.ipHistory, v, [])
		})
	}
	applyIpMask(): void {
		const el: HTMLInputElement = document.getElementById('ip') as HTMLInputElement
		const numOctet = 4
		if(el) {
			const temp = el.value
				.replace(/[^\d.]/g, '')
				.replace(/[.]{2,3}/g, '.')
			const find: RegExpMatchArray | null = temp.match(/\d{1,3}(?=\.)|\d{1,3}/g)
			let arr: Array<string> = []
			if (find) {
				arr = find.map(v => {
					if (parseInt(v) > 255) return '255'
					return v
				})
			}
			if (arr && arr.length >= numOctet){
				if (el.value !== arr.slice(0, numOctet).join('.')) {
					el.value = arr.slice(0, numOctet).join('.')
					el.dispatchEvent(this.inputEvent)
				}
			} else if(arr && /\.$/.test(el.value)) {
				if(el.value !== arr.join('.') + '.'){
					el.value = arr.join('.') + '.'
					el.dispatchEvent(this.inputEvent)
				}
			} else if (arr != null && el.value !== arr.join('.')){
				el.value = arr.join('.')
				el.dispatchEvent(this.inputEvent)
			}
		}
	}
	skipQuery(state: boolean, index: number) {
			this.postIPLang = this.availableLang[index]
			this.$apollo.queries.postIP.skip = state
	}
	createObject(v: RowIpObject): IpObject {
		const t = (val: string | null): boolean => val != null 
		const r = (val: number): string => {return (Math.round(val * 100) / 100).toString()}
		return {
			ip: v.ip,
			continent: `${t(v.continentName) ? v.continentName + '/' + v.continentCode : '--'}`,
			country: `${t(v.countryName) ? v.countryName + '/' + v.countryCode : '--'}`,
			city: `${t(v.city) ? v.city : '--'}`,
			postCode: `${t(v.postCode) ? v.postCode : '--'}`,
			coordinates: `${t((v.latitude).toString()) ? r(v.latitude) + ' / ' + r(v.longitude) : '--'}`
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
			const el = document.getElementById('ip') as HTMLInputElement
			el.value = '1.1.1.1'
			el.dispatchEvent(this.inputEvent)
		}
	}
	chooseArrLang(val: RowIpObject): void {
		// eslint-disable-next-line
		this.ipHistory.hasOwnProperty(val.language)
			? false
			: this.$set(this.ipHistory, val.language, [])
		this.ipHistory[val.language].push(this.createObject(val))
		this.toggleLanguage()
	}
	checkValue(ip: any) {
		this.$apollo.queries.postIP.skip = true
		if (ip[0].ip != null) {
			this.chooseArrLang(ip[0])
		}
	}

	get inputValid (): boolean {
		if(this.$v.ip) return this.$v.ip.ipAddress && this.$v.ip.$dirty
		return false
	}
	get availableLang () {
		return Object.keys(this.$i18n.messages)
	}
	get valPresent (): boolean {
		return this.ipHistory[(this.$t('title.lang')).toString()].length > 0
	}
	get inputEvent () {
		return new Event('input', {bubbles: true})
	}
	get interfaceLang () {
		return this.$t('title.lang')
	}
	get ipError (): string[] {
		const errors = []
		if(this.$v.ip) {
			!this.$v.ip.ipAddress && errors.push(this.$t('input.ivalidIp').toString())
		}
		return errors
	}
	// Record<K, T> (K - key, T - value)
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
	changePostIP(val: Record<string, object>): void {
		val != null 
				? this.checkValue(val) 
				: false
	}
	@Watch('interfaceLang')
	changeInterface(): void {
		const rowDescription: HTMLElement = document.querySelector('.v-data-footer__select') as HTMLElement
		if(rowDescription && rowDescription.firstChild){
			rowDescription.firstChild.nodeValue = this.$t('tableDesc.row').toString()
			for (const key of document.getElementsByTagName("td")) {
				if(key.firstChild){
					if(key.textContent === 'No data available' || 'Нет данных' && !this.valPresent) {
						key.firstChild.nodeValue = this.$t('tableDesc.noData').toString()
					}
				}
			}
		}
	}
	created () {
		this.addIpHistoryLang()
	}
	mounted () {
		const callToggleLang = () => this.toggleLanguage()
		const el = document.getElementById('ip') as HTMLInputElement
		el.addEventListener('keypress', function (e) {
				if (e.key === 'Enter') {
					callToggleLang()
				}
		})
	}
}