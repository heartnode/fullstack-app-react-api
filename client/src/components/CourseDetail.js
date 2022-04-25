import React, {useEffect,useState, useContext} from 'react';
import ReactMarkdown from 'react-markdown';
import { Context } from '../Context';

import Data from '../Data';
const CourseDetail = (props) => {

    const context = useContext(Context);
    const [course,setCourse] = useState({User:{}});
    const {id} = props.match.params;
    console.log(context);
    useEffect(()=>{
        const data = new Data();
        data.getCourseDetail(id)
            .then((course)=>{
                console.log(course);
                setCourse(course);
            })
    },[id]);

    const deleteCourse = () => {
        const data = new Data();
        data.deleteCourse(id,context.credential)
            .then((response) => {
                if (response !== null) {
                    props.history.replace('/');
                } else {
                    props.history.push('/forbidden');
                }
            })
            .catch(() => {
                props.history.push('/error');
            });
    };

    const updateCourse = () => {
        props.history.push(`/courses/${id}/update`);
    }

    return(
        <main>
            { (context.authenticatedUser !== null && context.authenticatedUser.id === course.userId) ?
                <div className="actions--bar">
                    <div className="wrap">
                        <button className="button" onClick={()=>updateCourse()}>Update Course</button>
                        <button className="button" onClick={()=>deleteCourse()}>Delete Course</button>
                        <a className="button button-secondary" href="/">Return to List</a>
                    </div>
                </div> 
            :
                <React.Fragment />
            }
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