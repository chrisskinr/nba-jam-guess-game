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
      setScore(10);
      setIsCorrect(true);
      setGameOver(true);
    } else {
      if (clueIndex < 3) {
        setClueIndex(clueIndex + 1);
      } else {
        setScore(0);
        setIsCorrect(false);
        setGameOver(true);
      }
    }
    setGuess("");
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
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-[640px] border-8 border-white p-6 flex flex-col items-center space-y-6 text-white">

        {/* Title */}
        <div className="text-4xl mb-2 text-center">
          🏀 NBA JAM GUESS GAME v7 🔥
        </div>

        {/* Career Averages */}
        <div className="border-2 border-white p-4 w-full text-center">
          <h2 className="text-2xl mb-2">Career Averages</h2>
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
          <div className="border-2 border-white p-4 w-full flex justify-center items-center">
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
          <div className="border-2 border-white p-4 w-full text-center">
            <button
              onClick={() => setClueIndex(clueIndex + 1)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded font-bold"
            >
              Reveal Clue
            </button>
          </div>
        )}

        {/* Clues */}
        {clueIndex > 0 && (
          <div className="border-2 border-white p-4 w-full text-center">
            <h3 className="text-xl mb-2">Clue</h3>
            <div>{player.clues?.draftTeam ?? "???"}</div>
          </div>
        )}

        {/* Results */}
        {gameOver && (
          <div className="border-2 border-white p-4 w-full text-center">
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
