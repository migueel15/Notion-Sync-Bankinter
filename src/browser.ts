
import { Builder, Browser, Bt, By, Key, until, } from 'selenium-webdriver';
import * as Firefox from "selenium-webdriver/firefox.js"
const { Options } = Firefox
import dotenv from "dotenv"
import { DOWNLOAD_PATH, getDateRange, waitForDownloadComplete } from './utils.js';


dotenv.config()


const fildLoginFiels = async (driver: any) => {
	const usernameInput = await driver.findElement(By.id("uid"))
	const passwordInput = await driver.findElement(By.id("password"))

	await usernameInput.sendKeys(process.env.USERNAME)
	await passwordInput.sendKeys(process.env.PASSWORD)
	await driver.sleep(500)
}

const login = async (driver: any) => {
	const form = await driver.findElement(By.id("loginForm"))
	await form.submit()

	await driver.wait(
		until.elementLocated(By.id('movimientos-cabecera')),
		10000 // Timeout de 10 segundos
	);
}

const filterDate = async (driver: any, from: Date) => {
	const searchButton = await driver.findElement(By.id("abrirCerrarBuscador"))
	searchButton.click()

	await driver.wait(
		until.elementLocated(By.id('buscador:dateFrom')),
		10000 // Timeout de 10 segundos
	);


	const desdeInput = await driver.findElement(By.id("buscador:dateFrom"))
	const hastaInput = await driver.findElement(By.id("buscador:dateTo"))

	const dateValues = getDateRange(from)
	console.log(dateValues)
	await driver.executeScript("arguments[0].setAttribute('value', arguments[1])", desdeInput, dateValues.start)
	await driver.executeScript("arguments[0].setAttribute('value', arguments[1])", hastaInput, dateValues.end)

	// const botonBuscar = await driver.findElement(By.id("buscador\:boxSearchSecondButton"))
	// botonBuscar.click()

	const formulario = await driver.findElement(By.id("buscador"))
	await formulario.findElement(By.id("buscador\:min-importe")).sendKeys(Key.ENTER)

	await driver.wait(
		until.elementLocated(By.className('icoDownload')),
		50000 // Timeout de 10 segundos
	);
}

const downloadFile = async (driver: any) => {
	const downloadButton = await driver.findElement(By.css(".icoDownload"))
	downloadButton.click()
	await waitForDownloadComplete(DOWNLOAD_PATH)
}

export const getMonthTransactions = async (from: Date) => {
	const firefoxOptions = new Options().setPreference('browser.download.folderList', 2) // Set download directory
		.setPreference('browser.download.dir', DOWNLOAD_PATH) // Specify download directory
		.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/vnd.ms-excel') // MIME type for XLS files
		.setPreference('browser.download.useDownloadDir', true) // Use the specified download directory
		.setPreference('browser.download.manager.showWhenStarting', false) // Hide the download dialog
		.setPreference('browser.download.manager.focusWhenStarting', false) // Focus on the download manager
	// .addArguments("--headless")
	let driver = await new Builder().forBrowser(Browser.FIREFOX).setFirefoxOptions(firefoxOptions).build()
	try {
		const URL = process.env.TRANSACTIONS_URL + "?INDEX_CTA=0&IND=C&TIPO=N"
		await driver.get(URL)
		const parent = await driver.findElement(By.className("modal-footer"))
		const acceptButton = await parent.findElement(By.css(":first-child"))
		acceptButton.click()

		await fildLoginFiels(driver)
		await login(driver)

		await filterDate(driver, from)
		await downloadFile(driver)

	} finally {
		driver.quit()
	}
}
