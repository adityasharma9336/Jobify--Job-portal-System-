import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import SalariesPage from './pages/SalariesPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import MyApplicationsPage from './pages/MyApplicationsPage';
import InterviewsPage from './pages/InterviewsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import MessagesPage from './pages/MessagesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EmployerDashboard from './pages/EmployerDashboard';
import ApplyPage from './pages/ApplyPage';
import PageTransition from './components/layout/PageTransition';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import ContactPage from './pages/ContactPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import JobAlertsPage from './pages/JobAlertsPage';
import CareerTipsPage from './pages/CareerTipsPage';
import CareerTipDetailsPage from './pages/CareerTipDetailsPage';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col relative text-white font-display">
      {/* Background Ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left Purple Orb */}
        <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
        {/* Bottom Right Magenta/Purple Orb */}
        <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
      </div>
      <Header />
      <div className="pt-28 flex-grow flex flex-col w-full">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
      {isLandingPage && <Footer />}
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        {/* ... other routes ... */}
        <Route path="/jobs" element={
          <Layout>
            <JobSearchPage />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <DashboardPage />
          </Layout>
        } />
        <Route path="/employer-dashboard" element={
          <Layout>
            <EmployerDashboard />
          </Layout>
        } />
        <Route path="/companies" element={
          <Layout>
            <CompaniesPage />
          </Layout>
        } />
        <Route path="/companies/:id" element={
          <Layout>
            <CompanyDetailsPage />
          </Layout>
        } />
        <Route path="/salaries" element={
          <Layout>
            <SalariesPage />
          </Layout>
        } />
        <Route path="/signup" element={
          <PageTransition>
            <SignUpPage />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <SignInPage />
          </PageTransition>
        } />
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        <Route path="/profile/:id" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout>
            <AdminDashboardPage />
          </Layout>
        } />
        <Route path="/applications" element={
          <Layout>
            <MyApplicationsPage />
          </Layout>
        } />
        <Route path="/interviews" element={
          <Layout>
            <InterviewsPage />
          </Layout>
        } />
        <Route path="/saved" element={
          <Layout>
            <SavedJobsPage />
          </Layout>
        } />
        <Route path="/messages" element={
          <Layout>
            <MessagesPage />
          </Layout>
        } />
        <Route path="/apply" element={
          <Layout>
            <ApplyPage />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
        <Route path="/features" element={
          <Layout>
            <FeaturesPage />
          </Layout>
        } />
        <Route path="/privacy" element={
          <Layout>
            <PrivacyPage />
          </Layout>
        } />
        <Route path="/terms" element={
          <Layout>
            <TermsPage />
          </Layout>
        } />
        <Route path="/legal" element={
          <Layout>
            <LegalPage />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <ContactPage />
          </Layout>
        } />
        <Route path="/resume-builder" element={
          <ProtectedRoute>
            <Layout>
              <ResumeBuilderPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/job-alerts" element={
          <ProtectedRoute>
            <Layout>
              <JobAlertsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/career-tips" element={
          <ProtectedRoute>
            <Layout>
              <CareerTipsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/career-tips/:id" element={
          <ProtectedRoute>
            <Layout>
              <CareerTipDetailsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <Layout>
            <SupportPage />
          </Layout>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  console.log('App.jsx: Rendering App component');
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
