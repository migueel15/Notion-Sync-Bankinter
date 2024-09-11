import { UUID } from "crypto"
import { on } from "events"

export type DateRange = {
	start: string
	end: string
}

export type TokenDataRaw = {
	access: string
	access_expires: number
	refresh: string
	refresh_expires: number
}

export type TokenData = {
	access: string
	access_expires: Date
	refresh: string
	refresh_expires: Date
}

export type RequisitionStatus =
	| "CR"
	| "ID"
	| "LN"
	| "RJ"
	| "ER"
	| "SU"
	| "EX"
	| "GC"
	| "UA"
	| "GA"
	| "SA"

export type Requisition = {
	id: string
	created: string
	redirect: string
	status: RequisitionStatus
	institution_id: string
	agreement: string
	reference: UUID
	accounts: string[]
	user_language: string
	link: string
	ssn: string
	account_selection: boolean
	redirect_immediate: boolean
}

export type RequisitionRequest = {
	redirectUrl?: string
	institutionId?: string
	maxHistoricalDays?: number
	accessValidForDays?: number
}

export type RequisitionFetchAll = {
	count: number
	next: string
	previous: string
	results: Requisition[]
}

export type Transaction = {
	bookingDate: string
	valueDate: string
	transactionAmount: {
		amount: string
		currency: string
	}
	creditorName?: string
	creditorAccount?: {
		iban?: string
	}
	debtorName: string
	debtorAccount: {
		iban: string
	}
	remittanceInformationUnstructured: string
	internalTransactionId: string
}

export type TransactionsRequest = {
	transactions: {
		booked: Transaction[]
	}
}

export enum NOTION_PROPERTIES {
	concepto = "Concepto",
	fecha_valor = "Fecha valor",
	fecha_contable = "Fecha contable",
	tipo = "Tipo",
	importe = "Importe",
	saldo = "Saldo",
}

export type NotionTransactionType = "Tarjeta" | "Transferencia" | "Bizum"

export type NotionTransaction = {
	id: UUID
	concepto: string
	fecha_valor: string
	fecha_contable: string
	tipo: NotionTransactionType
	importe: number
	saldo?: number
}
