const { Builder, By, Key, until } = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();

driver.get('https://www.google.com')
  .then(() => driver.getTitle())
  .then(title => {
    if (title === 'Google') {
      console.log('Test passed: Google homepage opened successfully.');
    } else {
      console.error('Test failed: Unable to open Google homepage.');
    }
  })
  .catch(error => {
    console.error('Error occurred:', error);
    console.log('Error Message Here.');
  })
  .finally(() => driver.quit());
