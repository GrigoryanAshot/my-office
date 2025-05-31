import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import ContactPageSection from '@/component/contact/ContactPageSection'
import Layout from '@/component/layout/Layout'
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "My-Office.am",
  description: "My-Office.am - Office Furniture",
}
const page = () => {
  return (
    <Layout>
        <BreadcrumbSection header='Կապ մեզ հետ' title="Կապ մեզ հետ"/>
        <ContactPageSection/>
    </Layout>
  )
}

export default page