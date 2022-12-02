require('dotenv').config();
const {
    Builder,
    By,
    until,
    Key
} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let profile = new firefox.Options();
profile.setPreference('browser.download.folderList', 1);
profile.setPreference('browser.download.manager.showWhenStarting', false);
profile.setPreference('browser.download.manager.focusWhenStarting', false);
profile.setPreference('browser.download.useDownloadDir', true);
profile.setPreference('browser.helperApps.alwaysAsk.force', false);
profile.setPreference('browser.download.manager.alertOnEXEOpen', false);
profile.setPreference('browser.download.manager.closeWhenDone', true);
profile.setPreference('browser.download.manager.showAlertOnComplete', false);
profile.setPreference('browser.download.manager.useWindow', false);
profile.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/octet-stream');
profile.setPreference('permissions.default.stylesheet', 2);
profile.setPreference('permissions.default.image', 2);
profile.setPreference('allow_scripts_to_close_windows', true);
profile.setPreference('dom.allow_scripts_to_close_windows', true);
profile.setPreference('dom.ipc.plugins.enabled.libflashplayer.so', false);
profile.setPreference("network.http.pipelining", true);
profile.setPreference("network.http.proxy.pipelining", true);
profile.setPreference("network.http.pipelining.maxrequests", 8);
profile.setPreference("content.notify.interval", 500000);
profile.setPreference("content.notify.ontimer", true);
profile.setPreference("content.switch.threshold", 250000);
profile.setPreference("browser.cache.memory.capacity", 65536);
profile.setPreference("browser.startup.homepage", "about:blank");
profile.setPreference("reader.parse-on-load.enabled", false) ;
profile.setPreference("browser.pocket.enabled", false);
profile.setPreference("loop.enabled", false);
profile.setPreference("browser.chrome.toolbar_style", 1);
profile.setPreference("browser.display.show_image_placeholders", false) ;
profile.setPreference("browser.display.use_document_colors", false);
profile.setPreference("browser.display.use_document_fonts", 0);
profile.setPreference("browser.display.use_system_colors", true);
profile.setPreference("browser.formfill.enable", false) ;
profile.setPreference("browser.helperApps.deleteTempFileOnExit", true) ;
profile.setPreference("browser.shell.checkDefaultBrowser", false);
profile.setPreference("browser.startup.homepage", "about:blank");
profile.setPreference("browser.startup.page", 0)  ;
profile.setPreference("browser.tabs.forceHide", true) ;
profile.setPreference("browser.urlbar.autoFill", false) ;
profile.setPreference("browser.urlbar.autocomplete.enabled", false) ;
profile.setPreference("browser.urlbar.showPopup", false) ;
profile.setPreference("browser.urlbar.showSearch", false) ;
profile.setPreference("extensions.checkCompatibility", false)  ;
profile.setPreference("extensions.checkUpdateSecurity", false);
profile.setPreference("extensions.update.autoUpdateEnabled", false);
profile.setPreference("extensions.update.enabled", false);
profile.setPreference("general.startup.browser", false);
profile.setPreference("plugin.default_plugin_disabled", false);
profile.setPreference("permissions.default.image", 2) ;


(async () => {
    this.driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(profile)
        .build()
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
        this.sendTab = async function() {
            return await this.driver.actions().sendKeys(Key.TAB).perform();
        };
        this.sendEnter = async function() {
            return await this.driver.actions().sendKeys(Key.ENTER).perform();
        }
    await this.driver.get(process.env.START_UP_LINK);
    await(await this.findByXpath('/html/body/div[2]/div[1]/div/div[2]/div/div[2]/button')).click();
    await(await this.findByName('nimo-area-code')).click();
    const areacode = await this.findByXpath(`//div[text()=${process.env.COUNTRY_CODE}]`);
    await this.driver.executeScript("arguments[0].click();", areacode);
    const userNameInput = await this.findByName('phone-number-input');
    const passwordInput = await this.findByXpath('/html/body/div[10]/div/div[2]/div/div[2]/div/div/div[3]/div[1]/div[3]/input');
    await this.write(userNameInput, process.env.NIMO_USERNAME);
    await this.write(passwordInput, process.env.NIMO_PASSWORD);
    await this.sendEnter();
    while (true) {
        const redEgg = await this.driver.wait(until.elementLocated(By.className('nimo-bullet-screen__gift-world-banner__open-btn')), Infinity, 'Timed out after 30 seconds', 1000);
        await redEgg.click();
        await this.driver.switchTo().window((await this.driver.getAllWindowHandles())[1]);
        await this.driver.executeScript(`
        setInterval(() => {
            const modal = document.querySelector('.act-interactive-gift-modal');
            if (modal) {
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                    let joinButton = innerDoc.querySelector('.btn');
                    joinButton.click();
                    window.close();
                }
            } else {
                window.close();
            }
        }, 1000);
        `)
        await this.driver.switchTo().window((await this.driver.getAllWindowHandles())[0]);
        await this.driver.wait(until.stalenessOf(redEgg));
    }
})();