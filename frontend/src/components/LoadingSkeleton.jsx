const LoadingSkeleton = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-[440px]">
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-[#0B877D] animate-[loading_1s_ease-in-out]" 
              style={{animation: "width 1s ease-in-out", width: "100%"}}></div>
          </div>
  
          {/* Loading text */}
          <div className="text-center mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded mx-auto mb-2 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <div className="h-4 w-32 bg-slate-200 rounded mx-auto animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
  
          {/* Form fields */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative">
                <div className="w-full h-[52px] bg-slate-200 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
            ))}
          </div>
  
          {/* Button */}
          <div className="mt-5 mb-6">
            <div className="w-full h-[52px] bg-slate-200 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
  
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <div className="mx-4 w-32 h-4 bg-slate-200 rounded animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
  
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-[52px] bg-slate-200 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            ))}
          </div>
  
          {/* Bottom text */}
          <div className="flex justify-center space-x-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <div className="h-4 w-16 bg-slate-200 rounded animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingSkeleton;