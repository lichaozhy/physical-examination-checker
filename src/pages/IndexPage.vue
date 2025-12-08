<template>
	<q-page
		class="column content-center"
		padding
	>
		<div class="app-content-main">
			<div class="row q-col-gutter-md">
				<div class="col-2">
					<q-form>
						<div>
							<q-file
								stack-label
								square
								:label="$t('parameter.file')"
								dense
								outlined
								v-model="sampleFile"
								clearable
								color="indigo-10"
							></q-file>
						</div>
						<div class="q-pt-lg q-mt-md">
							<q-slider
								type="number"
								label
								snap
								label-always
								:min="0"
								:max="10"
								:label-value="`${$t('parameter.repeat-metric-number')}: ${repeatMetricNumber}`"
								track-size="10px"
								markers
								v-model="repeatMetricNumber"
								color="indigo-10"
							></q-slider>
						</div>
						<div>
							<q-btn
								:disable="!ready"
								dense
								class="full-width"
								size="md"
								push
								color="indigo-10"
								:label="$t('check')"
								@click="check"
							></q-btn>
						</div>
						<div>
							<q-linear-progress
								:value="progress.done / progress.total"
								class="q-mt-md"
							/>
							{{ progress }}
						</div>
					</q-form>
				</div>
				<div class="col-10 row q-col-gutter-md">
					<div
						v-for="(
							{ reference: r, contrast: c, metrics }, i
						) in similarResultList"
						:key="i"
						class="col-12"
					>
						<q-card
							square
							flat
							bordered
						>
							<q-table
								dense
								hide-pagination
								square
								flat
								bordered
								separator="cell"
								:rows="[
									{ id: r.id, name: r.name, by: r.by, ...r.metric },
									{ id: c.id, name: c.name, by: c.by, ...c.metric },
								]"
							>
								<template #body-cell="props">
									<q-td
										:props="props"
										:class="{
											'bg-red-2': metrics[props.col.name as MetricName],
										}"
										>{{ props.value }}</q-td
									>
								</template>
							</q-table>
						</q-card>
					</div>
				</div>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import * as Examination from 'src/examination';

type MetricName = keyof Examination.ItemData['metric'];

interface SimilarResult {
	reference: Examination.ItemData;
	contrast: Examination.ItemData;
	metrics: Partial<Record<MetricName, true>>;
}

const repeatMetricNumber = ref<number>(6);
const sampleFile = ref<File | null>(null);
const similarResultList = ref<SimilarResult[]>([]);
const progress = ref({ done: 0, total: 1 });

const ready = computed(() => {
	return repeatMetricNumber.value >= 0 && sampleFile.value !== null;
});

async function check() {
	const MIN_REPEAT_NUMBER = repeatMetricNumber.value;
	const FILE = sampleFile.value;

	if (FILE === null) {
		return;
	}

	const result = await Examination.read(FILE);

	if (result === null) {
		return;
	}

	const dataItemList = [...result.items()];
	const length = dataItemList.length;

	similarResultList.value = [];
	progress.value.total = (length * (length - 1)) / 2;

	for (let i = 0; i < length; i++) {
		const reference = dataItemList[i]!;

		for (let j = i + 1; j < length; j++) {
			const contrast = dataItemList[j]!;
			const similarMetrics: Partial<Record<MetricName, true>> = {};

			for (const key in contrast.metric) {
				const referenceValue = reference.metric[key as MetricName];
				const contrastValue = contrast.metric[key as MetricName];

				if (referenceValue === null || contrastValue === null) {
					continue;
				}

				if (Math.abs(referenceValue - contrastValue) < 0.005) {
					similarMetrics[key as MetricName] = true;
				}
			}

			if (Object.keys(similarMetrics).length >= MIN_REPEAT_NUMBER) {
				similarResultList.value.push({
					reference,
					contrast,
					metrics: similarMetrics,
				});
			}

			progress.value.done++;
		}

		await new Promise((resolve) => setTimeout(resolve, 1));
	}
}
</script>
