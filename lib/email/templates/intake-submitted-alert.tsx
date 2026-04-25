import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  clientName: string
  clientEmail: string
  dashboardUrl: string
}

export function IntakeSubmittedAlert({ clientName, clientEmail, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{clientName} has submitted their intake form.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Intake Form Submitted</Heading>
          <Text style={text}>
            <strong>{clientName}</strong> ({clientEmail}) has completed their intake form and is ready for their first
            session.
          </Text>
          <Section style={card}>
            <Text style={cardText}>
              Review their responses in the dashboard to prepare for the session.
            </Text>
            <Link href={dashboardUrl} style={button}>
              View Client Dashboard →
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Parent Coaching with Marissa — Dashboard Notification</Text>
        </Container>
      </Body>
    </Html>
  )
}

IntakeSubmittedAlert.PreviewProps = {
  clientName: 'Sarah Johnson',
  clientEmail: 'sarah@example.com',
  dashboardUrl: 'https://parentcoaching.vercel.app/dashboard/clients/abc123',
} satisfies Props

export default IntakeSubmittedAlert

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: '12px 0' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', margin: '20px 0' }
const cardText = { color: '#2D5016', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }
const button = { backgroundColor: '#2D5016', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
