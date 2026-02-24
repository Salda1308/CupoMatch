import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';

async function run() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Listen for console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    console.log("Navigating to http://127.0.0.1:3000 ...");
    await page.goto('http://127.0.0.1:3000');
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Typing login info...");
    await page.type('#codigo', '2023001');
    await page.type('#telefono', '3101234567');
    await page.click('#loginForm button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: '/home/mauro/.gemini/antigravity/brain/b589f916-2144-4f4b-a333-658167b8fc4d/final_login_127.png' });
    console.log("Screenshot taken.");
    await browser.close();
}
run();
