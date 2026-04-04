// Example Update to your Insights Panel
export default function LiveInsightsOverlay() {
  return (
    // The main container must not be fully opaque. 
    // Using Tailwind: bg-black/60 gives a dark, translucent glass effect.
    <div className="min-h-screen bg-black/60 text-white p-4 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm">
      
      {/* The Drag Handle at the top */}
      <div className="drag-region w-full h-8 flex items-center justify-center cursor-move mb-4 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
      </div>

      <div className="no-drag">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Live Insights</h2>
        
        {/* Your Deepgram/Groq data maps here */}
        <div className="space-y-4">
           <div className="p-3 bg-gray-800/80 rounded-lg border-l-4 border-blue-500">
             <p className="text-sm font-semibold">Suggested Action</p>
             <p className="text-xs text-gray-300 mt-1">Mention the Q3 SLA guarantees based on their latency question.</p>
           </div>
        </div>
      </div>
      
    </div>
  );
}