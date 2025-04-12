import { useState, useEffect } from 'react';

export default function ChampionAutocomplete({ champions, value, onChange, onSelect, inputClass = '' }) {
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value === '') {
      const sorted = [...champions].sort((a, b) => a.name.localeCompare(b.name));
      setFiltered(sorted.slice(0, 3));
    } else {
      const matches = champions.filter(c =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(matches);
    }
  }, [value, champions]);

  return (
    <div className="relative w-full max-w-xs text-left mx-auto text-lg">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onClick={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        placeholder="¿Quién es este campeón?"
        className={`text-[#F0E6D2] bg-[#1C1C40]/70 backdrop-blur-md text-center px-5 py-3 rounded-lg w-full text-lg ${inputClass}`}
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-[#1C1C40]/90 backdrop-blur-md border border-[#C8AA6E] mt-2 rounded-lg max-h-60 overflow-auto text-lg">
          {filtered.map(champ => (
            <li
              key={champ.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#2D2D59]"
              onClick={() => {
                onSelect(champ.name);
                setShowDropdown(false);
              }}
            >
              <img src={champ.icon} alt={champ.name} className="w-7 h-7" />
              <span className="text-[#F0E6D2]">{champ.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
