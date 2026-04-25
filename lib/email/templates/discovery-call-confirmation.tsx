import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name: string
  mainConcern: string
}

export function DiscoveryCallConfirmation({ name, mainConcern }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your discovery call request has been received.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re on the list, {name}.</Heading>
          <Text style={text}>
            Thank you for reaching out! I&apos;ve received your request for a free discovery call and will be in touch
            within 24–48 hours to schedule a time that works for you.
          </Text>
          <Section style={card}>
            <Text style={label}>What you shared:</Text>
            <Text style={text}>&ldquo;{mainConcern}&rdquo;</Text>
          </Section>
          <Text style={text}>
            In the meantime, if you have any questions, feel free to reply to this email or reach me at{' '}
            <Link href="mailto:parentcoachwithmarissa@gmail.com" style={link}>
              parentcoachwithmarissa@gmail.com
            </Link>
            .
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Marissa Schattner · Parent Coaching</Text>
        </Container>
      </Body>
    </Html>
  )
}

DiscoveryCallConfirmation.PreviewProps = {
  name: 'Sarah',
  mainConcern: 'My 7-year-old has intense meltdowns and I feel completely lost.',
} satisfies Props

export default DiscoveryCallConfirmation

const body = { backgroundColor: '#F5F0E8', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '520px', margin: '40px auto', padding: '0 20px' }
const h1 = { color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#2D5016', fontSize: '15px', lineHeight: '1.6', margin: '12px 0' }
const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', margin: '20px 0', borderLeft: '3px solid #2D5016' }
const label = { color: '#2D5016', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }
const link = { color: '#2D5016', fontWeight: '600' }
const hr = { borderColor: '#2D5016', opacity: 0.15, margin: '24px 0' }
const footer = { color: '#2D5016', opacity: 0.5, fontSize: '12px' }
