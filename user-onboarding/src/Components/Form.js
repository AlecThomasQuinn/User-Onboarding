import React, { useState } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik"; // a library to make making forms easier
import * as Yup from "yup"; // for validation

// form validation is what's used to make sure that the form is getting the kind of data it's expecting
// ie if an email address does not have an @, it's not an email address and thus in invalid
// and so we can shoot an error message at the user to let them know the from cannot be submitted
// with invalid data

// Yup and Formik work hand-in-hand

const onBoardForm = ({errors, touched, values}) => {

    return(
        <div>
            <h1>I am a FORM</h1>
            <Form>
                <Field name='name' type='text' placeholder='What is your name?' />
                {/* below is an inline conditional IF expression
                    ie IF X is true THEN return this element

                    if touched.name is true, THEN(&&) if errors.name is true, THEN(&&)
                    return this paragraph with the value of errors.name

                    the error values being pulled here are stored in the Yup schema on line 60,
                    which is inside of the Formik component that starts on line 48
                */}
                {touched.name && errors.name && (<p>{errors.name}</p>)}
                
                <Field name='email' type='text' placeholder='What is your email?' />
                {touched.email && errors.email && (<p>{errors.email}</p>)}
                
                <Field name='password' type='text' placeholder='What is your password?' />
                {touched.password && errors.password && (<p>{errors.password}</p>)}
                
                <Field name='TOS' type='checkbox' checked={values.TOS} />
                <span>DO YOU AGREE?</span>
                <button>Submit. Or don't. Do you.</button>
            </Form>
        </div>
    );
};

// withFormik() is a function from the formik library that is currying the function I made on line 6 'onBoardForm'
// withFormik() expects an object{} as it's argument. I imagine this is so that it can 'curry' the items in the object to match 
// the arguments (or in React, props) needed in onBoardForm, hence 'mapPropsToValues()' - which ALSO takes an object
const FormikOnBoardForm = withFormik({
    mapPropsToValues({ name, email, password, TOS }) {
        return{
            name: name || '',
            email: email || '',
            password: password || '',
            TOS: TOS || false   
        };
    }, // interestingly this is still acting as an object (error shoots ' , expected'). 
       // Can one function have multiple {}'s with multiple return statements?

    // Yup uses 'schema objects' as a blueprint for the expected shape of the form's input
    validationSchema: Yup.object().shape({

        // the 'name' property (I have been calling properties items) has a value that uses a Yup method to verify/validate
        // that the info being submitted is a string (a la .string()). The name property is also required and if it is 
        // skipped an error message will fire
        name: Yup.string().required('this is an error message. YOU ARE IN ERROR'),
        email: Yup.string().required('this is an error message. YOU ARE IN ERROR'),
        password: Yup.string().required('this is an error message. YOU ARE IN ERROR'),
    }),

    // another Formik function. This is where we make our axios call
    // important to note that the axios post will only fire AFTER submitHandle() is fired
    // (ie when the submit button is clicked and there is something to handle)
    handleSubmit(values, { setStatus }){
        axios
        .post('https://reqres.in/api/users', values)
        .then(response => {
            console.log(response);
        })
    }


})(onBoardForm);  // this part of withFormik is what makes this a "higher order component" (or a higher order function, since components are simply functions)
                  // it takes a funtion as it's arguments, which is 'curried' and only fired later, after the prior logic in the first part of the function
                  // has been worked through (I presume)
export default FormikOnBoardForm;