import React, {useState, useContext} from 'react';
import Form from './Form';
import { Context } from '../Context';
import Data from '../Data';

const CreateCourse = (props) => {
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ estimatedTime, setEstimatedTime] = useState('');
    const [ materialsNeeded, setMaterialsNeeded] = useState('');
    const [ errors, setErrors ] = useState([]);
    const context = useContext(Context);
    const { credential } = context;
    const { firstName, lastName } = context.authenticatedUser;
   
    const  change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
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
    const cancel = () => {
        props.history.push('/');
    }
    const submit = () => {
        const data = new Data();
        const course = { title, description, estimatedTime, materialsNeeded, userId:context.authenticatedUser.id};
        data.createCourse(course,credential)
          .then( errors => {
            if (errors.length){
              setErrors(errors);
            } else {
              props.history.push('/');
              console.log(`Successfully created new course`);   
            }
          })
          .catch( err=>{
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