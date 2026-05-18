import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <p>
            At Jobify Inc., your privacy is our priority. This Privacy Policy outlines how we collect, 
            use, and protect your personal information when you use our services.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile, 
            or apply for a job. This may include your name, email address, resume details, and communication history.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            The information we collect is used to provide, maintain, and improve our services. This includes matching 
            you with relevant job opportunities, communicating with you about your account, and ensuring the security 
            of our platform.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement advanced security measures to safeguard your personal data against unauthorized access, 
            alteration, or disclosure.
          </p>
          <p className="mt-8 text-sm text-gray-500">Last updated: May 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
