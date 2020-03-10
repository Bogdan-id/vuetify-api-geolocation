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
						@input="applyIpMask(); $v.ip.$touch()"
						@blur="$v.ip.$touch()"
					>
					</v-text-field>
					<span></span>
					<v-btn 
						small 
						color="primary" 
						class="mt-2 mb-2"
						@click="toggleLanguage()"
						>{{ $t('button.getInfo') }}
					</v-btn>
				</v-col>
			</v-row>
			<v-data-table
				:headers="ipTableHeader"
				:items="ipHistory[interfaceLang]"
				:items-per-page="5"
				dense
				class="elevation-1"
			></v-data-table>
			<div class="d-flex justify-end">
				<v-btn 
					@click="addIpHistoryLang()"
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

<script lang="ts" src="./section/">
</script>
