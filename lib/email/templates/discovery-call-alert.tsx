import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name: string
  email: string
  phone?: string | null
  childAges: string
  mainConcern: string
  howTheyHeard?: string | null
}

export function DiscoveryCallAlert({ name, email, phone, childAges, mainConcern, howTheyHeard }: Props) {
  return (
    <Html>
      <Head />
      <Preview>New discovery call request from {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>New Discovery Call Request</Heading>
          <Section style={card}>
            <Row label="Name" value={name} />
            <Row label="Email" value={email} />
            {phone && <Row label="Phone" value={phone} />}
            <Row label="Child Ages" value={childAges} />
            <Row label="How They Heard" value={howTheyHeard ?? '—'} />
          </Section>
          <Text style={sectionLabel}>What They Shared</Text>
          <Section style={quoteBox}>
            <Text style={quoteText}>&ldquo;{mainConcern}&rdquo;</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Parent Coaching with Marissa — Dashboard Notification</Text>
        </Container>
      </Body>
    </Html>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={rowText}>
      <span style={rowLabel}>{label}: </span>{value}
    </Text>
  )
}

DiscoveryCallAlert.PreviewProps = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '555-1234',
  childAges: '5 and 8',
  mainConcern: 'Struggling with bedtime battles and morning chaos.',
  howTheyHeard: 'Instagram',
} satisfies Props

export default DiscoveryCallAlert

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }
const rowText = { margin: '6px 0', fontSize: '14px', color: '#2D5016' }
const rowLabel = { fontWeight: '600' }
const sectionLabel = { color: '#2D5016', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '20px 0 6px' }
const quoteBox = { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', borderLeft: '3px solid #2D5016' }
const quoteText = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
