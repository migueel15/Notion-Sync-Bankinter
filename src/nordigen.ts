import { randomUUID } from "crypto";
import { getTokenFromFile, saveTokenToFile } from "./utils/token.js"
import { getRequisitionFromFile, saveRequisitionToFile } from "./utils/requisition.js";

export async function getNordigenBankList(country: string) {
	const BANK_LIST_NORDIGEN_ENDPOINT = `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${country}`
	const response = await fetch(BANK_LIST_NORDIGEN_ENDPOINT, {
		headers: {
			"Authorization": `Bearer ${await getTokenFromFile()}`
		}
	})
	const resJson = await response.json()
	return resJson
}

export async function getNordigenBankByName(country: string, bankName: string) {
	const BANK_LIST_NORDIGEN_ENDPOINT = `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${country}`
	const response = await fetch(BANK_LIST_NORDIGEN_ENDPOINT, {
		headers: {
			"Authorization": `Bearer ${await getTokenFromFile()}`
		}
	})
	const resJson = await response.json()
	const filter = resJson.find((bank: any) => bank.name.toUpperCase() === bankName.toUpperCase())

	if (!filter) {
		return "Bank not found"
	}
	return filter.id
}

export async function getNordigenAgreements({ bankId, maxHistoricalDays = 90, accesValidDays = 90, acces_scope = ["balances", "details", "transactions"] }: { bankId: string, maxHistoricalDays?: number, accesValidDays?: number, acces_scope?: string[] }) {
	const AGREEMENTS_NORDIGEN_ENDPOINT = "https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/"
	const body = JSON.stringify({
		"institution_id": bankId,
		"max_historical_days": maxHistoricalDays,
		"access_valid_for_days": accesValidDays,
		"access_scope": acces_scope
	})

	const response = await fetch(AGREEMENTS_NORDIGEN_ENDPOINT, {
		method: "POST",
		headers: {
			"accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${await getTokenFromFile()}`
		},
		body: body
	})

	const resJson = await response.json()
	if (resJson.error) {
		console.log(resJson)
		return "Error getting agreements"
	} else {
		return resJson.id
	}
}

export async function getNordigenRequisitions({ bankId, redirectURL, agreementId, user_language = "ES" }: { bankId: string, redirectURL: string, agreementId: string, user_language?: string }) {
	const REQUISITIONS_NORDIGEN_ENDPOINT = "https://bankaccountdata.gocardless.com/api/v2/requisitions/"
	const body = JSON.stringify({
		"institution_id": bankId,
		"redirect": redirectURL,
		"agreement": agreementId,
		"user_language": user_language,
		"reference": randomUUID()
	})

	const response = await fetch(REQUISITIONS_NORDIGEN_ENDPOINT, {
		method: "POST",
		headers: {
			"accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${await getTokenFromFile()}`
		},
		body: body
	})

	const resJson = await response.json()
	if (resJson.error) {
		console.log(resJson)
		return "Error getting requisitions"
	} else {
		saveRequisitionToFile(resJson.id)
		return resJson
	}
}

export async function getBankAccounts() {
	const res = await fetch("https://bankaccountdata.gocardless.com/api/v2/requisitions/" + getRequisitionFromFile(), {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${getTokenFromFile()}`
		}
	})

	const resJson = await res.json()
	return resJson.accounts[0]
}

export async function getTransactions(account_id: string) {
	const res = await fetch("https://bankaccountdata.gocardless.com/api/v2/accounts/" + account_id + "/transactions", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${getTokenFromFile()}`
		}
	})

	const resJson = await res.json()
	return resJson
}
