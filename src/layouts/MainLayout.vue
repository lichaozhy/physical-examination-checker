<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-space></q-space>
				<q-toolbar-title class="text-center">{{
					$t('app.name')
				}}</q-toolbar-title>
				<q-space></q-space>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
</script>
