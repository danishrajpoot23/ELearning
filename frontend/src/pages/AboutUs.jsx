import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function AboutUs() {
  const { t, i18n } = useTranslation();

  // Function to change language
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      <section className="bg-[#1f3556] text-gray-200 px-6 py-10 max-w-screen min-h-[80vh]">
        <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {/* Links + Selectors */}
          <div className="space-y-6">
            <ul className="list-none text-lg space-y-3">
              <li>
                <Link to="/contact" className="hover:underline">
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link to="/privacypolicy" className="hover:underline">
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  {t("terms_conditions")}
                </Link>
              </li>
            </ul>

            {/* Currency + Language Select */}
            <div className="flex flex-col gap-4 w-40 text-lg">
              <select className="bg-white text-black px-3 py-2 rounded-md border border-gray-300">
                <option>USD $</option>
                <option>PKR ₨</option>
                <option>EUR €</option>
              </select>
              <select
                className="bg-white text-black px-3 py-2 rounded-md border border-gray-300"
                onChange={handleLanguageChange}
                defaultValue={i18n.language}
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>

          {/* About Us + Mission */}
          <div className="space-y-6 md:col-span-2">
            <div>
              <h1 className="text-xl font-semibold text-white mb-2">
                {t("about_us")}
              </h1>
              <p className="text-lg leading-relaxed">
                {t("about_us_text")}
              </p>
            </div>

            <div>
              <h1 className="text-xl font-semibold text-white mb-2">
                {t("our_mission")}
              </h1>
              <p className="text-lg leading-relaxed">
                {t("our_mission_text")}
              </p>
            </div>

            {/* Follow Us */}
            <div className="mt-6">
              <h1 className="text-xl font-semibold text-white mb-2">
                {t("follow_us")}
              </h1>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/ieltsonlinetests/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={30} className="text-[#1877F2]" />
                </a>
                <a
                  href="https://www.youtube.com/intergreateducationgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube size={30} className="text-[#FF0000]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-20 text-sm text-gray-400 border-t border-gray-700 pt-4 text-center">
          {t("footer_text")}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;