import { Layout } from '@/components/layout'
import {
  Hero,
  Services,
  Doctors,
  BeforeAfter,
  Reviews,
  Location,
  Booking,
  FAQ,
} from '@/components/sections'

export function Home() {
  return (
    <Layout>
      <Hero />
      <Services />
      <Doctors />
      <BeforeAfter />
      <Reviews />
      <Location />
      <Booking />
      <FAQ />
    </Layout>
  )
}
