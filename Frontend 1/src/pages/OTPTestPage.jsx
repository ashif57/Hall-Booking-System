import React from 'react';
import OTPVerification from '../components/OTPVerification';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const OTPTestPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">OTP Verification Test</h1>
        <OTPVerification />
      </main>
      <Footer />
    </div>
  );
};

export default OTPTestPage;