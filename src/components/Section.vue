<template>
<v-content app>
<v-container >
	<v-row class="align-center">
		<v-col cols="12">
			<v-row class="align-center">
				<v-col cols="6" xs="10" md="3">
					<v-text-field
						id="ip"
						v-model="ip"
						:placeholder="$t('input.placeHolder')"
						:error-messages="ipError"
						@input="applyIpMask()"
						@blur="$v.ip.$touch()"
					>
					</v-text-field>
					<v-btn small color="primary" class="mt-2 mb-2" @click="fetchQuery()">{{ $t('button.getInfo') }}</v-btn>
				</v-col>
			</v-row>
			<v-data-table
				:headers="ipTable"
				:items="ipHistory[$t('title.lang')]"
				:items-per-page="5"
				dense
				class="elevation-1"
			></v-data-table>
			<div class="d-flex justify-end">
				<v-btn 
					@click="clearHistory()"
					:disabled="!valPresent"
					class="ma-2"
					color="error"
					small
				>{{ $t('button.clearHistory') }}
				</v-btn>
			</div>
		</v-col>
	</v-row>
</v-container>
</v-content>

</template>

<script>
import gql from 'graphql-tag'
import { ipAddress } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
	mixins: [validationMixin],
	data: () => ({
		ip: null,
		// default api language
		postIPLang: 'en',
		toggleLang: false,
		postIP: '',
		errors: false,
		ipHistory: {
			ru: [],
			en: [],
		},
	}),
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
		},
	},
	validations: {
    ip: {
      ipAddress
    },
  },
	methods: {
		applyIpMask() {
			let el = document.getElementById('ip')
			let event = new Event('input', {bubbles: true})
			let numOctet = 4
			let temp = el.value
				.replace(/[^\d.]/g, '')
				.replace(/[.]{2,3}/g, '.')
			let find = temp.match(/\d{1,3}(?=\.)|\d{1,3}/g)
			if(find != null) {
				find = find.map(v => {
					if(v > 255) return 255
					return v
				})
			}
			if(find != null && find.length >= numOctet){
				if(el.value !== find.slice(0, numOctet).join('.')) {
					el.value = find.slice(0, numOctet).join('.')
					el.dispatchEvent(event)
				}
			} else if(find != null && /\.$/.test(el.value)) {
				if(el.value !== find.join('.') + '.'){
					el.value = find.join('.') + '.'
					el.dispatchEvent(event)
				}
			} else if (find != null && el.value !== find.join('.')){
				el.value = find.join('.')
				el.dispatchEvent(event)
			}
		},
		checkInput() {
			this.ip == null 
				? this.errors = true
				: this.ip.replace(/[^\d]/g, '').length !== 10 
				? this.errors = true
				: this.errors = false
		},
		clearHistory() {
			this.ipHistory.ru = []
			this.ipHistory.en = []
		},
		fetchQuery(state) {
			this.$apollo.queries.postIP.skip = state
		},
		toggle() {
			this.toggleLang = !this.toggleLang
			return this.toggleLang ? 'ru' : 'en'
		},
		createObject(v) {
			// test value
			let t = val => val != null 
			// round value
			let r = val => Math.round(val * 100) / 100
			return {
				'ip': v.ip,
				'continent': `${t(v.continentName) ? v.continentName + '/' + v.continentCode : '--'}`,
				'country': `${t(v.countryName) ? v.countryName + '/' + v.countryCode : '--'}`,
				'city': `${t(v.city) ? v.city : '--'}`,
				'postCode': `${t(v.postCode) ? v.postCode : '--'}`,
				'coordinates': `${t(v.latitude) ? r(v.latitude) + ' / ' + r(v.longitude) : '--'}`
			}
		},
		chooseArrLang(val) {
			switch(val.language) {
				case 'en': this.ipHistory.en.push(this.createObject(val)); break
				case 'ru': this.ipHistory.ru.push(this.createObject(val)); break
			}
			this.fetchQuery(true)
			if(this.ipHistory.ru.length !== this.ipHistory.en.length){
				this.postIPLang = this.toggle()
				this.fetchQuery(false)
			}
		},
		checkValue(ip) {
			if(ip[0].ip != null){
				this.chooseArrLang(ip[0])
			}
		},
	},
	computed: {
		valPresent() {
			return this.ipHistory[this.$t('title.lang')].length > 0
		},
		ipObj() {
			let num = this.ipHistory[this.$t('title.lang')].length - 1
			return this.ipHistory[this.$t('title.lang')][num]
		},
		ipTable() {
			return [
					{text: this.$t('table.ip'), value: 'ip'},
					{text: this.$t('table.continent'), value: 'continent'},
					{text: this.$t('table.country'), value: 'country'},
					{text: this.$t('table.city'), value: 'city'},
					{text: this.$t('table.postal'), value: 'postCode'},
					{text: this.$t('table.coordinates'), value: 'coordinates'}
			]
		},
		lang() {
			return this.$t('title.lang')
		},
		ipError() {
			const errors = []
			!this.$v.ip.ipAddress && errors.push(this.$t('input.ivalidIp'))
			return errors
		}
	},
	watch: {
		postIP(val) {
			val !== undefined 
				? this.checkValue(val) 
				: false
		},
		lang() {
			let rowDescription = document.querySelector('.v-data-footer__select').firstChild
			rowDescription.nodeValue = this.$t('tableDesc.row')
			for (let key of document.getElementsByTagName("td")) {
				// eslint-disable-next-line
				if(key.textContent === 'No data available' || 'Нет данных' && !this.valPresent) {
					key.firstChild.nodeValue = this.$t('tableDesc.noData')
				}
			}
		}
	}
}
</script>
