import React from "react";
import labels from "../assets/images/labels.png";

const Partner = () => {
  return (
    <section className="bg-white my-20 mx-6 md:mx-36">
      <div className="p-12">
        <h1 className="text-[40px] md:text-[50px] font-bold font-sans text-navy-900 text-center md:text-left">
          Partners
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mt-10">
          {/* Left Content */}
          <div className="flex-1">
            <p className="text-[18px] leading-relaxed pt-6 font-light font-sans text-gray-800">
              IELTS Online IOT has reached extensive cooperation with overseas
              institutions, international education non-profit organizations and
              IELTS test bureaus to provide a brand new IELTS learning platform
              for IELTS students around the world.
            </p>
          </div>

          {/* Right Labels */}
          <div className="flex-[2]">
            <img
              src={labels}
              alt="partners"
              className="w-full h-auto block mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partner;
