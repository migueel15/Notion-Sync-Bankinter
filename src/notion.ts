import { Client } from "@notionhq/client"
import dotenv from "dotenv"
import { NOTION_PROPERTIES, NotionTransaction } from "./types.js"
dotenv.config()

export const notion = new Client({
	auth: process.env.NOTION_TOKEN,
})

export async function getLastTransaction(): Promise<NotionTransaction> {
	try {
		const response = await notion.databases.query({
			database_id: process.env.NOTION_DATABASE_ID || "",
			sorts: [
				{
					property: NOTION_PROPERTIES.fecha_valor,
					direction: "descending",
				},
			],
			page_size: 1,
		})
		if (response.results.length === 0) {
			throw new Error("No pages found")
		}
		const page: any = response.results[0]

		const id = page.id
		const concepto =
			page.properties[NOTION_PROPERTIES.concepto].title[0].text.content
		const fecha_valor =
			page.properties[NOTION_PROPERTIES.fecha_valor].date.start
		const fecha_contable =
			page.properties[NOTION_PROPERTIES.fecha_contable].date.start
		const tipo = page.properties[NOTION_PROPERTIES.tipo].select.name
		const importe = page.properties[NOTION_PROPERTIES.importe].number
		const saldo = page.properties[NOTION_PROPERTIES.saldo].number

		return { id, concepto, fecha_valor, fecha_contable, tipo, importe, saldo }
	} catch (error) {
		throw new Error(error)
	}
}

const res = await getLastTransaction()
console.log(res)

export function updateNotionDatabase(transactions: Transaction[]) { }
