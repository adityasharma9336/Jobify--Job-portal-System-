import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        <div className="space-y-6 text-gray-300">
          <p>
            Welcome to Jobify, the premium job portal designed for elite talent and forward-thinking companies. 
            We bridge the gap between exceptional professionals and organizations that value innovation, growth, and excellence.
          </p>
          <p>
            Our mission is to revolutionize the hiring process by utilizing cutting-edge AI-powered matching algorithms, 
            ensuring that candidates find roles that align perfectly with their skills and career aspirations, while 
            employers discover the perfect fit for their teams.
          </p>
          <p>
            Founded in 2026, we have consistently pushed the boundaries of what a modern job platform should be. 
            Join us on our journey to redefine the future of work.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
