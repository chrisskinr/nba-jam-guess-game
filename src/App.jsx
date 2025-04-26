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
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
      <div className="w-[640px] border-8 border-white p-6 bg-black flex flex-col space-y-6">

        {/* Title */}
        <div style={{ margin: "0 auto", width: "fit-content" }}>
          <h1 className="text-4xl text-center animate-pulse">
            🏀 NBA JAM GUESS GAME v8 🔥
          </h1>
        </div>

        {/* Scoreboard */}
        <div className="border-2 border-white p-4" style={{ margin: "0 auto", width: "fit-content" }}>
          <div>Total Points: {totalPoints}</div>
          <div>Avg Points/Round: {roundsPlayed > 0 ? (totalPoints / roundsPlayed).toFixed(2) : "-"}</div>
        </div>

        {/* Career Averages */}
        <div className="border-2 border-white p-4 w-full">
          <h2 className="text-2xl text-center mb-2">Career Averages</h2>
          <ul className="text-center space-y-1">
            {Object.entries(player.stats).map(([key, value]) => (
              <li key={key}>
                {key}: {value ?? "N/A"}
              </li>
            ))}
          </ul>
          <div className="mt-2 text-center">
            🗓️ Draft Year: {player.clues?.draftYear ?? "?"} | 🏅 Pick: {player.clues?.draftPick ?? "?"}
          </div>
        </div>

        {/* Guess Input */}
        {!gameOver && (
          <div className="border-2 border-white p-4 flex justify-center items-center">
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
          <div className="border-2 border-white p-4 flex justify-center">
            <button
              onClick={revealClue}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded font-bold"
            >
              Reveal Clue
            </button>
          </div>
        )}

        {/* Clues */}
        {clueIndex > 0 && (
          <div className="border-2 border-white p-4 text-center">
            <div className="text-lg">🏀 Draft Team: {player.clues?.draftTeam ?? "???"}</div>
          </div>
        )}

        {/* Results */}
        {gameOver && (
          <div className="border-2 border-white p-4 text-center">
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
