import xlsx from "node-xlsx"
import fs from "fs"
import { sleep, Transaction } from "./utils.js"

const asignType = (concepto: string): string => {
	concepto = concepto.toUpperCase() || ""
	if (concepto.includes("BIZUM")) {
		return "Bizum"
	}
	if (concepto.includes("TRANS")) {
		return "Transferencia"
	}
	return "Tarjeta"
}

export async function decodeXls(folderPath: string): Promise<Transaction[]> {
	// await for a file in the path
	while (fs.readdirSync(folderPath).length === 0 || fs.readdirSync(folderPath)[0].includes("part")) {
		await sleep(200)
	}
	// get file in folderPath
	let file = ""
	fs.readdirSync(folderPath).forEach(f => {
		file = f
	})
	let transactions = []
	const workSheetsFromFile = xlsx.parse(folderPath + file)
	const array = workSheetsFromFile[0].data
	array.forEach((row, index) => {
		if (index > 3) {
			transactions.push({
				fecha_contable: row[0],
				fecha_valor: row[1],
				concepto: row[2],
				importe: row[3],
				saldo: row[4],
				tipo: asignType(row[2])
			})
		}
	})
	//delete file
	fs.unlinkSync(folderPath + file)
	return transactions
}
