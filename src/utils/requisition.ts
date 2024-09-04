import NordigenClient from "nordigen-node"
import { Requisition, RequisitionRequest, RequisitionStatus, RequisitionFetchAll } from "../types.js"
import fs from "fs"
import { randomUUID } from "crypto"
import { REQUISITION_PATH } from "./global.js"

export function saveRequisitionToFile(requisition: Requisition) {
	fs.writeFileSync(REQUISITION_PATH, JSON.stringify(requisition))
}

export function getRequisitionFromFile(): Requisition {
	const requisition = fs.readFileSync(REQUISITION_PATH, "utf-8")
	return JSON.parse(requisition)
}

export async function createRequisition(requisitionRequest: RequisitionRequest, client: NordigenClient): Promise<Requisition> {

	const currentRequisitions = await getAllRequisitions(client)
	for (const req of currentRequisitions.results) {
		await client.requisition.deleteRequisition(req.id)
	}

	const session: Requisition = await client.initSession({
		...requisitionRequest,
		redirectUrl: requisitionRequest.redirectUrl || "https://www.google.com",
		institutionId: requisitionRequest.institutionId || "BANKINTER_BKBKESMM",
		referenceId: randomUUID(),
		userLanguage: "es",
	})
	await client.agreement.acceptAgreement(session.agreement)

	return session
}

export async function getRequisitionById(requisition: Requisition, client: NordigenClient): Promise<Requisition> {
	return await client.requisition.getRequisitionById(requisition.id)
}

export async function getAllRequisitions(client: NordigenClient): Promise<RequisitionFetchAll> {
	return await client.requisition.getRequisitions()
}

export async function obtainRequisition(client: NordigenClient): Promise<Requisition | null> {
	const requisitions = await getAllRequisitions(client)
	if (requisitions.count === 0) {
		return null
	} else {
		const requisition: Requisition = requisitions.results[0]
		if (requisition.status === "EX") {
			return null
		}
		saveRequisitionToFile(requisition)
		return requisition
	}
}

export function getRequisitionStatus(requisition: Requisition): RequisitionStatus {
	return requisition.status
}
