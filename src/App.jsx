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
      className="min-h-screen flex justify-center items-center bg-black text-white"
      style={{
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div className="flex flex-col items-center border-4 border-white p-4 w-full max-w-2xl">

        {/* Title */}
        <div className="border-2 border-white w-full text-center p-4 mb-4">
          <h1 className="text-2xl">
            🏀 NBA JAM GUESS GAME v6 🔥
          </h1>
        </div>

        {/* Scoreboard */}
        <div className="border-2 border-white w-full text-center p-4 mb-4">
          <div>Total Points: {totalPoints}</div>
          <div>Avg Points/Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
        </div>

        {/* Career Averages */}
        <div className="border-2 border-white w-full text-center p-4 mb-4">
          <h2 className="text-xl mb-2">Career Averages</h2>
          <ul className="space-y-1">
            {Object.entries(player.stats).map(([key, value]) => (
              <li key={key}>
                {key}: {value ?? "N/A"}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            🗓️ Draft Year: {player.clues?.draftYear ?? "?"} | 🏅 Pick: {player.clues?.draftPick ?? "?"}
          </div>
        </div>

        {/* Guess Input */}
        {!gameOver && (
          <div className="border-2 border-white w-full text-center p-4 mb-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Last name..."
              className="px-4 py-2 rounded-l text-black w-64"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-r bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
            >
              Submit
            </button>
          </div>
        )}

        {/* Reveal Clue */}
        {!gameOver && clueIndex < 3 && (
          <div className="border-2 border-white w-full text-center p-4 mb-4">
            <button
              onClick={revealClue}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded font-bold"
            >
              Reveal Clue
            </button>
          </div>
        )}

        {/* Additional Clues */}
        {player.clues && (
          <div className="border-2 border-white w-full text-center p-4 mb-4">
            {clueIndex >= 1 && <div>🏀 Draft Team: {player.clues.draftTeam}</div>}
          </div>
        )}

        {/* Results */}
        {gameOver && (
          <div className="border-2 border-white w-full text-center p-4 mb-4">
            {isCorrect ? (
              <div className="text-green-400 font-bold animate-bounce">
                🔥 Correct! {score} points!
              </div>
            ) : (
              <div className="text-red-400 font-bold">
                ❌ The answer was {player.name}
              </div>
            )}
            <button
              onClick={nextPlayer}
              className="mt-4 bg-green-400 hover:bg-green-300 text-black px-6 py-2 rounded font-bold"
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
