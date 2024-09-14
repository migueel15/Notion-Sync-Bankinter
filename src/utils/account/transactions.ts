import { Transaction, TransactionsRequest } from "../../types.js"

export async function getTransacactionsSince(start_date: string, account: any) {
	try {
		const finish_date = new Date().toISOString().split("T")[0]
		const transactions = await account.getTransactions({
			dateFrom: start_date,
			dateTo: finish_date,
		})
	} finally {
	}
}

export function formatTransactions(
	request: TransactionsRequest,
): Transaction[] {
	return request.transactions.booked
}
