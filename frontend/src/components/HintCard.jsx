export default function HintCard({ revealed, onClick, label, content }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer select-none p-4 md:p-6 rounded-xl shadow-md w-32 h-32 md:w-36 md:h-36 flex flex-col justify-center items-center mx-auto ${
        revealed ? 'bg-[#2D2D59] text-[#F0E6D2]' : 'bg-[#1C1C40] text-gray-300 hover:bg-[#2A2A55]'
      } transition-all duration-300 border-2 border-transparent hover:border-[#C8AA6E]`}
    >
      <p className="text-sm font-bold mb-2 text-center">{label}</p>
      <p className="text-xl font-semibold text-[#F0E6D2] text-center">{revealed ? content : '❓'}</p>
    </div>
  );
}