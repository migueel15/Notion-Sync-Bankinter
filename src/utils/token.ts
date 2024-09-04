import fs from "fs"
import path from "path"
import NordigenClient from "nordigen-node"

import { __dirname } from "./global.js"
import { TokenData, TokenDataRaw } from "../types.js"

const TOKEN_FILE_NAME = "token.json"
const TOKEN_FILE_PATH = path.join(__dirname, TOKEN_FILE_NAME)

export function saveTokenToFile({ access, access_expires, refresh, refresh_expires }: { access: string, access_expires: Date, refresh: string, refresh_expires: Date }) {
	const today = new Date()
	const token = {
		access,
		access_expires,
		refresh,
		refresh_expires
	}
	fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(token))
}

export function getTokenFromFile() {
	const token = fs.readFileSync(TOKEN_FILE_PATH, "utf-8")
	return JSON.parse(token).access
}

export function getRefreshTokenFromFile() {
	const token = fs.readFileSync(TOKEN_FILE_PATH, "utf-8")
	return JSON.parse(token).refresh
}

export function getTokenDataFromFile(): TokenData {
	const tokenDataString = fs.readFileSync(TOKEN_FILE_PATH, "utf-8")
	const tokenDataRaw: TokenDataRaw = JSON.parse(tokenDataString)
	const tokenData: TokenData = {
		...tokenDataRaw,
		access_expires: new Date(tokenDataRaw.access_expires),
		refresh_expires: new Date(tokenDataRaw.refresh_expires)
	}
	return tokenData
}

export function getExpireDateToken(): Date {
	const token = fs.readFileSync(TOKEN_FILE_PATH, "utf-8")
	return new Date(JSON.parse(token).access_expires)
}

export function getExpireDateRefreshToken(): Date {
	const token = fs.readFileSync(TOKEN_FILE_PATH, "utf-8")
	return new Date(JSON.parse(token).refresh_expires)
}

function convertTokenDataRaw(tokenDataRaw: TokenDataRaw): TokenData {
	const today = new Date()
	const tokenData: TokenData = {
		access: tokenDataRaw.access,
		access_expires: new Date(today.getTime() + tokenDataRaw.access_expires * 1000),
		refresh: tokenDataRaw.refresh,
		refresh_expires: new Date(today.getTime() + tokenDataRaw.refresh_expires * 1000)
	}
	return tokenData
}

export async function generateToken(client: NordigenClient): Promise<TokenData> {
	if (fs.existsSync(TOKEN_FILE_PATH)) {
		const today = new Date()
		const expireDateToken = getExpireDateToken()

		if (today >= expireDateToken) {
			const refreshToken = getRefreshTokenFromFile()
			if (today >= getExpireDateRefreshToken()) {
				return convertTokenDataRaw(await client.generateToken())
			} else {
				const tokenFromFile = getTokenDataFromFile()
				const refreshedToken = await client.exchangeToken({ refreshToken: refreshToken })
				const tokenData = {
					...tokenFromFile,
					access: refreshedToken.access,
					access_expires: new Date(today.getTime() + refreshedToken.access_expires * 1000)
				}
				return tokenData
			}
		} else {
			return getTokenDataFromFile()
		}
	} else {
		return convertTokenDataRaw(await client.generateToken())
	}
}
