import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection';
import ErrorSection from '@/component/error/ErrorSection';
import TeamDetailSection from '@/component/team/TeamDetailSection';
import { TeamType } from '@/types';
import { getTeam } from '@/sanity/sanity.query';
import PersonSchema from '@/components/seo/PersonSchema';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const teamData: TeamType[] = await getTeam();
  const person = teamData.find((item) => item.slug === params.slug);
  
  if (!person) {
    return {
      title: 'Team Member Not Found | My Office',
      description: 'The requested team member could not be found.',
    };
  }
  
  const baseUrl = getBaseUrl();
  const personUrl = `${baseUrl}/team/${person.slug}`;
  const description = person.about ? person.about.substring(0, 157).trim() + (person.about.length > 157 ? '...' : '') : `Meet ${person.name} - ${person.designation} at My Office Armenia`;
  const image = person.imgSrc?.image ? (person.imgSrc.image.startsWith('http') ? person.imgSrc.image : `${baseUrl}${person.imgSrc.image}`) : `${baseUrl}/images/og-image.jpg`;
  
  return {
    title: `${person.name} - ${person.designation} | Team | My Office Armenia`,
    description,
    keywords: [
      'My Office team',
      person.name,
      person.designation,
      'office furniture experts',
      'կահույք մասնագետներ',
    ],
    openGraph: {
      type: 'profile',
      url: personUrl,
      title: `${person.name} - ${person.designation}`,
      description,
      siteName: 'My Office Armenia',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: person.name,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${person.name} - ${person.designation}`,
      description,
      images: [image],
    },
    alternates: {
      canonical: personUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const page = async({ params:paramsPromise } : { params : Promise<{ slug: string}> }) => {
    const teamData: TeamType[] = await getTeam();
    const params = await paramsPromise;
    const teamDesc = teamData.find((item) => item.slug === params.slug);
  return (
    <Layout>
        {teamDesc && <PersonSchema person={teamDesc} />}
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