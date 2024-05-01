const { Builder, By, Key, until, Cookie } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

// Define the test function using Mocha
describe('Amazon Search Test', function () {
  let driver;

  // Set up the test environment
  before(async function () {
    this.timeout(60000);
    const chromeOptions = new chrome.Options();
    // Additional Chrome options can be set here if needed

    // Create a new WebDriver instance
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    // Set Headless Mode: .setChromeOptions(new chrome.Options().headless())

    // Navigate to a lightweight page on Amazon domain
    await driver.get('https://www.amazon.com');

    // Define the cookie before opening the website
    const cookie = {
      name: 'session-token',
      value: 'jUD+OOgSHillb6iuwirr5duQEuX0sKAIjajbjQX42QZGLpsRV48M+id5J9+zbPE+MyfjE6y2z4ue5HR2T24kMZEpt6OTr1BW4rCg1skdH4bFAH9zPuPK9obZhJ/ZErpSCKME0LYSh05t6fONEiK0YMDEPl2/oyJ1ZdShAtAMHZ3tp8e/viItlRj+FYS9j6hZOZYO+wYa+kuzq7gYDtl7a8dxotSCoP83yILA4FlTLMeZUwxKe7asfxwHYPZie4olRNS3h5q9ykngrWfuhC4Xt//R213TQm2/AVrJOY4nCMZfb6NLMmVOIxxU3lSR5wGIdEighfhiYRobxQ8bKLSy6g0pw0jgakrw',
      domain: '.amazon.com',
      path: '/',
      secure: true,
      httpOnly: true,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
    };
  

    // Add the cookie to the browser
    await driver.manage().addCookie(cookie);

    // Navigate to the Amazon website which will now have the cookie set
    await driver.get('https://www.amazon.com');
  });

  // Test opening Amazon website
  it('should open the Amazon website', async function () {
    this.timeout(60000);
    try {
      // Logging for test start
      console.log('Starting the test: should open the Amazon website');

      // Introduce a delay before opening the Amazon website
      await driver.sleep(5); // .5 second delay

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
  // Logging for last page 
    console.log('Starting the test: should navigate to the last page');

  const nextButton = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "Next")]'), 30000));
  await driver.wait(until.elementIsVisible(nextButton), 30000);
  await nextButton.click();
  console.log('Navigation to the last page completed successfully');
} catch (error) {
  console.error('Error in should navigate to the last page of results:', error);
  throw error;
}
  });

 // Retrieve information from the penultimate item
 it('should retrieve information from the penultimate item', async function () {
  this.timeout(30000);
  try {
    console.log('Starting the test: should retrieve information from the penultimate item');

    // Wait for the search results to be loaded
    const items = await driver.wait(until.elementsLocated(By.css('div.s-result-item')), 30000, 'Search results did not load in time.');

    if (items.length >= 2) {
      const penultimateItem = items[items.length - 2];

    // Dynamic wait for any of the price elements to be present
      const priceElementLocated = Promise.race([
        driver.wait(until.elementLocated(By.css('span.a-price-whole')), 30000).catch(() => null),
        driver.wait(until.elementLocated(By.css('span.a-price-fraction')), 30000).catch(() => null),
        driver.wait(until.elementLocated(By.css('span.a-price-symbol')), 30000).catch(() => null)
      ]);

      let priceElement = await priceElementLocated;

    // If priceElement is found, no need to enter the retry mechanism
      if (!priceElement) {
        let attempts = 3;
        while (attempts > 0) {
          try {
            priceElement = await penultimateItem.findElement(By.css('span.a-price-whole'));
            break; // If found, break out of the loop
          } catch (error) {
            if (attempts === 1) throw error;
            await driver.sleep(1000); // Wait 1 second before retrying
            attempts--;
          }
        }
      }

      const priceWholeElement = priceElement || await penultimateItem.findElement(By.css('span.a-price-whole'));
      const priceFractionElement = await penultimateItem.findElement(By.css('span.a-price-fraction')).catch(() => null);
      const priceWhole = priceWholeElement ? await priceWholeElement.getText() : 'N/A';
      const priceFraction = priceFractionElement ? await priceFractionElement.getText() : '00';
      const priceSymbol = '$'; // Default to dollar symbol if not found
      const price = priceSymbol + priceWhole + '.' + priceFraction;

      const titleElement = await driver.wait(until.elementLocated(By.css('span.a-size-medium.a-color-base.a-text-normal')), 30000);
      await driver.wait(until.elementIsVisible(titleElement), 30000);

      const title = await titleElement.getText();

      console.log('Retrieving item information completed successfully');
      console.log('Title:', title);
      console.log('Price:', price);
    } else {
      console.error('Penultimate item not found.');
    }
  } catch (error) {
    console.error('Error in should retrieve information from the penultimate item:', error);
    throw error;
  }
});

  // Clean up after the test
  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Test Completed, WebDriver session closed');
    }
  });
});
