import React from 'react';
import { motion } from 'framer-motion';

const LegalPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Legal Information</h1>
        <div className="space-y-6 text-gray-300">
          <p>
            This page provides access to important legal information and policies regarding the use of Jobify Inc. 
            services. We are committed to transparency and compliance with all applicable laws and regulations.
          </p>
          <ul className="list-disc list-inside space-y-4 mt-8">
            <li>
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> - Learn how we collect, use, and protect your data.
            </li>
            <li>
              <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> - Read the rules and guidelines for using our platform.
            </li>
            <li>
              <span className="font-semibold text-white">Copyright</span> - All content on this website, including text, graphics, logos, and software, is the property of Jobify Inc. and is protected by international copyright laws.
            </li>
            <li>
              <span className="font-semibold text-white">Disclaimers</span> - The materials on Jobify's website are provided on an 'as is' basis. We make no warranties, expressed or implied.
            </li>
          </ul>
          <p className="mt-8 text-sm text-gray-500">For legal inquiries, please contact our legal team at legal@jobifyportal.inc.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalPage;
