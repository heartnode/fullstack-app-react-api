import React, {useState, useContext} from 'react';
import Form from './Form';
import { Context } from '../Context';
import Data from '../Data';

const CreateCourse = (props) => {
    //Setup and initialize states for title, description, estimatedTime, materialsNeeded, errors
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ estimatedTime, setEstimatedTime] = useState('');
    const [ materialsNeeded, setMaterialsNeeded] = useState('');
    const [ errors, setErrors ] = useState([]);

    //Use global Context 
    const context = useContext(Context);

    //Gets the credential from context and author information
    const { credential } = context;
    const { firstName, lastName } = context.authenticatedUser;
   
    //Update the states of each form field
    const  change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        // Sets the states base on the field name
        if (name === "courseTitle"){
            setTitle(value);
        } else if (name === "courseDescription"){
            setDescription(value);
        } else if (name === "estimatedTime"){
            setEstimatedTime(value);
        } else if (name === "materialsNeeded"){
            setMaterialsNeeded(value);
        } else {
            alert("ERROR: Value not watched in create course");
        }
      };

    // Redirect user back to index page when Cancel button is clicked
    const cancel = () => {
        props.history.push('/');
    }

    // On Submit button is clicked
    const submit = () => {
        //Create new course by calling Rest API
        const data = new Data();
        const course = { title, description, estimatedTime, materialsNeeded, userId:context.authenticatedUser.id};
        data.createCourse(course,credential)
          .then( errors => {
            // If errors array is set update the errors state
            if (errors.length){
              setErrors(errors);
            } else {
              // If no errors is a success for creating new course redirect to listing page  
              props.history.push('/');
              console.log(`Successfully created new course`);   
            }
          })
          .catch( err=>{
            // If returns error redirect to unhandled error page 
            console.log(err);
            props.history.push('/error');
          });

    }

    return (
        <div className="wrap">
            <h2>Create Course</h2>
            <Form 
                cancel={cancel}
                errors={errors}
                submit={submit}
                submitButtonText="Create Course"
                elements={() => (
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input 
                            id="courseTitle" 
                            name="courseTitle" 
                            type="text"
                            value={title} 
                            onChange={change}/>

                        <p>By {firstName} {lastName}</p>

                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea 
                            id="courseDescription"
                            name="courseDescription"
                            onChange={change}
                            value={description}/>
                    </div>     
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label> 
                        <input 
                            id="estimatedTime" 
                            name="estimatedTime" 
                            type="text"
                            value={estimatedTime} 
                            onChange={change}/>
                        
                        <label htmlFor="materialsNeeded">Materials Needed</label>
                        <textarea 
                            id="materialsNeeded"
                            name="materialsNeeded"
                            onChange={change}
                            value={materialsNeeded}/>
                    </div>        
                </div>
                )} />
        </div>
    );

};

export default CreateCourse;