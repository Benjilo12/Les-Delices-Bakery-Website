function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="text-7xl animate-bounce">🧁</div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-amber-300 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-center gap-1">
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-[bounce_1s_infinite]"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
          </div>
          <p className="text-amber-800 font-medium">Loading sweet treats...</p>
        </div>
      </div>
    </div>
  );
}

export default Loading;
