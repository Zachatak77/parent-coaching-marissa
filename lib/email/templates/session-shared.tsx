import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  clientName: string
  sessionDate: string
  actionItemCount: number
  portalUrl: string
}

export function SessionShared({ clientName, sessionDate, actionItemCount, portalUrl }: Props) {
  const firstName = clientName.split(' ')[0]
  return (
    <Html>
      <Head />
      <Preview>Your session recap from {sessionDate} is ready.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Session recap ready, {firstName}.</Heading>
          <Text style={text}>
            Marissa has shared the recap from your session on <strong>{sessionDate}</strong>. Head to your portal to
            review the notes and your action steps for the week.
          </Text>
          {actionItemCount > 0 && (
            <Section style={card}>
              <Text style={cardText}>
                You have <strong>{actionItemCount} action {actionItemCount === 1 ? 'item' : 'items'}</strong> to work
                on before your next session.
              </Text>
            </Section>
          )}
          <Link href={portalUrl} style={button}>
            View Session Recap →
          </Link>
          <Hr style={hr} />
          <Text style={footer}>Parent Coaching with Marissa</Text>
        </Container>
      </Body>
    </Html>
  )
}

SessionShared.PreviewProps = {
  clientName: 'Sarah Johnson',
  sessionDate: 'April 22, 2025',
  actionItemCount: 3,
  portalUrl: 'https://parentcoaching.vercel.app/portal/sessions',
} satisfies Props

export default SessionShared

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: '12px 0' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', margin: '20px 0', borderLeft: '3px solid #2D5016' }
const cardText = { color: '#2D5016', fontSize: '14px', lineHeight: '1.6', margin: 0 }
const button = { backgroundColor: '#2D5016', color: '#fff', borderRadius: '8px', padding: '12px 20px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', margin: '8px 0' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
