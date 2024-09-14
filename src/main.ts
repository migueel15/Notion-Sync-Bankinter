import NordigenClient from "nordigen-node"
import {
	generateToken,
	getTokenFromFile,
	saveTokenToFile,
} from "./utils/token.js"
import { sleep } from "./utils/global.js"
import {
	createRequisition,
	getRequisitionStatus,
	obtainRequisition,
} from "./utils/requisition.js"

import fs from "fs"
import { __dirname } from "./utils/global.js"
import { sendMail } from "./mail.js"
import { getLastTransaction } from "./notion.js"
import { formatTransactions } from "./utils/account/transactions.js"

const client = new NordigenClient({
	secretId: process.env.NORDIGEN_SECRET_ID,
	secretKey: process.env.NORDIGEN_SECRET_KEY,
})

const tokenData = await generateToken(client)
saveTokenToFile(tokenData)

client.token = getTokenFromFile()

let requisition = await obtainRequisition(client)

if (requisition === null) {
	requisition = await createRequisition({}, client)
}
if (getRequisitionStatus(requisition) === "CR") {
	sendMail(requisition.link)
	while (getRequisitionStatus(requisition) === "CR") {
		sleep(10000)
	}
}
console.log("Requisition status: ", getRequisitionStatus(requisition))

const lastTransactionRegistered = await getLastTransaction()
const start_date = lastTransactionRegistered.fecha_valor

const accountId = requisition.accounts[0]
const account = await client.account(accountId)

try {
	const finish_date = new Date().toISOString().split("T")[0]
	const transactionsRequest = await account.getTransactions({
		dateFrom: start_date,
		dateTo: finish_date,
	})
	const transactions = formatTransactions(transactionsRequest)

	fs.writeFileSync(
		__dirname + "/transactions.json",
		JSON.stringify(transactionsRequest),
	)
} catch (error) {
	throw new Error(error)
}
