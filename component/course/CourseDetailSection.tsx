import React from 'react';
import { CourseType } from '@/types';

interface CourseDetailSectionProps {
  course: CourseType;
}

const CourseDetailSection: React.FC<CourseDetailSectionProps> = ({ course }) => {
  return (
    <section className="course-detail">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="course-image">
              <img src={course.imgSrc.image} alt={course.imgSrc.alt} className="img-fluid" />
            </div>
            <div className="course-content">
              <h1>{course.title}</h1>
              <div className="course-meta">
                <span>Category: {course.category}</span>
                <span>Instructor: {course.instructor}</span>
                <span>Lessons: {course.lessons}</span>
                <span>Students: {course.students}</span>
                <span>Rating: {course.rating}</span>
                <span>Price: ${course.price}</span>
              </div>
              <div className="course-description">
                <p>{course.description}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="course-sidebar">
              <div className="course-price">
                <h3>${course.price}</h3>
                <button className="btn btn-primary">Enroll Now</button>
              </div>
              <div className="course-features">
                <h4>Course Features</h4>
                <ul>
                  <li>Duration: {course.lessons} lessons</li>
                  <li>Students: {course.students}</li>
                  <li>Rating: {course.rating}/5</li>
                  <li>Reviews: {course.review}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailSection; 