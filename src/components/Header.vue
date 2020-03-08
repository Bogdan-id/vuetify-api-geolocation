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
<script lang="ts" src="./header/">
</script>
<style>
	.v-toolbar__content {
		justify-content: space-around;
	}
</style>
