import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import RegisterSection from '@/component/authentication/RegisterSection'

export const metadata: Metadata = {
    title: "My-Office.am",
    description: "My-Office.am - Office Furniture",
  }
const page = () => {
  return (
    <Layout>
        <BreadcrumbSection header='Sign Up' title='Sign Up'/>
        <RegisterSection/>
    </Layout>
  )
}

export default page