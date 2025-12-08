import * as XLSX from 'xlsx';

function toRenderValue(raw: string) {
	if (raw === '男') {
		return 1;
	}

	if (raw === '女') {
		return 2;
	}

	return 0;
}

function toNumberValue(raw: string) {
	if (raw) {
		return Number(raw);
	}

	return null;
}

export async function read(file: File) {
	const workbook = XLSX.read(await file.arrayBuffer());
	const [headSheetName] = workbook.SheetNames;

	if (headSheetName === undefined) {
		return null;
	}

	const worksheet = workbook.Sheets[headSheetName]!;
	const [, ...dataRows] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

	return {
		items: function *items(): Generator<ItemData> {
			for (const row of dataRows as string[][]) {
				yield {
					name: row[0]!,
					render: toRenderValue(row[1]!),
					id: row[2]!,
					at: new Date(row[3]!),
					by: row[4]!,
					metric: {
						HGB: toNumberValue(row[5]!),
						PLT: toNumberValue(row[6]!),
						WBC: toNumberValue(row[7]!),
						'NEUT#': toNumberValue(row[8]!),
						'LYMPH#': toNumberValue(row[9]!),
						'MID#': toNumberValue(row[10]!),
						HbA1c: toNumberValue(row[11]!),
						ALT: toNumberValue(row[12]!),
						AST: toNumberValue(row[13]!),
						TBIL: toNumberValue(row[14]!),
						Cr: toNumberValue(row[15]!),
						BUN: toNumberValue(row[16]!),
						TC: toNumberValue(row[17]!),
						TG: toNumberValue(row[18]!),
						'LDL-C': toNumberValue(row[19]!),
						'HDL-C': toNumberValue(row[20]!),
					},
				};
			}
		},
	};
}

type ItemValue = number | null;

export interface ItemData {
	name: string;
	render: 0 | 1 | 2;
	id: string;
	at: Date;
	by: string;
	metric: {
		HGB: ItemValue;
		PLT: ItemValue;
		WBC: ItemValue;
		'NEUT#': ItemValue;
		'LYMPH#': ItemValue;
		'MID#': ItemValue;
		HbA1c: ItemValue;
		ALT: ItemValue;
		AST: ItemValue;
		TBIL: ItemValue;
		Cr: ItemValue;
		BUN: ItemValue;
		TC: ItemValue;
		TG: ItemValue;
		'LDL-C': ItemValue;
		'HDL-C': ItemValue;
	};
}
