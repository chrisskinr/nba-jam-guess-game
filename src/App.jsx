function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      
      {/* Architect 1 - Flexbox Center */}
      <div className="min-h-[200px] flex justify-center items-center border-2 border-red-500">
        <div>🏀 Flexbox Center</div>
      </div>

      {/* Architect 2 - Grid Center */}
      <div className="min-h-[200px] grid place-items-center border-2 border-green-500">
        <div>🏀 Grid Place-Items Center</div>
      </div>

      {/* Architect 3 - Margin Auto */}
      <div className="min-h-[200px] border-2 border-blue-500 flex items-start">
        <div style={{ margin: "0 auto", marginTop: "40px", width: "fit-content" }}>
          🏀 Margin Auto Hack
        </div>
      </div>

      {/* Architect 4 - Absolute Position */}
      <div className="relative min-h-[200px] border-2 border-yellow-500">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          🏀 Absolute Transform Center
        </div>
      </div>

      {/* Architect 5 - Flexbox Column */}
      <div className="min-h-[200px] flex flex-col justify-center items-center border-2 border-pink-500">
        <div>🏀 Flexbox Column Center</div>
      </div>

      {/* Architect 6 - Fixed Screen Inset */}
      <div className="relative min-h-[200px] border-2 border-purple-500">
        <div className="fixed inset-0 flex justify-center items-center">
          <div>🏀 Fixed Inset Center</div>
        </div>
      </div>

      {/* Architect 7 - Inline Block */}
      <div className="min-h-[200px] text-center flex justify-center items-center border-2 border-cyan-500">
        <span className="inline-block">🏀 Inline Block Center</span>
      </div>

      {/* Architect 8 - Vanilla CSS Flex */}
      <div style={{
        height: "200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid orange"
      }}>
        🏀 Vanilla CSS Flex Center
      </div>

      {/* Architect 9 - Fixed Width Container */}
      <div className="min-h-[200px] flex justify-center items-center border-2 border-lime-500">
        <div className="w-[300px] text-center">🏀 Fixed Width Box Center</div>
      </div>

      {/* Architect 10 - HTML <center> (Bad Boy) */}
      <div className="min-h-[200px] bg-gray-700 border-2 border-white">
        <center style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          🏀 Center Tag Cheat
        </center>
      </div>

    </div>
  );
}

export default App;
