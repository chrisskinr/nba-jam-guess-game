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

  const [totalPoints, setTotalPoints] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  useEffect(() => {
    fetch("/players.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
  }, []);

  useEffect(() => {
    if (!players.length) return;
    setFilteredPlayers(players);
    setPlayer(players[Math.floor(Math.random() * players.length)]);
  }, [players]);

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
        setIsCorrect(false);
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
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading player data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="w-[500px] border-8 border-white bg-black p-6 flex flex-col items-center space-y-6 text-center">

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-wide animate-pulse">
          🏀 NBA JAM GUESS GAME v9 🔥
        </h1>

        {/* Scoreboard */}
        <div className="border-2 border-white rounded p-4 w-full">
          <div>Total Points: {totalPoints}</div>
          <div>Avg Points/Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
        </div>

        {/* Career Averages */}
        <div className="border-2 border-white rounded p-4 w-full">
          <h2 className="text-xl uppercase font-bold mb-2">Career Averages</h2>
          <ul className="space-y-1">
            {Object.entries(player.stats).map(([key, value]) => (
              <li key={key}>
                {key}: {value ?? "N/A"}
              </li>
            ))}
          </ul>
        </div>

        {/* Draft Info */}
        <div className="text-sm text-white">
          🗓️ Draft Year: {player.clues?.draftYear ?? "?"} | 🏅 Pick: {player.clues?.draftPick ?? "?"}
        </div>

        {/* Guess Input */}
        {!gameOver && (
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Last name..."
              className="px-4 py-2 rounded-l text-black w-48"
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
          <button
            onClick={revealClue}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded font-bold"
          >
            Reveal Clue
          </button>
        )}

        {/* Additional Clues */}
        {clueIndex > 0 && (
          <div className="border-2 border-purple-400 rounded p-4 w-full">
            <h3 className="font-bold text-lg mb-2">Clue Unlocked:</h3>
            <div>{player.clues?.draftTeam ?? "???"}</div>
          </div>
        )}

        {/* Results */}
        {gameOver && (
          <div className="border-2 border-white p-4 rounded w-full">
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
