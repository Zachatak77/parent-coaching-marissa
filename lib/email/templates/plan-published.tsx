import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  clientName: string
  planTitle: string
  portalUrl: string
}

export function PlanPublished({ clientName, planTitle, portalUrl }: Props) {
  const firstName = clientName.split(' ')[0]
  return (
    <Html>
      <Head />
      <Preview>Your coaching plan is ready to view.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Your plan is ready, {firstName}.</Heading>
          <Text style={text}>
            Marissa has published your personalized coaching plan. Head to your parent portal to read it,
            review your key objectives, and print a copy if you&apos;d like one.
          </Text>
          <Section style={card}>
            <Text style={planLabel}>Your plan:</Text>
            <Text style={planTitle_}>{planTitle}</Text>
            <Link href={portalUrl} style={button}>
              View My Plan →
            </Link>
          </Section>
          <Text style={text}>
            If you have any questions about your plan, feel free to bring them up at your next session or reply to this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Parent Coaching with Marissa</Text>
        </Container>
      </Body>
    </Html>
  )
}

PlanPublished.PreviewProps = {
  clientName: 'Sarah Johnson',
  planTitle: 'Calm Mornings & Bedtime Wins — 4-Week Plan',
  portalUrl: 'https://parentcoaching.vercel.app/portal/plan',
} satisfies Props

export default PlanPublished

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: '12px 0' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', margin: '20px 0' }
const planLabel = { color: '#2D5016', opacity: 0.5, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px' }
const planTitle_ = { color: '#2D5016', fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }
const button = { backgroundColor: '#2D5016', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
