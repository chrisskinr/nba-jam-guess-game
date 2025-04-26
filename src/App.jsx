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
        setIsCorrect(false);
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
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-purple-900 to-black text-white p-6 font-mono"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <div className="w-full max-w-xl space-y-6">

        {/* Title */}
        <h1 className="text-3xl text-center mb-2 tracking-widest animate-pulse">
          🏀 NBA JAM GUESS GAME 🔥
        </h1>

        {/* Scoreboard */}
        <div className="text-center bg-gray-900 p-4 rounded-xl shadow-lg border-4 border-indigo-500">
          <div>Total Points: {totalPoints}</div>
          <div>Avg Points/Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
        </div>

        {/* Year Filters */}
        <div className="flex flex-wrap justify-center gap-3">
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
              className={`px-3 py-2 rounded-md shadow-md transition-all duration-200 ${
                draftYearCutoff === year ? "bg-green-400 scale-105" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Top X */}
        <div className="flex justify-center items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={topXEnabled}
              onChange={(e) => setTopXEnabled(e.target.checked)}
            />
            <span className="text-xs">Top X Only</span>
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

        {/* Player Stats */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-inner border-4 border-blue-500">
          <h2 className="text-xl text-center mb-4">Career Averages</h2>
          <ul className="space-y-2 text-lg text-center">
            {Object.entries(player.stats).map(([key, value]) => (
              <li key={key}>
                {key}: {value ?? "N/A"}
              </li>
            ))}
          </ul>

          {/* NEW: Always Show Draft Info */}
          <div className="mt-6 text-center space-y-2">
            <div>🗓️ Draft Year: {player.clues?.draftYear ?? "?"}</div>
            <div>🏅 Draft Pick: {player.clues?.draftPick ?? "?"}</div>
          </div>
        </div>

        {/* Guess Input */}
        {!gameOver && (
          <div className="flex justify-center mb-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Last name..."
              className="px-4 py-2 rounded-l-xl text-black w-64 border border-gray-300"
            />
            <button
              onClick={handleSubmit}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-r-xl font-bold transition-transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        )}

        {/* Reveal Clue */}
        {!gameOver && clueIndex < 3 && (
          <div className="text-center">
            <button
              onClick={revealClue}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105"
            >
              Reveal Clue
            </button>
          </div>
        )}

        {/* Additional Clues */}
        {player.clues && (
          <div className="bg-gray-700 p-4 rounded-lg border-4 border-purple-500 animate-fade-in">
            <h3 className="text-xl mb-2">More Clues</h3>
            <ul className="list-disc pl-6 text-sm space-y-1">
              {Object.entries(player.clues)
                .slice(2, clueIndex + 2)
                .map(([label, value], index) => (
                  <li key={index}>
                    {label.charAt(0).toUpperCase() + label.slice(1)}: {value}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Results with Animations */}
        {gameOver && (
          <div className={`text-center mt-4 text-xl font-bold ${
            isCorrect ? "animate-bounce text-green-400" : "animate-shake text-red-400"
          }`}>
            {isCorrect ? (
              `🔥 Correct! ${score} points!`
            ) : (
              `❌ The answer was ${player.name}`
            )}
          </div>
        )}

        {/* Next Player */}
        {gameOver && (
          <div className="text-center mt-2">
            <button
              onClick={nextPlayer}
              className="mt-2 bg-green-400 hover:bg-green-300 text-black px-6 py-2 rounded-full font-bold transition-transform hover:scale-105"
            >
              Next Player
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
