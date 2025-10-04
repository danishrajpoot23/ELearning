const TestCard = ({ id, image, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#0d2d5a] rounded-xl overflow-hidden transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Image Section */}
      <img
        src={image}
        alt={title}
        className="h-[170px] w-full object-cover"
      />

      {/* Title Section */}
      <div className="p-3 text-center">
        <h5 className="text-lg font-semibold text-white">{title}</h5>
      </div>
    </div>
  );
};

export default TestCard;
