import React, {useState, useContext, useEffect} from 'react';
import Form from './Form';
import { Context } from '../Context';
import Data from '../Data';

const UpdateCourse = (props) => {
    // Setup and initalize title, description, estimatedTime, materialsNeeded, and errors.
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ estimatedTime, setEstimatedTime] = useState('');
    const [ materialsNeeded, setMaterialsNeeded] = useState('');
    const [ errors, setErrors ] = useState([]);

    // Get credential and author information from context
    const context = useContext(Context);
    const { credential } = context;
    const { firstName, lastName } = context.authenticatedUser;
    const userId = context.authenticatedUser.id;

    // Get Course ID from path parameter
    const { id } = props.match.params;
    
    // Get the history function from props
    const { history } = props;

    // useEffect hook to retrive data from Rest API
    useEffect(()=>{
        // Fetch course detail from API and update states
        const data = new Data();
        data.getCourseDetail(id)
            .then((course) => {
                // If course is not found send to not found
                if (course === null){
                    history.push('/notfound');
                    return;
                }
                // If the Author is not the same as authenticated user show forbidden
                if (userId !== course.userId ){
                    history.push('/forbidden');
                    return;
                }
                // Update title, description, estimatedTime, and MaterialsNeeded states
                setTitle(course.title);
                setDescription(course.description);
                setEstimatedTime(course.estimatedTime);
                setMaterialsNeeded(course.materialsNeeded);
            })
            .catch(() => {
                history.push("/error");
            });
    },[id,userId,history]);

    // On form field change event handler 
    const  change = (event) => {
        // Update the state base on Form field
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
            alert("ERROR: Value not watched in update course");
        }
      };
    
    // On Cancel button clicked return to index page
    const cancel = () => {
        props.history.push('/');
    }
    
    // On Update Course button clicked send changes to Rest API
    const submit = () => {
        // calls Update Course with Course ID, Course Information and Credential
        const data = new Data();
        const course = { title, description, estimatedTime, materialsNeeded, userId:context.authenticatedUser.id};
        data.updateCourse(id, course,credential)
          .then( errors => {
            // If error array is not empty set errors
            if (errors.length){
              setErrors(errors);
            } else {
              // No error then is success update of course redirect to Course Detail page
              props.history.push(`/courses/${id}`);
              console.log(`Successfully updated course`);   
            }
          })
          .catch( err=>{
                console.log(err);
                // If forbidden user from update content send to /forbidden page
                if (err.message === 'FORBIDDEN'){
                    props.history.push('/forbidden');
                } else {
                    // Otherwise is unhandled error
                    props.history.push('/error');
                }
          });

    }

    return (
        <div className="wrap">
            <h2>Update Course</h2>
            <Form 
                cancel={cancel}
                errors={errors}
                submit={submit}
                submitButtonText="Update Course"
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

export default UpdateCourse;