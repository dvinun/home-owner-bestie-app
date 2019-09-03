export default class HOBUserData
{
    FirstName = '';
    LastName = '';
    Email = '';
    Phone = '';
    ClientIPAddress = '';

    constructor(firstName, lastName, email, phone, clientIPAddress) {
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Email = email;
        this.Phone = phone;
        this.ClientIPAddress = clientIPAddress;
    }
}

export class RentValuationData
{
    AverageMonthlyRent = '';
    ValueChangedIn30Days = '';
    ValuationRentHigh = '';
    ValuationRentLow = '';
    IsRentEstimateAvailable = false;
    Message = '';

    constructor(averageMonthlyRent, valueChangedIn30Days, valuationRentHigh, valuationRentLow, isRentEstimateAvailable) {
        this.AverageMonthlyRent = averageMonthlyRent;
        this.ValueChangedIn30Days = valueChangedIn30Days;
        this.ValuationRentHigh = valuationRentHigh;
        this.ValuationRentLow = valuationRentLow;
        this.IsRentEstimateAvailable = isRentEstimateAvailable;
    }
} 

export class Address
{
    Street = '';
    City  = '';
    County  = '';
    Zip  = '';
    State  = '';
    
    constructor(Street, City, County, State, Zip) {
        this.Street = Street;
        this.City =     City;
        this.County = County;
        this.State = State;
        this.Zip = Zip;
    }
} 