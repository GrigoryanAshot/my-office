import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import AllTeamMemberSection from '@/component/team/AllTeamMemberSection'
import { TeamType } from '@/types'
import { getTeam } from '@/sanity/sanity.query'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.my-office.am';
  const teamUrl = `${baseUrl}/team`;
  
  return {
    title: 'Our Team | My Office Armenia - Meet the Experts',
    description: 'Meet the My Office Armenia team - experienced professionals dedicated to helping you find the perfect office furniture solutions in Armenia.',
    keywords: [
      'My Office team',
      'office furniture experts',
      'furniture consultants Armenia',
      'կահույք մասնագետներ',
      'գրասենյակային կահույք խորհրդատուներ',
    ],
    openGraph: {
      type: 'website',
      url: teamUrl,
      title: 'Our Team | My Office Armenia',
      description: 'Meet the My Office Armenia team - experienced professionals in office furniture.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Team',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Our Team | My Office Armenia',
      description: 'Meet the My Office Armenia team.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: teamUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
const page = async() => {
  const teamData: TeamType[] = await getTeam();
  return (
    <Layout>
        <BreadcrumbSection header='Team' title='Team'/>
        <AllTeamMemberSection teamData={teamData}/>
    </Layout>
  )
}

export default page