import Head from 'next/head'
import ThankYouPage from '../components/ThankYouPage'

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Thank You - The Foundation for American Innovation</title>
        <meta name="description" content="Thank you for your donation to The Foundation for American Innovation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ThankYouPage />
    </>
  )
} 