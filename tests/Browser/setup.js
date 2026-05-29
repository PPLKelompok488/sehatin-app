import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver';

export async function createDriver() {
    console.log('Starting Selenium WebDriver...');
    const options = new chrome.Options();
    
    if (process.argv.includes('--headless')) {
        console.log('Running in headless mode');
        options.addArguments('--headless=new');
    }

    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--remote-allow-origins=*');

    try {
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        console.log('WebDriver started successfully');
        return driver;
    } catch (error) {
        console.error('Failed to start WebDriver:', error);
        throw error;
    }
}

export const BASE_URL = process.env.APP_URL || 'http://localhost:8000';
