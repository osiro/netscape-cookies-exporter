#!/usr/bin/env node

process.on("SIGINT", () => process.exit(1));
process.on("SIGTERM", () => process.exit(1));

import { Command } from "commander";
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import inquirer from "inquirer";

const program = new Command();

program
  .option("-u, --url <full path url>", "The URL to get the cookies from.")
  .option("-o, --output <path>", "Absolute path to export the cookies.")
  .option(
    "-r, --resolution <HeightxWidth>",
    "Height and Width of the screen in pixels.",
    "1280x800"
  )
  .option(
    "-ua, --userAgent <name>",
    "Custom user-agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36."
  )
  .parse(process.argv);

const options = program.opts();
const url = options.url as string;
const cookiesFilePath = options.output as string;
const screenResolution = options.resolution as string;
const height = screenResolution.split("x")[1];
const width = screenResolution.split("x")[0];
const userAgent = options.userAgent as string;
const questions = [
  {
    type: "confirm",
    name: "getCookies",
    message: "Do you wish to close the browser and extract the cookies now?",
  },
];

function buildCookiesData(
  cookies: puppeteer.Protocol.Network.Cookie[]
): string {
  let data =
    "# Netscape HTTP Cookie File\n# This was generated by https://github.com/osiro/netscape-cookies-exporter. Do not edit.\n\n";

  for (const cookie of cookies) {
    data += `${cookie.domain}\tTRUE\t${cookie.path}\t${String(
      cookie.secure
    )}\t${cookie.expires}\t${cookie.name}\t${cookie.value}\n`;
  }

  return data;
}

async function buildCookiesTxtAsync(
  cookies: puppeteer.Protocol.Network.Cookie[]
): Promise<void> {
  const cookiesNetscapeFormat = buildCookiesData(cookies);
  await fs.writeFile(cookiesFilePath, cookiesNetscapeFormat);
  console.info(`Successfully written cookies to ${cookiesFilePath}`);
}

function captureCookiesNow(browser: puppeteer.Browser, page: puppeteer.Page) {
  inquirer
    .prompt(questions)
    .then(async (answers) => {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      if (answers.getCookies) {
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */

        return getCookiesAsync(browser, page);
      } else {
        return captureCookiesNow(browser, page);
      }
    })
    .catch((err) => {
      console.error("Something went wrong.");
      console.error(err);
      process.exit(2);
    });
}

async function getCookiesAsync(
  browser: puppeteer.Browser,
  page: puppeteer.Page
): Promise<void> {
  try {
    const cookies = await page.cookies();
    await buildCookiesTxtAsync(cookies);
    return browser.close();
  } catch (err) {
    process.exit(2);
  }
}

async function mainAsync(): Promise<void> {
  const browser = await puppeteer.launch({ headless: false });
  const pages = await browser.pages();
  const page = pages[0];
  await page.setUserAgent(userAgent);
  await page.setViewport({ width: parseInt(width), height: parseInt(height) });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
  return captureCookiesNow(browser, page);
}

Promise.resolve()
  .then(() => {
    return mainAsync();
  })
  .catch((err: Error) => {
    console.error("Something went wrong.");
    console.error(err.message);
    process.exit(2);
  });
