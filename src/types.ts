import { UUID } from "crypto"

export type DateRange = {
	start: string;
	end: string;
}

export type TokenDataRaw = {
	access: string,
	access_expires: number,
	refresh: string,
	refresh_expires: number
}

export type TokenData = {
	access: string,
	access_expires: Date,
	refresh: string,
	refresh_expires: Date
}

export type RequisitionStatus = "CR" | "ID" | "LN" | "RJ" | "ER" | "SU" | "EX" | "GC" | "UA" | "GA" | "SA"

export type Requisition = {
	id: string,
	created: string,
	redirect: string,
	status: RequisitionStatus,
	institution_id: string,
	agreement: string,
	reference: UUID,
	accounts: string[],
	user_language: string,
	link: string,
	ssn: string,
	account_selection: boolean,
	redirect_immediate: boolean
}

export type RequisitionRequest = {
	redirectUrl?: string,
	institutionId?: string,
	maxHistoricalDays?: number,
	accessValidForDays?: number,
}

export type RequisitionFetchAll = {
	count: number,
	next: string,
	previous: string,
	results: Requisition[]
}

export type Transaction = {
	"bookingDate": string,
	"valueDate": string,
	"transactionAmount": {
		"amount": string,
		"currency": string
	},
	"creditorName"?: string,
	"creditorAccount"?: {
		"iban"?: string
	},
	"debtorName": string,
	"debtorAccount": {
		"iban": string
	},
	"remittanceInformationUnstructured": string,
	"internalTransactionId": string

}

export type TransactionsRequest = {
	"transactions": {
		"booked": Transaction[]
	}

}
