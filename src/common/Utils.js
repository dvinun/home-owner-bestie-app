import { Address } from "../data/Data";

class Utils {
    static trimChar(string, charToRemove) {
        while (string.charAt(0) === charToRemove) {
            string = string.substring(1);
        }

        while (string.charAt(string.length - 1) === charToRemove) {
            string = string.substring(0, string.length - 1);
        }

        return string;
    }

    static getLastSegmentInPath(path) {
        return /[^/]*$/.exec(path)[0];
    }

    static getAddressValueForGivenProperty(addressComponents, property) {
        for (let i = 0; i < addressComponents.length; i++) {
            for (let j = 0; j < addressComponents[i].types.length; j++) {
                if (addressComponents[i].types[j] == property) return addressComponents[i].short_name;
            }
        }
    }

    static getAddressFromAddressComponents(addressComponents) {
        var address = new Address();
        address.City = this.getAddressValueForGivenProperty(addressComponents, 'locality');
        address.County = this.getAddressValueForGivenProperty(addressComponents, 'administrative_area_level_2');
        address.State = this.getAddressValueForGivenProperty(addressComponents, 'administrative_area_level_1');
        address.Zip = this.getAddressValueForGivenProperty(addressComponents, 'postal_code');
        address.Street = this.getAddressValueForGivenProperty(addressComponents, 'street_number') + ' ' + this.getAddressValueForGivenProperty(addressComponents, 'route');
        return address;
    }

    static formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}

export default Utils;