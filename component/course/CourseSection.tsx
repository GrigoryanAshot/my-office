import React from 'react';
import { CourseType } from '@/types';

interface CourseSectionProps {
  style?: string;
  courseData: CourseType[];
}

const CourseSection: React.FC<CourseSectionProps> = ({ style, courseData }) => {
  return (
    <section className={`tf__courses ${style || ''}`}>
      <div className="container">
        <div className="row">
          {courseData.map((course) => (
            <div key={course._id} className="col-xl-4 col-md-6 wow fadeInUp">
              <div className="tf__single_courses">
                <div className="tf__single_courses_img">
                  <img src={course.imgSrc.image} alt={course.imgSrc.alt} className="img-fluid w-100" />
                </div>
                <div className="tf__single_courses_text">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course_details">
                    <span>Category: {course.category}</span>
                    <span>Instructor: {course.instructor}</span>
                    <span>Lessons: {course.lessons}</span>
                    <span>Students: {course.students}</span>
                    <span>Rating: {course.rating}</span>
                    <span>Price: ${course.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseSection; 