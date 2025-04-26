function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 space-y-8">
      {/* 1. Flexbox Center */}
      <div className="flex justify-center w-full border-2 border-red-500 p-4">
        <h1 className="text-3xl">🏀 Flexbox Center</h1>
      </div>

      {/* 2. Text-Center Class */}
      <div className="text-center w-full border-2 border-green-500 p-4">
        <h1 className="text-3xl">🏀 Text Center Class</h1>
      </div>

      {/* 3. Inline Margin Auto */}
      <div className="w-full border-2 border-blue-500 p-4">
        <h1 className="text-3xl" style={{ margin: "0 auto", width: "fit-content" }}>
          🏀 Margin Auto Inline
        </h1>
      </div>

      {/* 4. Absolute Center with Transform */}
      <div className="relative w-full h-32 border-2 border-yellow-500">
        <h1 className="text-3xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          🏀 Absolute Center Transform
        </h1>
      </div>

      {/* 5. Fixed Width Container Center */}
      <div className="w-[640px] mx-auto border-2 border-purple-500 p-4">
        <h1 className="text-3xl text-center">🏀 Fixed Width Center</h1>
      </div>
    </div>
  );
}

export default App;
