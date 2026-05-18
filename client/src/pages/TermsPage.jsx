import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-gray-300">
          <p>
            Welcome to Jobify. By accessing or using our website and services, you agree to be bound by these 
            Terms and Conditions. Please read them carefully.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering for an account or using our platform, you acknowledge that you have read, understood, and 
            agree to comply with these Terms.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. User Responsibilities</h2>
          <p>
            You agree to provide accurate and complete information when creating your account and submitting your resume. 
            You are responsible for maintaining the confidentiality of your account credentials and for all activities 
            that occur under your account.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Prohibited Conduct</h2>
          <p>
            You may not use the platform for any illegal or unauthorized purpose. This includes submitting false information, 
            attempting to breach our security systems, or harassing other users.
          </p>
          <p className="mt-8 text-sm text-gray-500">Last updated: May 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
