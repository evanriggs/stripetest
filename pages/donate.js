import Head from 'next/head'
import DonationForm from '../components/DonationForm'

export default function Donate() {
  return (
    <>
      <Head>
        <title>Donate - The Foundation for American Innovation</title>
        <meta name="description" content="Make a donation to support The Foundation for American Innovation. Choose between one-time or recurring monthly donations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Make a Donation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your generous contribution helps The Foundation for American Innovation continue our mission 
              to advance innovation and progress across America.
            </p>
          </div>

          <DonationForm />
        </div>
      </div>
    </>
  )
} 