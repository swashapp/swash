import {communityHelper} from "./communityHelper.js";
import {storageHelper} from "./storageHelper.js";

let gatewayHelper = (function () {
    async function callIP2LocationApi() {
        const url = 'https://swashapp.io/api/ip2location'
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
        getUserCountry,
    };
}());

export {gatewayHelper};