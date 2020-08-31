import {communityHelper} from "./communityHelper.js";
import {storageHelper} from "./storageHelper.js";

let swashApiHelper = (function () {
    const swashEndpoint = 'https://swashapp.io/api/v1';
    async function isJoinedSwash() {
        const url = swashEndpoint + '/user/join'
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
                let profile = await storageHelper.retrieveProfile();
                profile.user_id = user_id;
                await storageHelper.updateProfile(profile);
                return true;
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        return false;
    }

    async function joinSwash(recaptchaToken) {
        const url = swashEndpoint + '/user/join'
        const req = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer ".concat(communityHelper.generateJWT()),
                'X-Forwarded-For': '8.8.8.8'
            },
            body: JSON.stringify({'g-recaptcha-response': recaptchaToken})
        }
        try {
            const resp = await fetch(url, req);
            if (resp.status === 200) {
                let user_id = (await resp.json()).id;
                let profile = await storageHelper.retrieveProfile();
                profile.user_id = user_id;
                await storageHelper.updateProfile(profile);
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
    }

    async function getReferralRewards() {
        const url = swashEndpoint + '/user/reward'
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
                console.log(programs);
                let total = 0;
                for (const program of programs){
                    if (program.Reward)
                        total += program.Reward;
                }
                console.log(total);
                return total;
            }
        } catch (err) {
            console.error(`Error message: ${err.message}`)
        }
        return 0;
    }

    async function sendSponsoredWithdraw(recipient, signature) {
        const url = swashEndpoint + '/user/withdraw'
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
        const url = swashEndpoint + '/tools/ip2location'
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
    };
}());

export {swashApiHelper};