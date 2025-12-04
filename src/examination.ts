import * as XLSX from 'xlsx';

export async function read(file: File) {
	const workbook = XLSX.read(await file.arrayBuffer());

	return workbook;
}

type ItemValue = number | null;

export interface ItemData {
	name: string;
	render: 0 | 1 | null;
	id: string;
	at: Date;
	by: string;
	metric: {
		'HGB': ItemValue;
		'PLT': ItemValue;
		'WBC': ItemValue;
		'NEUT#': ItemValue;
		'LYMPH#': ItemValue;
		'MID#': ItemValue;
		'HbA1c': ItemValue;
		'ALT': ItemValue;
		'AST': ItemValue;
		'TBIL': ItemValue;
		'Cr': ItemValue;
		'BUN': ItemValue;
		'TC': ItemValue;
		'TG': ItemValue;
		'LDL-C': ItemValue;
		'HDL-C': ItemValue;
	}
}
