import React, { Component } from 'react';
import './SignUp.css';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Global from '../common/Global';
import AdapterHOBDataService from '../data/DataService';
import HOBUserData from '../data/Data';
import { Redirect } from 'react-router-dom';
import toaster from 'toasted-notes' 
import 'toasted-notes/src/styles.css';

class SignUp extends Component {
    caller = null;

    constructor(props) {
        super();
        
        this.caller = props.location.state && (props.location.state.caller || `${process.env.PUBLIC_URL}/`);
        this.state = {
            signUpComplete: false,
        };
    }

    render() {
        const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
        
        if (this.state.signUpComplete) {
            
            // this is to give the chance for caller to reload and update 
            // header component to shwo the signed up user name
            // window.location.replace(this.caller && (this.caller.pathname || '/'));
            
            return <Redirect to={this.caller && (this.caller.pathname || `${process.env.PUBLIC_URL}/`)} />;
        }
        else
            return (
                <div className="container justify-content-md-center">
                    <div className="row justify-content-md-center">
                        <div>
                            <Formik
                                initialValues={{ email: "dvinun@gmail.com", firstName: "John", phone: "6502191826", lastName: "Doe" }}
                                validationSchema={Yup.object().shape({
                                    firstName: Yup.string()
                                        .required('First Name is required'),

                                    email: Yup.string()
                                        .email('Email is invalid')
                                        .required('Email is required'),

                                    phone: Yup.string().matches(phoneRegExp, 'Phone number is invalid')

                                })}
                                // make the function async as we invoke method to get ip address in a block mode.
                                onSubmit={async (values, { setSubmitting }) => {

                                    // wait till we get the result
                                    var clientIPAddress = await (new Global()).getClientIPAddress();

                                    
                                    var hobUserData = new HOBUserData(values.firstName, values.lastName,
                                        values.email, values.phone, clientIPAddress);

                                    // wait till sign-up finishes
                                    var response = await (new AdapterHOBDataService()).setUserData(hobUserData);
                                    
                                    if (response) {
                                        toaster.notify(
                                            <h4 className='text-muted text-center'> 💚 Congratulations! You have successfully signed up.</h4>
                                        );
                                        this.setState({ signUpComplete: true });
                                    }
                                    else {
                                        toaster.notify(
                                            <h4 className='text-muted text-center'> 💔 Sorry! Signup Failed. Please try again.</h4>
                                        );
                                        this.setState({ signUpComplete: false });
                                    }

                                    setSubmitting(false);
                                }}
                            >
                                {({ touched, errors, isSubmitting }) => (
                                    <Form className='signup-form '>
                                        <div className="text-center text-muted mb-4">
                                            We collect basic information so we can keep you posted on latest offers and news.
                                    </div>

                                        <div className="input-group mb-3">
                                            <Field
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                className={`form-control ${
                                                    touched.firstName && errors.firstName ? "is-invalid" : ""
                                                    }`}
                                            />
                                            <Field
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                className={`form-control`}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="firstName"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                className={`form-control ${
                                                    touched.email && errors.email ? "is-invalid" : ""
                                                    }`}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="email"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Field
                                                type="phone"
                                                name="phone"
                                                placeholder="Phone"
                                                className={`form-control ${
                                                    touched.phone && errors.phone ? "is-invalid" : ""
                                                    }`}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="phone"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={isSubmitting}
                                            size="lg"
                                        >
                                            {isSubmitting ? "Please wait..." : "Sign Up"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            );
    }
}

export default SignUp;
