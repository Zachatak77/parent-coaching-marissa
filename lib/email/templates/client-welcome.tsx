import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  clientName: string
  setPasswordUrl: string
  packageLabel: string
}

export function ClientWelcome({ clientName, setPasswordUrl, packageLabel }: Props) {
  const firstName = clientName.split(' ')[0]
  return (
    <Html>
      <Head />
      <Preview>Welcome to Parent Coaching with Marissa — set up your account.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {firstName}!</Heading>
          <Text style={text}>
            I&apos;m so excited to work with you on the <strong>{packageLabel}</strong>. Your parent portal is ready —
            this is where you&apos;ll find your coaching plan, session notes, and resources throughout our work together.
          </Text>
          <Section style={card}>
            <Text style={cardText}>To access your portal, first set your password by clicking the button below.</Text>
            <Link href={setPasswordUrl} style={button}>
              Set My Password →
            </Link>
            <Text style={expireNote}>This link expires in 24 hours.</Text>
          </Section>
          <Text style={text}>
            Once you&apos;re in, take a look around and complete your intake form when you have a few minutes.
            It helps me understand your family&apos;s situation before our first session.
          </Text>
          <Text style={text}>
            Looking forward to getting started!
            <br />
            — Marissa
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Questions? Reach me at{' '}
            <Link href="mailto:parentcoachwithmarissa@gmail.com" style={footerLink}>
              parentcoachwithmarissa@gmail.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

ClientWelcome.PreviewProps = {
  clientName: 'Sarah Johnson',
  setPasswordUrl: 'https://parentcoaching.vercel.app/auth/confirm?token=abc',
  packageLabel: 'Parent Coaching Partnership',
} satisfies Props

export default ClientWelcome

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: '12px 0' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', margin: '20px 0' }
const cardText = { color: '#2D5016', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }
const button = { backgroundColor: '#2D5016', color: '#fff', borderRadius: '8px', padding: '12px 20px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const expireNote = { color: '#2D5016', opacity: 0.5, fontSize: '12px', margin: '12px 0 0' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
const footerLink = { color: '#2D5016', fontWeight: '600' }
