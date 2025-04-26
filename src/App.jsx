function App() {
  return (
    <div className="min-h-screen bg-black text-white text-xl space-y-10 p-10">
      
      {/* 1. Tailwind Flexbox + h-screen (fixed) */}
      <div className="h-screen flex justify-center items-center border-2 border-red-500">
        <div>🏀 1. Flexbox (h-screen)</div>
      </div>

      {/* 2. Tailwind Grid + h-screen */}
      <div className="h-screen grid place-items-center border-2 border-green-500">
        <div>🏀 2. Grid Center (h-screen)</div>
      </div>

      {/* 3. Flex with explicit width/height on parent + margin auto */}
      <div className="border-2 border-blue-500" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "fit-content", margin: "0 auto" }}>🏀 3. Inline Margin Auto (fixed height)</div>
      </div>

      {/* 4. Absolute with fixed height + relative wrapper */}
      <div className="relative border-2 border-yellow-500" style={{ height: "100vh" }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          🏀 4. Absolute + Transform (fixed wrapper)
        </div>
      </div>

      {/* 5. Flexbox Column Nested */}
      <div className="h-screen flex flex-col justify-center items-center border-2 border-pink-500">
        <div>🏀 5. Flex Column Nested</div>
      </div>

      {/* 6. Fixed + Inset Correctly Applied */}
      <div className="relative border-2 border-purple-500" style={{ height: "100vh" }}>
        <div className="fixed inset-0 flex justify-center items-center">
          🏀 6. Fixed Inset (true fullscreen)
        </div>
      </div>

      {/* 7. Inline-Block + Text-Center (wrapped inside centered flex) */}
      <div className="h-screen flex justify-center items-center text-center border-2 border-cyan-500">
        <span className="inline-block">🏀 7. Inline Block Inside Flex</span>
      </div>

      {/* 8. Raw Inline CSS Only */}
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid orange" }}>
        🏀 8. Vanilla Flex CSS (again)
      </div>

      {/* 9. Fixed width + mx-auto inside full-page flex */}
      <div className="h-screen flex items-center border-2 border-lime-500">
        <div className="w-[300px] mx-auto text-center">🏀 9. Fixed Width + mx-auto</div>
      </div>

      {/* 10. Body-filling wrapper with manual padding */}
      <div className="border-2 border-white" style={{ height: "100vh", paddingTop: "calc(50vh - 1rem)", textAlign: "center" }}>
        🏀 10. Padding Top Manual Center
      </div>

    </div>
  );
}

export default App;
