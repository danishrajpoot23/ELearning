import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const allTestimonials = [
    {
      id: 1,
      name: "David Wagaba",
      quote:
        "Thank you so much for the IELTS online mock tests as they really helped me to achieve a Band 7.5 on my first attempt at the IELTS test. The...",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Quoc Tran Anh Le",
      quote:
        "I have nothing to say but a brief thanks to Ielts Online Tests for helping me with my road to achieving success in the IELTS test. I've...",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      id: 3,
      name: "Rafi Refinaldi",
      quote:
        "Alhamdulillah! I want to thank IELTS Online Test for helping me get my score higher, especially on listening and reading skills! I only...",
      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
    },
    {
      id: 4,
      name: "SOLOMON BILLA",
      quote:
        "Hello, I send this message to tell the entire iot team of my success in the IELTS academic exam in Ghana. To have such...",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
      id: 5,
      name: "Elizabeth",
      quote:
        "I am really grateful to the creators of this website for their efforts to teach us free of cost. The mock tests and sample tests...",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 6,
      name: "Smith",
      quote:
        "Thank u guys for the website which delivered me an opportunity to enhance my English in a quite short period of time, because of you...",
      avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(allTestimonials.length / testimonialsPerPage);

  const currentTestimonials = allTestimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <section className="py-16 px-4 bg-[#f8faff] text-center">
      <div className="max-w-[1100px] mx-auto">
        {/* Heading */}
        <h2 className="text-[2.2rem] md:text-[2rem] sm:text-[1.75rem] font-medium text-gray-800 mb-12">
          What IELTS test takers say about us
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full max-w-[300px] flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="w-24 h-24 md:w-20 md:h-20 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <div className="mt-3 font-semibold text-gray-800 text-[1.1rem] sm:text-[1rem]">
                {testimonial.name}
              </div>

              {/* Quote */}
              <div className="mt-2 italic text-gray-600 text-[1rem] sm:text-[0.9rem] leading-relaxed max-w-[250px]">
                "{testimonial.quote}"
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-10 sm:mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              className={`w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentPage ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => handlePageChange(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
