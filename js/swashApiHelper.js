import {communityHelper} from "./communityHelper.js";
import {storageHelper} from "./storageHelper.js";
import {configManager} from "./configManager.js";

let swashApiHelper = (function () {
    let APIConfigManager;
    function init() {
		APIConfigManager = configManager.getConfig('swashAPI');		
    }

    async function isJoinedSwash() {
        const url = APIConfigManager.endpoint + APIConfigManager.APIList.join
        const req = {
            method: 'GET',
            headers: {
                'Authorization': "Bearer ".concat(communityHelper.generateJWT())
            },
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                let user_id = (await resp.json()).id;
                await updateUserId(user_id);
                return true;
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        return false;
    }

    function joinSwash() {
        browser.tabs.create({
            url: 'https://swashapp.io/join?token='.concat(communityHelper.generateJWT())
        });
    }

    async function getReferralRewards() {
        const url = APIConfigManager.endpoint + APIConfigManager.APIList.reward
        const req = {
            method: 'GET',
            headers: {
                'Authorization': "Bearer ".concat(communityHelper.generateJWT())
            },
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                const programs = (await resp.json());
                let total = 0;
                for (const program of programs){
                    if (program.Reward)
                        total += program.Reward;
                }
                return total;
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        return 0;
    }

    async function sendSponsoredWithdraw(recipient) {
        try {
            const signature = communityHelper.getSignCheckForSponsorWithdraw(recipient);
            const url = APIConfigManager.endpoint + APIConfigManager.APIList.withdraw
            const req = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(communityHelper.generateJWT())
                },
                body: JSON.stringify({recipient: recipient, signature: signature})
            }
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                return true;
            } else return resp.body.message;
        } catch (err) {
            console.error(`Error message: ${err.message}`)
            return err.message;
        }
    }

    async function ip2Location() {
        const url = 'https://ipapi.co/json'
        const req = {
            method: 'GET'
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                return (await resp.json())['country_name'];
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        throw new Error('Unable to fetch ip2location');
    }

    async function getDataEthPairPrice() {
        const url = 'https://api.binance.com/api/v3/ticker/price?symbol=DATAETH'
        const req = {
            method: 'GET'
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                let data = (await resp.json());
                return data['price'];
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        throw new Error('Unable to fetch ip2location');
    }

    async function getUserId() {
        let profile = await storageHelper.retrieveProfile();
        if (profile.user_id)
            return profile.user_id;
        return -1;
    }

    async function updateUserId(user_id) {
        let profile = await storageHelper.retrieveProfile();
        if (profile.user_id == null || profile.user_id !== user_id) {
            profile.user_id = user_id;
            await storageHelper.updateProfile(profile);
        }
    }

    async function getUserCountry() {
        let profile = await storageHelper.retrieveProfile();
        if (profile.country)
            return profile.country;

        try {
            let country = await ip2Location();
            if (country !== '') {
                profile.country = country;
                await storageHelper.updateProfile(profile);
                return country;
            }
        } catch (err) {
            console.log(err.message);
        }
        return 'Unknown';
    }

    return {
        joinSwash,
        isJoinedSwash,
        getReferralRewards,
        sendSponsoredWithdraw,
        getDataEthPairPrice,
        getUserId,
        getUserCountry,
        init
    };
}());

export {swashApiHelper};