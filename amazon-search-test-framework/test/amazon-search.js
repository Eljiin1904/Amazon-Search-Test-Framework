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
    this.timeout(60000);
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
      console.error('Error in laptop search failed:', error);
      throw error;
    }
  });

  // Test filtering products by price
  it('should filter products by price', async function () {
    this.timeout(80000);
    try {
      // Logging for test start
      console.log('Starting the test: should filter products by price');

  // Find the price filter element and apply a specific price range.
      const dropdown = await driver.findElement(By.id("a-autoid-0-announce"));
      await dropdown.click(); // Click to open the dropdown

	 // Now that the dropdown is open, select the desired option (e.g., "Low to High") by its text.
	  const optionToSelect = await driver.findElement(By.id('s-result-sort-select_1'));
 	  await optionToSelect.click(); // Click on the desired option
 	  
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
    this.timeout(60000);
    
 try {
  const nextButton = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "Next")]'), 30000));
  await driver.wait(until.elementIsVisible(nextButton), 30000);
  await nextButton.click();
  console.log('Clicked the "Next" button');
} catch (error) {
  console.error('Error in should navigate to the last page of results:', error);
  throw error;
}
  });

 // Test getting information from the penultimate item
it('should retrieve information from the penultimate item', async function () {
  this.timeout(60000);
  try {
    // Logging for test start
    console.log('Starting the test: should retrieve information from the penultimate item');

    // Locate all items on the page
    const items = await driver.findElements(By.css('div.s-result-item'));

    if (items.length >= 2) {
      // Get the penultimate item
      const penultimateItem = items[items.length - 2];

      // Find the title and price elements inside the penultimate item
      const titleElement = await penultimateItem.findElement(By.css('span.a-size-medium.a-color-base.a-text-normal'));
      const priceWholeElement = await penultimateItem.findElement(By.css('span.a-price-whole'));
      const priceFractionElement = await penultimateItem.findElement(By.css('span.a-price-fraction'));

      // Retrieve text for title, price whole, and price fraction
      const title = await titleElement.getText();
      const priceWhole = await priceWholeElement.getText();
      const priceFraction = await priceFractionElement.getText();
      const price = priceWhole + '.' + priceFraction;

      // Log success and the retrieved title and price
      console.log('Retrieving item information completed successfully');
      console.log('Title:', title);
      console.log('Price:', price);
    } else {
      console.error('Penultimate item not found.');
      // Handle the case when the penultimate item is not found
    }
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
