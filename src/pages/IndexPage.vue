<template>
	<q-page
		class="column content-center"
		padding
	>
		<div class="app-content-main">
			<q-form>
				<div class="row q-col-gutter-md">
					<div class="col">
						<q-file
							stack-label
							square
							:label="$t('parameter.file')"
							dense
							outlined
							v-model="file"
						></q-file>
					</div>
					<div class="col-shrink">
						<q-input
							type="number"
							style="width: 10em"
							stack-label
							square
							:label="$t('parameter.repeat-metric-number')"
							dense
							outlined
							v-model="repeatMetricNumber"
						></q-input>
					</div>
					<div class="col-12 row justify-center">
						<div
							class="col"
							style="max-width: 24em"
						>
							<q-btn
								:disable="file === null"
								dense
								class="full-width"
								size="lg"
								color="primary"
								:label="$t('check')"
							></q-btn>
						</div>
					</div>
				</div>
			</q-form>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const repeatMetricNumber = ref<number>(6);
const file = ref<File | null>(null);
</script>
