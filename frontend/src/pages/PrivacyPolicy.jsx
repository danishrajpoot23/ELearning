import React from "react";
import sideImage from "../assets/images/side-ad.png";

function PrivacyPolicy() {
  return (
   <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto my-8 gap-8 px-4 pt-[100px]">

      {/* Main content */}
      <div className="flex-2 bg-white p-4 leading-relaxed text-gray-800 rounded-md shadow-sm">
        <div className="text-sm text-gray-500 mb-4">Home / Privacy Policy</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <p className="mb-4 text-lg">
          At IELTS Online Tests (by InterGreat Education Group), we value your
          privacy and are committed to protecting your personal data. This
          Privacy Policy explains how we collect, use, and safeguard the
          information you provide when using our website, services, and related
          applications (collectively, the "Websites").
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          1. Information We Collect
        </h2>
        <p className="mb-3">We may collect the following types of information about you:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Personal information (such as name, email, phone number)</li>
          <li>Account details you provide during registration</li>
          <li>Usage data such as pages visited, time spent, and interactions</li>
          <li>Device and browser information (IP address, cookies, location)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          2. How We Use Your Information
        </h2>
        <p className="mb-3">Your personal data is used for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>To provide and improve our online test services</li>
          <li>To personalize your learning experience</li>
          <li>To send important updates, newsletters, or offers</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          3. Information Submitted by You
        </h2>
        <p className="mb-4">
          Any information you provide, such as answers in tests, feedback, or
          uploaded documents, will only be used to deliver services and improve
          your experience. We do not share your submissions with unauthorized
          third parties.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          4. Data Sharing and Disclosure
        </h2>
        <p className="mb-3">
          We do not sell or rent your personal data. However, we may share your
          information with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Educational institutions (if you apply through our platform)</li>
          <li>Trusted partners and service providers</li>
          <li>Legal authorities, when required by law</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          5. Data Retention
        </h2>
        <p className="mb-4">
          We retain your personal data only as long as necessary to provide our
          services or as required by law. You may request deletion of your
          account and associated data anytime.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          6. Cookies and Tracking
        </h2>
        <p className="mb-4">
          We use cookies and similar technologies to analyze website traffic,
          enhance user experience, and provide personalized content. You may
          choose to disable cookies in your browser settings.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          7. Your Rights
        </h2>
        <p className="mb-3">
          Depending on your location, you may have the following rights regarding
          your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Right to access and request a copy of your data</li>
          <li>Right to update or correct inaccurate information</li>
          <li>Right to request deletion ("Right to be forgotten")</li>
          <li>Right to opt-out of marketing communications</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          8. Security
        </h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your data
          from unauthorized access, disclosure, alteration, or destruction.
          However, no method of transmission over the Internet is completely
          secure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          9. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated "Last Updated" date.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          10. Contact Us
        </h2>
        <p className="mb-2">If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
        <p className="mb-4">
          Email: <span className="font-medium">support@ieltsonlinetests.com</span> <br />
          Phone: <span className="font-medium">+44-123-456-789</span>
        </p>
      </div>

      {/* Side image */}
      <div className="flex-1 flex justify-center items-start">
        <img
          src={sideImage}
          alt="Advertisement"
          className="max-w-full rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
