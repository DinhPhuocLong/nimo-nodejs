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
    const driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(profile)
        .build()
    await driver.get(process.env.START_UP_LINK);
    await (await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[1]/div/div[2]/div/div[2]/button')),15000)).click();
    await (await driver.wait(until.elementLocated(By.className('nimo-area-code')), 15000, 'Looking for element')).click();
    const areacode = await driver.wait(until.elementLocated(By.xpath(`//div[text()=${process.env.COUNTRY_CODE}]`)),15000);
    await driver.executeScript("arguments[0].click();", areacode);
    const userNameInput = driver.wait(until.elementLocated(By.className('phone-number-input')), 15000, 'Looking for element');
    const passwordInput = await driver.wait(until.elementLocated(By.xpath('/html/body/div[6]/div/div[2]/div/div[2]/div/div/div[3]/div[1]/div[3]/input')),15000);
    await userNameInput.sendKeys(process.env.NIMO_USERNAME);
    await passwordInput.sendKeys(process.env.NIMO_PASSWORD);
    await driver.actions().sendKeys(Key.ENTER).perform();
    while (true) {
        await (await driver.wait(until.elementLocated(By.className('nimo-bullet-screen__gift-world-banner__open-btn')), Infinity, 'Timed out after 30 seconds', 1000)).click();
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.executeScript(`
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
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
    }
})();