const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

// Define the test function using Mocha
describe('Amazon Search Test', function () {
  let driver;

  // Set up the test environment
  before(async function () {
    // Timeout variable
    this.timeout(60000);

    // Create a new WebDriver instance with Chrome in headless mode
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  // Test opening Amazon website
  it('should open the Amazon website', async function () {
    this.timeout(60000);
    try {
      // Logging for test start
      console.log('Starting the test: should open the Amazon website');

      // Open Chrome browser and go to Amazon
      await driver.get('https://www.amazon.com');

      // Log success
      console.log('Amazon website loaded successfully');
    } catch (error) {
      // Log any errors
      console.error('Error in should open the Amazon website:', error);
      throw error;
    }
  });

  // Test searching for a laptop
  it('should search for a laptop', async function () {
    this.timeout(20000);
    try {
      // Logging for test start
      console.log('Starting the test: should search for a laptop');

      // Locate the search input element, enter a search query, and submit the search.
      const searchInput = await driver.findElement(By.id('twotabsearchtextbox'));
      await searchInput.sendKeys('laptop', Key.RETURN);

      // Log success
      console.log('Laptop search completed successfully');
    } catch (error) {
      // Log any errors
      console.error('Error in should search for a product:', error);
      throw error;
    }
  });

  // Test filtering products by price
  it('should filter products by price', async function () {
    this.timeout(20000);
    try {
      // Logging for test start
      console.log('Starting the test: should filter products by price');

      // Find the price filter element and apply a specific price range.
      const priceFilter = await driver.findElement(By.id('price-filter'));
      await priceFilter.sendKeys('Min Price: $500', Key.RETURN);

      // Log success
      console.log('Filtering products by price completed successfully');
    } catch (error) {
      // Log any errors
      console.error('Error in should filter products by price:', error);
      throw error;
    }
  });

  // Test navigating to the last page
  it('should navigate to the last page of results', async function () {
    this.timeout(20000);
    try {
      // Logging for test start
      console.log('Starting the test: should navigate to the last page of results');

      // Navigate to the last page of results by clicking the "Next" button repeatedly.
      const nextButton = await driver.findElement(By.id('next-button'));
      while (await nextButton.isEnabled()) {
        await nextButton.click();
      }

      // Log success
      console.log('Navigating to the last page completed successfully');
    } catch (error) {
      // Log any errors
      console.error('Error in should navigate to the last page of results:', error);
      throw error;
    }
  });

  // Test getting information from the penultimate item
  it('should retrieve information from the penultimate item', async function () {
    this.timeout(20000);
    try {
      // Logging for test start
      console.log('Starting the test: should retrieve information from the penultimate item');

      // Retrieve information from the penultimate item, e.g., its title and price.
      const penultimateItem = await driver.findElement(By.css('.results .item:nth-last-child(2)'));
      const title = await penultimateItem.findElement(By.css('.title')).getText();
      const price = await penultimateItem.findElement(By.css('.price')).getText();

      // Log success
      console.log('Retrieving item information completed successfully');
    } catch (error) {
      // Log any errors
      console.error('Error in should retrieve information from the penultimate item:', error);
      throw error;
    }
  });

  // Clean up after the test
  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('WebDriver session closed');
    }
  });
});
