import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs"
import path from "path"

// Obtener el equivalente a `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), "..");

export const DOWNLOAD_PATH = path.join(__dirname, "excel/")

export type Transaction = {
	fecha_contable: string,
	fecha_valor: string,
	concepto: string,
	importe: number,
	saldo: number,
	tipo: string
}

export type DateRange = {
	start: string;
	end: string;
}

function formatDate(date: Date): string {
	// Extract the day, month, and year from the Date object
	const day: number = date.getDate();
	const month: number = date.getMonth() + 1; // Months are zero-based, so add 1
	const year: number = date.getFullYear();

	// Format day and month as two-digit numbers
	const dayFormatted: string = day < 10 ? `0${day}` : `${day}`;
	const monthFormatted: string = month < 10 ? `0${month}` : `${month}`;

	// Return the formatted date string
	return `${dayFormatted}/${monthFormatted}/${year}`;
}

export function getDateRange(from: Date): DateRange {
	const today = new Date()
	return {
		start: formatDate(from),
		end: formatDate(today)
	}
}

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForDownloadComplete(folderPath: string) {
	// await for a file in the path
	while (fs.readdirSync(folderPath).length === 0 || fs.readdirSync(folderPath).some(file => file.endsWith(".part"))) {
		await sleep(100)
	}
}

export function createFolderIfNotExists(folderPath: string) {
	if (!fs.existsSync(folderPath)) {
		console.log(`Creating folder ${folderPath}`)
		fs.mkdirSync(folderPath)
	}
}
