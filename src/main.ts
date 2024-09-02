import { Builder, Browser, Bt, By, Key, until } from 'selenium-webdriver';

import { getMonthTransactions } from "./browser.js";
import { decodeXls } from './decoder.js';
import { createFolderIfNotExists, DOWNLOAD_PATH } from './utils.js';

createFolderIfNotExists(DOWNLOAD_PATH)
await getMonthTransactions() // descarga xls
//
const transactions = await decodeXls(DOWNLOAD_PATH)
console.log(transactions)
