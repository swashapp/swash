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

    async function sendSponsoredWithdraw(recipient, signature) {
        const url = APIConfigManager.endpoint + APIConfigManager.APIList.widthraw
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer ".concat(communityHelper.generateJWT())
            },
            body: JSON.stringify({recipient: recipient, signature: signature})
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                let result = (await resp.json());
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        return null;
    }

    async function callIP2LocationApi() {
        const url = APIConfigManager.endpoint + APIConfigManager.APIList.ip2location
        const req = {
            method: 'GET',
            headers: {
                'Authorization': "Bearer ".concat(communityHelper.generateJWT())
            }
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                return (await resp.json()).country;
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
            let country = await callIP2LocationApi();
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
        getUserId,
        getUserCountry,
        init
    };
}());

export {swashApiHelper};