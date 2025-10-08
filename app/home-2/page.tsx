import React from 'react'
import type { Metadata } from 'next'
import NavbarSection from '@/component/navbar/NavbarSection'

import { ActivityType, BlogType, CategoryType, CourseType, TeamType } from '@/types'
import { getActivity, getBlog, getCategory, getCourse, getTeam } from '@/sanity/sanity.query'

export const metadata: Metadata = {
    title: "My-Office.am",
    description: "My-Office.am - Office Furniture",
  }
const page = async() => {
  const teamData: TeamType[] = await getTeam();
  const activityData: ActivityType[] = await getActivity();
  const blogData: BlogType[] = await getBlog();
  const categoryData: CategoryType[] = await getCategory();
  const courseData: CourseType[] = await getCourse();
  return (
    <div className="home_3">
      
      <NavbarSection style="main_menu_3" logo="images/logo3.png" />
      
    </div>
  )
}

export default page