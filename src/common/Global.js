
let GlobalInfo = null;

class Global {
    clientIPAddress = null;

    static getHomeOwnerServiceTypes()
    {
        return [
            {
                id: 'rentyourhome', 
                name: 'Rent Your Home'
            },
            {
                id: 'homerepairs', 
                name: 'Home Repairs'
            },
            {
                id: 'exploreneighborhood', 
                name: 'Explore Neighborhood'
            },
            {
                id: 'explorecommunity', 
                name: 'Explore Community'
            },
            {
                id: 'valuatehomerent', 
                name: 'Valuate Home Rent'
            },
        ];
    }

    constructor() {
        if (!GlobalInfo) { GlobalInfo = this; }
        return GlobalInfo;
    }

    // make this method async-wait as we need to wait till the promise is resolved.
    async getClientIPAddress() {

        if(this.clientIPAddress) return this.clientIPAddress;
        
        await (new Promise((resolve, reject) => {
            var w = window,
                a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({ iceServers: [] }), b = () => { }; a.createDataChannel("");
            a.createOffer(c => a.setLocalDescription(c, b, b), b);
            a.onicecandidate = c => {
                try {
                    c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g)
                    .forEach(resolve)
                }
                catch (e) { }
            }
        })).then(ip => { this.clientIPAddress = ip; return this.clientIPAddress;}).catch(e => console.error(e));
        return this.clientIPAddress;
    }
}

export default Global;
