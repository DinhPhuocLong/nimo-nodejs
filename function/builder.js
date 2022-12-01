const {Builder, By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 
let options = new chrome.Options();
options.addArguments("start-maximized");
options.addArguments("--js-flags=--expose-gc");
options.addArguments("--enable-precise-memory-info");
options.addArguments("--disable-popup-blocking");
options.addArguments("--disable-default-apps");
options.addArguments("--disable-infobars");
// options.addArguments('--no-startup-window');
// options.setExperimentOption("excludeSwitches")

module.exports = {
    builder: function() {
        this.driver = new Builder()
        .forBrowser('firefox')
        .build();
        this.destroyDriver = async function() {
            return await this.driver.quit();
        }
        this.openUrl = async function(url) {
            return await this.driver.get(url);
        }
        this.findByXpath = async function(xpath) {
            await this.driver.wait(until.elementLocated(By.xpath(xpath)),15000);
            return  this.driver.findElement(By.xpath(xpath));
        }
        this.findById = async function (id) {
            await this.driver.wait(until.elementLocated(By.id(id)), 15000, 'Looking for element');
            return await this.driver.findElement(By.id(id));
        }
        this.findByName = async function(name) {
            await this.driver.wait(until.elementLocated(By.className(name)), 15000, 'Looking for element');
            return await this.driver.findElement(By.className(name))
        };
        this.findListElementByName = async function(name) {
            await this.driver.wait(until.elementLocated(By.className(name)), 15000, 'Looking for element');
            return await this.driver.findElements(By.className(name))
        };
        this.findByCss = async function(css) {
            return await this.driver.findElements(By.css(css));
        }
        this.write = async function (element, text) {
            return await element.sendKeys(text);
        };
        this.sendEnter = async function() {
            return await this.driver.actions().sendKeys(Key.ENTER).perform();
        }
        this.sendTab = async function() {
            return await this.driver.actions().sendKeys(Key.TAB).perform();
        }
    }
    
}