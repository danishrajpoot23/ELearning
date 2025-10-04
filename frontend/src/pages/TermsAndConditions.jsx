import React from "react";
import sideImage from "../assets/images/side-ad.png";

function TermsAndConditions() {
  return (
   <div className="flex flex-col md:flex-row gap-6 p-6 pt-[100px] bg-[#1c1c1c] text-gray-300">

      {/* Main content */}
      <div className="flex-3 bg-[#2a2a2a] p-6 rounded-lg">
        <div className="text-sm text-gray-400 mb-4">Home / Terms & Conditions</div>
        <h1 className="text-2xl font-bold text-white mb-4">Terms and Conditions</h1>

        <p className="text-lg leading-relaxed mb-4">
          Welcome to our website. By accessing or using our platform, you agree
          to be bound by these Terms and Conditions. If you do not agree with
          any part of the terms, please do not continue to use our services.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          1. Acceptance of Terms
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          By registering, accessing, or using our services, you confirm that
          you have read, understood, and agree to these Terms. We reserve the
          right to update these terms from time to time, and it is your
          responsibility to review them regularly.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          2. Use of Services
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          You agree to use our services only for lawful purposes and in a way
          that does not infringe the rights of, restrict or inhibit anyone
          else's use and enjoyment of the website. Prohibited behavior includes
          harassing, causing distress, or transmitting obscene or offensive content.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          3. Intellectual Property
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          All content, logos, trademarks, and data on this website are owned by
          or licensed to us. Unauthorized copying, distribution, or use of any
          material is strictly prohibited without prior written permission.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          4. User Accounts
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for safeguarding your
          password and for any activities or actions under your account.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          5. Limitation of Liability
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          We are not liable for any direct, indirect, incidental, or
          consequential damages that may result from your use of our services.
          While we strive to provide accurate information, we cannot guarantee
          its completeness or reliability.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          6. Governing Law
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          These Terms shall be governed and construed in accordance with the
          laws of your local jurisdiction. Any disputes will be subject to the
          exclusive jurisdiction of the courts in that region.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          7. Changes to Terms
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          We may revise these Terms and Conditions at any time without notice.
          By continuing to use our services, you agree to be bound by the updated terms.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">
          8. Contact Information
        </h2>
        <p className="text-lg leading-relaxed">
          If you have any questions about these Terms, please contact us at{" "}
          <strong>support@example.com</strong>.
        </p>
      </div>

      {/* Side image */}
      <div className="flex-1 flex justify-center items-start">
        <img
          src={sideImage}
          alt="Advertisement"
          className="max-w-full rounded-lg"
        />
      </div>
    </div>
  );
}

export default TermsAndConditions;
