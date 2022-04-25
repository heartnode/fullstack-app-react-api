import React, {useEffect,useState, useContext} from 'react';
import ReactMarkdown from 'react-markdown';
import { Context } from '../Context';
import Data from '../Data';

// Course Detail Component
const CourseDetail = (props) => {
    // Gets the Context 
    const context = useContext(Context);
    
    // course state and setter
    const [course,setCourse] = useState({User:{}});
    
    // Gets the Course ID from path parameters
    const {id} = props.match.params;
    const {history} = props;
    // Fetch the course detail from api server
    useEffect(()=>{
        const data = new Data();
        data.getCourseDetail(id)
            .then((course)=>{
                // If course not found redirect to /notfound
                if (course === null){
                    history.push('/notfound');
                    return;
                }
                // Update the course state
                setCourse(course);
            })
            .catch(()=>{
                // Catches unhandled error from REST API
                history.push('/error');
            })
    },[id,history]);

    // Delete course function
    const deleteCourse = () => {
        const data = new Data();
        // Delete the course by Id and passing the credential from context
        data.deleteCourse(id,context.credential)
            .then((response) => {
                // If response is success goes to the the / 
                if (response !== null) {
                    props.history.replace('/');
                } else {
                    // If response failed then redirect to forbidden
                    props.history.push('/forbidden');
                }
            })
            .catch(() => {
                // Unhandled Error push to error 
                props.history.push('/error');
            });
    };

    // Handles on Update Course button click
    const updateCourse = () => {
        // Redirect to /course/:id/update path
        props.history.push(`/courses/${id}/update`);
    }

    return(
        <main>
            
                <div className="actions--bar">
                    <div className="wrap">
                    { 
                        (context.authenticatedUser !== null && context.authenticatedUser.id === course.userId) ?
                        <React.Fragment>
                            <button className="button" onClick={()=>updateCourse()}>Update Course</button>
                            <button className="button" onClick={()=>deleteCourse()}>Delete Course</button>
                        </React.Fragment>
                        :
                        <React.Fragment />
                    }
                        <a className="button button-secondary" href="/">Return to List</a>
                    </div>
                </div> 
           
            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course.title}</h4>
                            <p>By {course.User.firstName} {course.User.lastName}</p>
                            <ReactMarkdown>{course.description}</ReactMarkdown>
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CourseDetail;