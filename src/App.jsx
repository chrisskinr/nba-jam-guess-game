import { useState, useEffect } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [player, setPlayer] = useState(null);
  const [guess, setGuess] = useState("");
  const [clueIndex, setClueIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [topXEnabled, setTopXEnabled] = useState(true);
  const [topX, setTopX] = useState(100);

  const [totalPoints, setTotalPoints] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const [draftYearCutoff, setDraftYearCutoff] = useState(1980);

  useEffect(() => {
    fetch("/players.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
  }, []);

  useEffect(() => {
    if (!players.length) return;

    let result = [...players];

    if (draftYearCutoff) {
      result = result.filter((p) => p.clues?.draftYear >= draftYearCutoff);
    }

    if (topXEnabled) {
      result.sort((a, b) => {
        const sumA = (a.stats.PTS || 0) + (a.stats.REB || 0) + (a.stats.AST || 0);
        const sumB = (b.stats.PTS || 0) + (b.stats.REB || 0) + (b.stats.AST || 0);
        return sumB - sumA;
      });
      result = result.slice(0, topX);
    }

    setFilteredPlayers(result);
    setPlayer(result[Math.floor(Math.random() * result.length)]);
  }, [players, topXEnabled, topX, draftYearCutoff]);

  const handleSubmit = () => {
    if (!player) return;
    if (guess.trim().toLowerCase() === player.lastName.toLowerCase()) {
      const points = [10, 5, 3, 1][clueIndex];
      setScore(points);
      setIsCorrect(true);
      setGameOver(true);
      setTotalPoints((prev) => prev + points);
      setRoundsPlayed((prev) => prev + 1);
    } else {
      if (clueIndex < 3) {
        setClueIndex(clueIndex + 1);
      } else {
        setScore(0);
        setGameOver(true);
        setRoundsPlayed((prev) => prev + 1);
      }
    }
    setGuess("");
  };

  const revealClue = () => {
    if (clueIndex < 3) {
      setClueIndex(clueIndex + 1);
    }
  };

  const nextPlayer = () => {
    const next = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
    setPlayer(next);
    setGuess("");
    setClueIndex(0);
    setIsCorrect(false);
    setScore(null);
    setGameOver(false);
  };

  if (!player) {
    return <div className="text-white text-center mt-10 text-2xl">Loading player data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-white p-8 font-mono" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {/* Draft Year Filters */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {[
          { label: "All", year: null },
          { label: "1980+", year: 1980 },
          { label: "2000+", year: 2000 },
          { label: "2010+", year: 2010 },
          { label: "2020+", year: 2020 },
        ].map(({ label, year }) => (
          <button
            key={label}
            onClick={() => setDraftYearCutoff(year)}
            className={`px-4 py-2 rounded shadow-md transition-all duration-200 ${
              draftYearCutoff === year ? "bg-green-400 scale-105" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Top X Toggle */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={topXEnabled}
            onChange={(e) => setTopXEnabled(e.target.checked)}
          />
          <span className="text-sm">Top X Only</span>
        </label>

        <input
          type="number"
          min="1"
          max="2000"
          value={topX}
          onChange={(e) => setTopX(parseInt(e.target.value))}
          disabled={!topXEnabled}
          className="w-20 px-2 py-1 text-black rounded"
        />
      </div>

      <h1 className="text-3xl text-center mb-6 tracking-widest animate-pulse">🏀 NBA JAM GUESS GAME 🔥</h1>

      {/* Score Summary */}
      <div className="text-center mb-6 text-sm bg-gray-900 p-4 rounded-xl shadow-inner">
        <div>Total Points: {totalPoints}</div>
        <div>Avg Points/Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
      </div>

      {/* Player Stats Card */}
      <div className="bg-gray-800 p-6 rounded-2xl max-w-md mx-auto mb-6 shadow-lg ring-2 ring-indigo-500">
        <h2 className="text-xl text-center mb-4 tracking-widest">Career Averages</h2>
        <ul className="space-y-2 text-lg">
          {Object.entries(player.stats).map(([key, value]) => (
            <li key={key}>
              {key}: {value ?? "N/A"}
            </li>
          ))}
        </ul>
      </div>

      {/* Guess Input */}
      {!gameOver && (
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Last name..."
            className="px-4 py-2 rounded-l-xl text-black w-64 border border-gray-300"
          />
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-r-xl font-bold transition-transform transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      )}

      {/* Reveal Clue */}
      {!gameOver && clueIndex < 3 && (
        <div className="text-center mb-6">
          <button
            onClick={revealClue}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-full font-bold transition-transform transform hover:scale-105"
          >
            Reveal Clue
          </button>
        </div>
      )}

      {/* Clues Display */}
      {player.clues && (
        <div className="bg-gray-700 max-w-md mx-auto p-4 rounded-lg shadow-lg">
          <h3 className="text-xl mb-2">Clues</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            {Object.entries(player.clues)
              .slice(0, clueIndex)
              .map(([label, value], index) => (
                <li key={index}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}: {value}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Results */}
      {gameOver && (
        <div className="text-center mt-6 text-xl font-bold">
          {isCorrect ? (
            <span className="text-green-400">🔥 Correct! {score} points!</span>
          ) : (
            <span className="text-red-400">❌ The answer was {player.name}</span>
          )}
        </div>
      )}

      {/* Next Player */}
      {gameOver && (
        <div className="text-center mt-4">
          <button
            onClick={nextPlayer}
            className="mt-2 bg-green-400 hover:bg-green-300 text-black px-6 py-2 rounded-full font-bold transition-transform transform hover:scale-105"
          >
            Next Player
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
