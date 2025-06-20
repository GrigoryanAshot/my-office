import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection';
import ErrorSection from '@/component/error/ErrorSection';
import TeamDetailSection from '@/component/team/TeamDetailSection';
import { TeamType } from '@/types';
import { getTeam } from '@/sanity/sanity.query';

export const metadata: Metadata = {
    title: "My-Office.am",
    description: "My-Office.am - Office Furniture",
  }
const page = async({ params:paramsPromise } : { params : Promise<{ slug: string}> }) => {
    const teamData: TeamType[] = await getTeam();
    const params = await paramsPromise;
    const teamDesc = teamData.find((item) => item.slug === params.slug);
  return (
    <Layout>
        <BreadcrumbSection header="Team Details" title="Team Details" />
        {teamDesc ? (
        <TeamDetailSection teamInfo={teamDesc} teamDataArray={teamData}/>
        ) : (
        <ErrorSection type="Team Member" />
        )}
    </Layout>
  )
}

export default page