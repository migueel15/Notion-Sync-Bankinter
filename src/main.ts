import { randomUUID } from "crypto";
import { generateToken, getExpireDateRefreshToken, getExpireDateToken, getTokenDataFromFile, getTokenFromFile, saveTokenToFile } from "./utils/token.js"
import { dateDifferenceInDays, REQUISITION_PATH, waitForUserInput } from "./utils/global.js"
import fs from "fs"

import NordigenClient from "nordigen-node"
import { Requisition } from "./types.js";
import { __dirname } from "./utils/global.js";
import { createRequisition, getAllRequisitions, getRequisitionById, getRequisitionFromFile, getRequisitionStatus, obtainRequisition, saveRequisitionToFile } from "./utils/requisition.js";

const client = new NordigenClient({
	secretId: process.env.NORDIGEN_SECRET_ID,
	secretKey: process.env.NORDIGEN_SECRET_KEY
});

const tokenData = await generateToken(client)
saveTokenToFile(tokenData)

client.token = getTokenFromFile()

let requisition = await obtainRequisition(client)

if (requisition === null) {
	requisition = await createRequisition({}, client)
}
if (getRequisitionStatus(requisition) === "CR") {
	console.log("Please validate the requisition in the following link:")
	console.log(requisition.link)
	await waitForUserInput("Press any key to continue...")
}
console.log("Requisition status: ", getRequisitionStatus(requisition))

const accountId = requisition.accounts[0]
const account = await client.account(accountId)
const transactions = await account.getTransactions()
console.log(transactions)
// //
fs.writeFileSync(__dirname + "/transactions.json", JSON.stringify(transactions))


