import Cookies from 'universal-cookie';
import Config from '../common/Config';

class HOBDataService {

    nextHOBDataService = null;
    mIsUserSignedUp = false;
    mUserDetails = null;

    async setUserData(hobUserData) {
        if (this.nextHOBDataService) {
            const response = await this.nextHOBDataService.setUserData(hobUserData);
            return response;
        }
    }

    rollBackSetUserData() {
        if (this.nextHOBDataService)
            this.nextHOBDataService.rollBackSetUserData();
    }

    setNextHOBDataService(hobDataService) {
        this.nextHOBDataService = hobDataService;
    }

    getNextHOBDataService() {
        return this.nextHOBDataService;
    }

    isUserSignedUp() {
        if (this.nextHOBDataService)
            return this.nextHOBDataService.isUserSignedUp();
        else return this.mIsUserSignedUp;
    }

    getUserDetails() {
        if (this.nextHOBDataService)
            return this.nextHOBDataService.getUserDetails();
        else return this.mUserDetails;
    }

    runRentValuationReport(userDetails, address) {
        if (this.nextHOBDataService) {
            const response = this.nextHOBDataService.runRentValuationReport(userDetails, address);
            return response;
        }
    }

    runSendEmailReport(userDetails, homeOwnerSpecifiedRent) {
        if (this.nextHOBDataService) {
            const response = this.nextHOBDataService.runSendEmailReport(userDetails, homeOwnerSpecifiedRent);
            return response;
        }
    }
}

class LocalHOBDataService extends HOBDataService {
    setUserData(hobUserData) {
        const cookies = new Cookies();
        cookies.set('home-owner-bestie-user-details', hobUserData, '/');
        return super.setUserData(hobUserData);
    }

    isUserSignedUp() {
        const cookies = new Cookies();
        var hobUserData = cookies.get('home-owner-bestie-user-details');
        this.mIsUserSignedUp = (hobUserData != null);
        // if local data service knows if the user has signed up, then no need to check for server data service.
        return this.mIsUserSignedUp || super.isUserSignedUp();
    }

    getUserDetails() {
        const cookies = new Cookies();
        var hobUserData = cookies.get('home-owner-bestie-user-details');
        this.mUserDetails = hobUserData;
        return this.mUserDetails || super.getUserDetails();;
    }

    runRentValuationReport(userDetails, address) {
        return super.runRentValuationReport(userDetails, address);
    }

    runSendEmailReport(userDetails, homeOwnerSpecifiedRent) {
        return super.runSendEmailReport(userDetails, homeOwnerSpecifiedRent);
    }

    rollBackSetUserData() {
        const cookies = new Cookies();
        cookies.remove('home-owner-bestie-user-details', { path: '/' });
        super.rollBackSetUserData();
    }
}

class ServerHOBDataService extends HOBDataService {
    async setUserData(hobUserData) {

        const axios = require('axios');
        const response = await axios.post(Config.homeBestieApiServiceUrl_User,
            { ...hobUserData }
        )
            .then(function (response) {
                console.log(response);
                return true;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false;
            })
            .finally(function () {
                // always executed
            });
        return response || super.setUserData(hobUserData);
    }

    isUserSignedUp() {
        // we only rely on local cookies for now to check if
        // the user has signed up.
        return super.isUserSignedUp();
    }

    getUserDetails() {
        return super.getUserDetails();;
    }

    async runRentValuationReport(userDetails, address) {
        debugger;
        const axios = require('axios');
        const response = await axios.post(Config.homeBestieApiServiceUrl_RentValuation,
            { 'user': { ...userDetails }, 'address': { ...address } }
        )
            .then(function (response) {
                debugger;
                console.log(response);
                return response;
            })
            .catch(function (error) {
                debugger;
                console.log(error);
                return false;
            })
            .finally(function () {
                // always executed
            });
        return response || super.runRentValuationReport(userDetails, address);
    }

    runSendEmailReport(userDetails, homeOwnerSpecifiedRent) {
        debugger;
        const axios = require('axios');
        const response = axios.post(Config.homeBestieApiServiceUrl_EmailRentValuationReport,
            { 'user': { ...userDetails }, homeOwnerSpecifiedRent }
        )
            .then(function (response) {
                debugger;
                console.log(response);
                return response;
            })
            .catch(function (error) {
                debugger;
                console.log(error);
                throw error;
            })
            .finally(function () {
                // always executed
            });
        return response || super.runSendEmailReport(userDetails, homeOwnerSpecifiedRent);
    }

    rollBackSetUserData() { }
}

// this implements chain of respobility pattern in order to achieve abstraction
// of the data points, local/storage etc.
// in this case, local cookies and server cookies are separated out and they 
// do similar operation in their ways with the help of this adapter chain.
export default class AdapterHOBDataService {
    hobDataServiceChain = '';

    constructor() {
        this.hobDataServiceChain = new LocalHOBDataService();
        this.hobDataServiceChain.setNextHOBDataService(new ServerHOBDataService());
    }

    async setUserData(hobUserData) {
        var response = await this.hobDataServiceChain.setUserData(hobUserData);

        // if there is a signup failure from server, 
        // then rollback other all prior signups from other data services.
        // at the moment, when server fails, then we instruct localstorageservice 
        // know to remove the cookies.
        if (!response)
            this.hobDataServiceChain.rollBackSetUserData();
        return response;
    }

    isUserSignedUp() {
        return this.hobDataServiceChain.isUserSignedUp();
    }

    getUserDetails() {
        return this.hobDataServiceChain.getUserDetails();
    }

    runRentValuationReport(userDetails, address) {
        return this.hobDataServiceChain.runRentValuationReport(userDetails, address);
    }

    runSendEmailReport(userDetails, homeOwnerSpecifiedRent) {
        return this.hobDataServiceChain.runSendEmailReport(userDetails, homeOwnerSpecifiedRent);
    }
}
