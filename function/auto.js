const builder = require('./builder');
require('dotenv').config();
const {
    Builder,
    By,
    until,
    Key
} = require('selenium-webdriver');

async function chooseCountry() {
    await builder.driver.manage().window().maximize();
    await builder.driver.wait(until.elementLocated(By.id('imgUserHead')), 15000, 'Looking for element');
    await (await builder.findByName('CountryBadge')).click();
    const region = await builder.findByXpath(`//span[text()="${process.env.COUNTRY}"]`);
    return await region.click();
}

async function readLiveUrl() {
    const liveUrls = [];
    await builder.driver.wait(until.elementLocated(By.css('.nimo-rc_meta__info .controlZindex')), 15000, 'Looking for element');
    const liveElements = await builder.findByCss('.nimo-rc_meta__info .controlZindex');
    for (let live of liveElements) {
        liveUrls.push(await live.getAttribute('href'));
    }
    return await liveUrls;
}

async function openLiveInNewTab() {
    const liveUrls = await readLiveUrl();
    const originalWindow = await builder.driver.getWindowHandle();
    let i = 0;
    while (true) {
        if ((await builder.driver.getAllWindowHandles()).length < 4) {
            await builder.driver.switchTo().window(originalWindow);
            await builder.driver.switchTo().newWindow('tab');
            await builder.openUrl(liveUrls[i]);
            await checkIfLiveHasEgg();
            i++;
        }
    }
}


async function checkIfLiveHasEgg() {
    try {
        await builder.driver.wait(until.elementLocated(By.className('nimo-box-gift__box')), 3000, 'Looking for element');
        await builder.driver.executeScript(`
            function collectEgg() {
                const button = document.querySelector('.pl-icon_danmu_open');
                if (button) button.click();
                collectInterval = setInterval(function () {
                    const collectBtn = document.querySelector('.nimo-box-gift__box__btn');
                    const redEgg = document.querySelector('.interactive-gift-entry-box-wrap');
                    if (redEgg) redEgg.click();
                    let isBoxGift = document.querySelector('.nimo-room__chatroom__box-gift');
                    if (collectBtn) collectBtn.click();
                    const modal = document.querySelector('.act-interactive-gift-modal');
                    const container = document.querySelector('.gift-entries-swiper');
                    const nodeList = container.querySelectorAll('.nimo-room__chatroom__box-gift-item');
                    const nodeListToArray = [...nodeList];
                    const ifHasBoxgift = nodeListToArray.some(item => {
                        const el = item.querySelector('.nimo-box-gift') || item.querySelector('.interactive-gift-entry-box-wrap');
                        if (el) {
                            return window.getComputedStyle(el).display == 'block' || window.getComputedStyle(el).display == 'flex'
                        }
                    })
                    if (!ifHasBoxgift) window.close();
                    if (modal) {
                        const iframe = modal.querySelector('iframe');
                        if (iframe) {
                            let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (innerDoc) {
                                let joinButton = innerDoc.querySelector('.btn');
                                if (joinButton) {
                                    joinButton.click();
                                }
                            }
                        }
                    }

                }, 1);
            }
            collectEgg(); 
            `);
    } catch (error) {
        await builder.driver.close();
    }
}

module.exports = {
    chooseCountry,
    readLiveUrl,
    openLiveInNewTab
}