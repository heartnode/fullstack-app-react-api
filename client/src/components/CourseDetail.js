import React, {useEffect,useState} from 'react';
import Data from '../Data';
const CourseDetail = (props) => {

    const [course,setCourse] = useState({User:{}});
    const {id} = props.match.params;

    useEffect(()=>{
        const data = new Data();
        data.getCourseDetail(id)
            .then((course)=>{
                console.log(course);
                setCourse(course);
            })
    },[id]);

    return(
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    <a className="button" href="update-course.html">Update Course</a>
                    <a className="button" href="#delete">Delete Course</a>
                    <a className="button button-secondary" href="index.html">Return to List</a>
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
                            <p>{course.description}</p>
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                {course.materialsNeeded}
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CourseDetail;