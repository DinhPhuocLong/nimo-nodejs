require('dotenv').config();
const builder = require('./function/builder');
builder.builder();
builder.openUrl('https://www.nimo.tv/lives');
const {
    chooseCountry,
    readLiveUrl,
    openLiveInNewTab,
    scroll
} = require('./function/auto');

(async function () {
    await(await builder.findByXpath('/html/body/div[2]/div[1]/div/div[2]/div/div[2]/button')).click();
    await(await builder.findByName('nimo-area-code')).click();
    const areacode = await builder.findByXpath(`//div[text()=${process.env.COUNTRY_CODE}]`);
    await builder.driver.executeScript("arguments[0].click();", areacode);
    const userNameInput = await builder.findByName('phone-number-input');
    const passwordInput = await builder.findByXpath('/html/body/div[6]/div/div[2]/div/div[2]/div/div/div[3]/div[1]/div[3]/input');
    await builder.write(userNameInput, process.env.NIMO_USERNAME);
    await builder.write(passwordInput, process.env.NIMO_PASSWORD);
    await builder.sendEnter();
    await chooseCountry();
    await openLiveInNewTab();
})();