import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Utils from '../common/Utils';
import './ValuateHomeRent.css';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
import AdapterHOBDataService from '../data/DataService';
import { operationResult, buttonState } from '../common/Properties';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


class ValuateHomeRent extends Component {
    addressComponent = '';

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            emailReportResult: operationResult.none,
            runButtonState: buttonState.normal,
            runRentValuationResult: operationResult.none,
            homeOwnerSpecifiedRent: '',
            rentValuationResult: {
                averageMonthlyRent: '--',
                valueChangedIn30Days: '--',
                valuationRentHigh: '--',
                valuationRentLow: '--',
                isRentEstimateAvailable: true,
                rentValuationResultMessage: '',
            },
            showAlert: false,
        };
    }

    onClickSendMeEmailReport() {
        let adapterHOBDataService = new AdapterHOBDataService();
        let userDetails = adapterHOBDataService.getUserDetails();

        adapterHOBDataService
            .runSendEmailReport(userDetails, this.state.homeOwnerSpecifiedRent)
            .then((result) => {
                this.setState({
                    showAlert: true,
                    emailReportResult: operationResult.success,
                });
            })
            .catch(() => {
                this.setState({
                    showAlert: false,
                    emailReportResult: operationResult.failure,
                });
            });
    }

    getAlertDiv(result, resultText) {
        if (result === operationResult.success) {
            return (<>
                <Alert variant="success" onClose={() => this.setState({ showAlert: false })} dismissible>
                    <Alert.Heading>💚 Awesome</Alert.Heading>
                    <p>{resultText}</p>
                </Alert>
            </>);
        }
        else if (result === operationResult.failure) {
            return (<>
                <Alert variant="danger" onClose={() => this.setState({ showAlert: false })} dismissible>
                    <Alert.Heading>💔 Yikes</Alert.Heading>
                    <p>{resultText}</p>
                </Alert>
            </>);
        }
    }

    handleChangeHomeOwnerRent(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ homeOwnerSpecifiedRent: fleldVal });
    }

    OnRunRentValuationReport() {

        if (!this.state.address) return;

        this.setState({ runButtonState: buttonState.busy });

        let adapterHOBDataService = new AdapterHOBDataService();
        let userDetails = adapterHOBDataService.getUserDetails();

        adapterHOBDataService
            .runRentValuationReport(
                userDetails, Utils.getAddressFromAddressComponents(this.addressComponent))
            .then((result) => {
                debugger;
                if (result.data.message === 'No Match Found' || result.data.message === 'No Data Found') {
                    this.setState({
                        runRentValuationResult: operationResult.noMatchFound,
                        showAlert: true,
                        runButtonState: buttonState.normal,
                        rentValuationResult:
                        {
                            averageMonthlyRent: '--',
                            valueChangedIn30Days: '--',
                            valuationRentHigh: '--',
                            valuationRentLow: '--',
                            isRentEstimateAvailable: true,
                            rentValuationResultMessage: '--',
                        }

                    });
                }
                else if (result.data.message === 'Zillow API Encountered Some Unknown Error') {
                    this.setState({
                        runRentValuationResult: operationResult.apiError,
                        showAlert: true,
                        runButtonState: buttonState.normal,
                        rentValuationResult:
                        {
                            averageMonthlyRent: '--',
                            valueChangedIn30Days: '--',
                            valuationRentHigh: '--',
                            valuationRentLow: '--',
                            isRentEstimateAvailable: true,
                            rentValuationResultMessage: '--',
                        }
                    });
                }
                else {
                    this.setState({
                        runButtonState: buttonState.normal,
                        runRentValuationResult: operationResult.success,
                        showAlert: true,
                        rentValuationResult:
                        {
                            averageMonthlyRent: Utils.formatter.format(result.data.averageMonthlyRent),
                            valueChangedIn30Days: Utils.formatter.format(result.data.valueChangedIn30Days),
                            valuationRentHigh: Utils.formatter.format(result.data.valuationRentHigh),
                            valuationRentLow: Utils.formatter.format(result.data.valuationRentLow),
                            isRentEstimateAvailable: result.data.isRentEstimateAvailable,
                            rentValuationResultMessage: Utils.formatter.format(result.data.message),
                        }
                    });
                }
            })
            .catch(() => {
                debugger;
                this.setState({
                    showAlert: true,
                    runButtonState: buttonState.normal,
                    runRentValuationResult: operationResult.failure
                })
            });
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        debugger;
        this.setState({ address });
        geocodeByAddress(address)
            .then(results => { this.addressComponent = results[0].address_components; getLatLng(results[0]) })
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    };

    render() {

        let alertDiv = null;
        let runButtonDiv = null;

        if (this.state.runButtonState === buttonState.busy) {
            runButtonDiv = (
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />);
        }
        else {
            runButtonDiv = 'Run';
        }

        if (this.state.showAlert === true) {
            if (this.state.runRentValuationResult === operationResult.success) {
                alertDiv = this.getAlertDiv(operationResult.success, 'Your request has been successfully processed.');
            }
            else if (this.state.runRentValuationResult === operationResult.failure) {
                alertDiv = this.getAlertDiv(operationResult.failure, 'Sorry! Something went wrong. Please try again!');
            }
            else if (this.state.runRentValuationResult === operationResult.apiError) {
                alertDiv = this.getAlertDiv(operationResult.failure, 'Sorry! The server API encountered a problem. Please try again!');
            }
            else if (this.state.runRentValuationResult === operationResult.noMatchFound) {
                alertDiv = this.getAlertDiv(operationResult.failure, 'Sorry! No match found for the address. Try a different one!');
            }
            else if (this.state.runRentValuationResult === operationResult.noDataFound) {
                alertDiv = this.getAlertDiv(operationResult.failure, 'Sorry! No rental and annual data found for the address. Try a different one!');
            }

            if (this.state.emailReportResult === operationResult.success) {
                alertDiv = this.getAlertDiv(operationResult.success, 'The request has been made successfully. Now, please sit and relax while we email you the report!');
            }
            else if (this.state.emailReportResult === operationResult.failure) {
                alertDiv = this.getAlertDiv(operationResult.failure, 'Sorry. There was some problem with the request. Please try again.');
            }
        }
        else {
            alertDiv = null;
        }


        return (
            <React.Fragment>
                <Container className={'little-padding  justify-content-md-center jumbotron-valuate-home-rent'}>
                    <Row >
                        <Col lg="6" >
                            <h5>Please type your home address and click Run to help us give you the best valuation</h5>
                            <PlacesAutocomplete
                                value={this.state.address}
                                onChange={this.handleChange}
                                onSelect={this.handleSelect}
                                highlightFirstSuggestion='true'
                                shouldFetchSuggestions={this.state.address.length > 1}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <InputGroup className="mb-3 search-home-address-textbox " size="lg">
                                            <FormControl id='HomeAddressSearch'
                                                {...getInputProps({
                                                    placeholder: 'Type here...',
                                                    className: 'location-search-input',
                                                })}
                                            />
                                            <InputGroup.Append>
                                                <Button variant="primary" onClick={() => this.OnRunRentValuationReport()}>
                                                    {runButtonDiv}
                                                </Button>
                                            </InputGroup.Append>
                                        </InputGroup>


                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <h6 className='text-muted' >&nbsp;If you have an accurate rent in mind, please provide us.</h6>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl onChange={this.handleChangeHomeOwnerRent.bind(this)} aria-label="Amount (to the nearest dollar)" type="money" disabled={!(this.state.runRentValuationResult === operationResult.success)} />
                            </InputGroup>
                            <Row className='text-left-align'>
                                <Col md={4}>
                                    <Button disabled={!(this.state.runRentValuationResult === operationResult.success)} variant="primary" size="md" onClick={() => { this.onClickSendMeEmailReport(); }}>Email me the report</Button>
                                </Col>
                                <Col md={{ offset: 0 }}>
                                    <h6 className='text-muted' >We can email you the report. Just click the submit.</h6>
                                </Col>
                            </Row>

                        </Col>
                        <Col lg='6' className='justify-content-md-center valuate-home-rent-summary-column'>
                            <Form className='valuate-home-rent-summary'>
                                <h5>Your Home Rent Valuation Report</h5>
                                <Row>
                                    <Col >
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label className='home-rent-summary-label text-muted'>Average Monthly Rent</Form.Label>
                                            <Form.Control value={this.state.rentValuationResult.averageMonthlyRent} id='average-monthly-rent' plaintext readOnly defaultValue="--" className='home-rent-summary-font-size' />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label className='home-rent-summary-label text-muted'>Value Changed In 30 Days</Form.Label>
                                            <Form.Control value={this.state.rentValuationResult.valueChangedIn30Days} id='average-monthly-rent' plaintext readOnly defaultValue="--" className='home-rent-summary-font-size' />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label className='home-rent-summary-label text-muted'>Valuation Range High</Form.Label>
                                            <Form.Control value={this.state.rentValuationResult.valuationRentHigh} id='average-monthly-rent' plaintext readOnly defaultValue="--" className='home-rent-summary-font-size' />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label className='home-rent-summary-label text-muted' >Valuation Range Low</Form.Label>
                                            <Form.Control value={this.state.rentValuationResult.valuationRentLow} id='average-monthly-rent' plaintext readOnly defaultValue="--" className='home-rent-summary-font-size ' />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <h8 id='warningRentZestimateNotAvailable' style={{ visibility: this.state.rentValuationResult.isRentEstimateAvailable ? 'hidden' : 'visible' }} >Rental data is not available. The calculation is based on annual cost of the home.</h8>
                            </Form>
                        </Col>
                    </Row>
                </Container>

                <Container className={'home-rent-summary-send-report-result-alert little-padding  justify-content-md-center '}>
                    <Row>
                        {alertDiv}
                    </Row>
                </Container>

            </React.Fragment>
        );
    }
}

export default ValuateHomeRent 