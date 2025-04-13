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

  const [topXEnabled, setTopXEnabled] = useState(false);
  const [topX, setTopX] = useState(100);

  const [totalPoints, setTotalPoints] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Load players.json
  useEffect(() => {
    fetch("/players.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
  }, []);

  // Filter top X players by total stats (PTS + REB + AST)
  useEffect(() => {
    if (!players.length) return;

    let result = [...players];

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
  }, [players, topXEnabled, topX]);

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
        setTotalPoints((prev) => prev);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white p-8 font-mono">
      {/* Top X Toggle */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={topXEnabled}
            onChange={(e) => setTopXEnabled(e.target.checked)}
          />
          <span className="text-sm">Top X Players Only</span>
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

      <h1 className="text-4xl text-center mb-2">🏀 NBA Jam Guess Game 🔥</h1>

      {/* Score Summary */}
      <div className="text-center text-sm text-gray-300 mb-6">
        <div>Total Points: {totalPoints}</div>
        <div>Average Per Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
      </div>

      {/* Player Stats */}
      <div className="bg-gray-800 p-4 rounded-xl max-w-md mx-auto mb-6 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Career Averages</h2>
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
            placeholder="Guess the last name..."
            className="px-4 py-2 rounded-l-lg text-black w-64"
          />
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-black px-4 py-2 rounded-r-lg hover:bg-yellow-300 font-bold"
          >
            Submit
          </button>
        </div>
      )}

      {/* Reveal Clue Button */}
      {!gameOver && clueIndex < 3 && (
        <div className="text-center mb-6">
          <button
            onClick={revealClue}
            className="bg-blue-400 hover:bg-blue-300 text-black px-6 py-2 rounded-full font-bold"
          >
            Reveal Clue
          </button>
        </div>
      )}

      {/* Clues */}
      {player.clues && (
        <div className="bg-gray-700 max-w-md mx-auto p-4 rounded-lg shadow-md">
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

      {/* Result */}
      {gameOver && (
        <div className="text-center mt-6 text-xl font-bold">
          {isCorrect
            ? `🔥 Correct! You scored ${score} points.`
            : `❌ Out of guesses. The answer was ${player.name}.`}
        </div>
      )}

      {/* Next Player Button */}
      {gameOver && (
        <div className="text-center mt-4">
          <button
            onClick={nextPlayer}
            className="mt-2 bg-green-400 hover:bg-green-300 text-black px-6 py-2 rounded-full font-bold"
          >
            Next Player
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
