import { useEffect, useState } from 'react';
import './index.css';
import HintCard from './components/HintCard';
import ChampionAutocomplete from './components/ChampionAutocomplete';

function App() {
  const [step, setStep] = useState(0);
  const [championData, setChampionData] = useState(null);
  const [lastChampionId, setLastChampionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allChampions, setAllChampions] = useState([]);
  const [guess, setGuess] = useState('');
  const [correct, setCorrect] = useState(false);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [revealedSpells, setRevealedSpells] = useState([false, false, false, false]);

  useEffect(() => {
    const getChampions = async () => {
      try {
        const version = '13.24.1';
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
        const json = await response.json();
        const champs = Object.values(json.data).map(c => ({
          name: c.name,
          id: c.id,
          icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.image.full}`
        }));
        setAllChampions(champs);
      } catch (err) {
        console.error('Error al traer los campeones:', err);
      }
    };

    getChampions();
  }, []);

  const getNewChampion = async (avoidRepeat = false) => {
    setLoading(true);
    let champ;

    do {
      const res = await fetch('http://localhost:3001/api/challenge');
      const data = await res.json();
      champ = data;
    } while (avoidRepeat && champ.id === lastChampionId);

    setChampionData(champ);
    setGuess('');
    setCorrect(false);
    setError(false);
    setRevealed([false, false, false]);
    setRevealedSpells([false, false, false, false]);
    setLastChampionId(champ.id);
    setLoading(false);
  };

  const handleStart = () => {
    getNewChampion().then(() => setStep(1));
  };

  const handleGuess = () => {
    if (!championData) return;

    const guessedCorrectly = guess.toLowerCase() === championData.name.toLowerCase();

    setCorrect(guessedCorrectly);
    setError(!guessedCorrectly);

    if (guessedCorrectly) {
      if (step === 1) {
        getNewChampion(true).then(() => {
          setRevealed([true, false, false]);
          setStep(2);
        });
      } else if (step === 2) {
        getNewChampion(true).then(() => setStep(3));
      } else {
        setStep(4);
      }
    } else if (step === 2) {
      const next = revealed.findIndex(r => !r);
      if (next !== -1) {
        const updated = [...revealed];
        updated[next] = true;
        setRevealed(updated);
      }
    }
  };

  const revealSpellCard = (i) => {
    const updated = [...revealedSpells];
    updated[i] = true;
    setRevealedSpells(updated);
  };

  return (
    <div
      className="min-h-screen text-[#F0E6D2] font-[Beaufort] flex items-center justify-center px-4 py-8 bg-cover bg-center text-lg md:text-xl"
      style={{ backgroundImage: 'url(/lol.jpg)' }}
    >
      <div className="relative w-full max-w-[95%] md:max-w-2xl">
        <img
          src="/lolguess.png"
          alt="LoL Guess Logo"
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-60 h-60 z-30 object-contain"
        />
        <div className="bg-[#1C1C40]/80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg w-full text-center">
          {step === 0 && (
            <>
              <p className="mb-8">
                Bienvenido a <strong>LoL Guess</strong>, el juego para adivinar campeones de League of Legends. Vas a tener que usar pistas como frases, regiones y habilidades para descubrir quién es.
              </p>
              <button
                onClick={handleStart}
                className="bg-[#C8AA6E] hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition duration-200 text-lg"
              >
                Comenzar
              </button>
            </>
          )}

          {[1, 2, 3].includes(step) && championData && (
            <>
              {step === 1 && (
                <>
                  <h2 className="text-3xl font-bold mb-6">Pista 1: Lore</h2>
                  <p className="italic mb-8 text-lg md:text-xl">"{championData.lore}"</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-3xl font-bold mb-6">Pista 2: Cartas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <HintCard revealed={revealed[0]} label="Región" content={championData.region} />
                    <HintCard revealed={revealed[1]} label="Rol" content={championData.tags[0]} />
                    <HintCard revealed={revealed[2]} label="Letra" content={championData.name.charAt(0)} />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <h2 className="text-3xl font-bold mb-6">Pista 3: Habilidades</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-6">
                    {championData.spells.map((spell, index) => (
                      <HintCard
                        key={index}
                        revealed={revealedSpells[index]}
                        onClick={() => revealSpellCard(index)}
                        label={`Habilidad ${['Q', 'W', 'E', 'R'][index]}`}
                        content={<img src={spell.image} alt={spell.name} className="w-14 h-14" />}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="mt-6">
                <ChampionAutocomplete
                  champions={allChampions}
                  value={guess}
                  onChange={setGuess}
                  onSelect={setGuess}
                  inputClass="text-[#F0E6D2] bg-[#1C1C40]/70 backdrop-blur-md text-center px-4 py-3 rounded-lg w-full max-w-xs mx-auto text-lg"
                />
                <button
                  onClick={handleGuess}
                  className="bg-[#C8AA6E] hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition duration-200 mt-4 text-lg"
                >
                  Adivinar
                </button>
                {correct && <p className="mt-4 text-green-400 font-semibold text-lg">Correcto</p>}
                {error && <p className="mt-4 text-red-400 font-semibold text-lg">Incorrecto</p>}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-4xl mb-6 font-bold">¡Juego completado!</h2>
              <button
                onClick={() => {
                  setStep(0);
                  setLastChampionId(null);
                }}
                className="bg-[#C8AA6E] hover:bg-yellow-600 text-black px-8 py-4 rounded-lg mt-4 font-semibold transition duration-200 text-lg"
              >
                Volver al inicio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
