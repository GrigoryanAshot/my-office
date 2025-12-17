import React from 'react';
import { CourseType } from '@/types';
import Link from 'next/link';

// Updated for Vercel deployment
interface AllCourseSectionProps {
  courses: CourseType[];
}

const AllCourseSection: React.FC<AllCourseSectionProps> = ({ courses }) => {
  return (
    <section className="all-courses">
      <div className="container">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-lg-4 col-md-6">
              <div className="course-card">
                <div className="course-image">
                  <img src={course.imgSrc.image} alt={course.imgSrc.alt} className="img-fluid" />
                </div>
                <div className="course-content">
                  <h3>
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                  <div className="course-meta">
                    <span>Category: {course.category}</span>
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <span className="price">${course.price}</span>
                    <span className="rating">{course.rating}/5</span>
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

export default AllCourseSection; 