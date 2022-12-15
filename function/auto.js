const builder = require('./builder');
require('dotenv').config();

const {
    Builder,
    By,
    until,
    Key
} = require('selenium-webdriver');


async function scroll() {
    let lastHeight = await builder.driver.executeScript("return document.body.scrollHeight");
    while (true) {
        await builder.driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
        let newHeight = await builder.driver.executeScript('return document.body.scrollHeight');
        lastHeight = newHeight;
        if (lastHeight >= 2000) break;
    }
}

async function chooseCountry() {
    await builder.driver.manage().window().maximize();
    await builder.driver.wait(until.elementLocated(By.id('imgUserHead')), 15000, 'Looking for element');
    await (await builder.findByName('CountryBadge')).click();
    const region = await builder.findByXpath(`//span[text()="${process.env.COUNTRY}"]`);
    return await region.click();
}

async function readLiveUrl() {
    await scroll();
    const liveUrls = [];
    await builder.driver.wait(until.elementLocated(By.css('.nimo-rc_meta__info .controlZindex')), 15000, 'Looking for element');
    const liveElements = await builder.findByCss('.nimo-rc_meta__info .controlZindex');
    for (let live of liveElements) {
        liveUrls.push(await live.getAttribute('href'));
    }
    return liveUrls;
}

async function openLiveInNewTab() {
    liveUrls = await readLiveUrl();
    const originalWindow = await builder.driver.getWindowHandle();
    let i = 0;
    while (true) {
        if ((await builder.driver.getAllWindowHandles()).length < process.env.TAB_QUANTITY) {
            await builder.driver.switchTo().window(originalWindow);
            await builder.driver.switchTo().newWindow('tab');
            await builder.openUrl(liveUrls[i]).then(res => {
                checkIfLiveHasEgg();
            })
            i++;
        }
        if (liveUrls.length == i) {
            await builder.driver.switchTo().window(originalWindow);
            await builder.driver.navigate().refresh();
            await scroll();
            liveUrls = await readLiveUrl();
            i = 0;
        }
    }
}


async function checkIfLiveHasEgg() {
    await builder.driver.executeScript(`
            function collectEgg() {
                const button = document.querySelector('.pl-icon_danmu_open');
                if (button) button.click();
                collectInterval = setInterval(function() {
                    const boxGift = document.querySelector('.nimo-box-gift__box');
                    const collectBtn = document.querySelector('.nimo-box-gift__box__btn');
                    let isBoxGift = document.querySelector('.nimo-room__chatroom__box-gift-item');
                    if (!boxGift) window.close();
                    if (collectBtn) collectBtn.click();
                    if (window.getComputedStyle(isBoxGift).display == 'none') window.close();
                }, 1);
            }
            setTimeout(collectEgg, 5000);
            `);
}

module.exports = {
    chooseCountry,
    readLiveUrl,
    openLiveInNewTab,
    scroll
}