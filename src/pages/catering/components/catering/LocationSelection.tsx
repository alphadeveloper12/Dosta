// src/components/catering/LocationSelection.tsx
import React from "react";
import { Button } from "../ui/button";

interface LocationSelectionProps {
  selectedLocation: string | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string | null>>;
  locations: string[];
  handleGoBack: () => void;
  handleContinue: () => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({
  selectedLocation,
  setSelectedLocation,
  locations,
  handleGoBack,
  handleContinue,
}) => {
  return (
    <div className="bg-neutral-white border rounded-2xl p-6 md:px-6 md:py-5" style={{ border: "1px solid #EDEEF2" }}>
      <div className="flex items-center mb-6 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--primary))" }}>
          <span className="text-primary-foreground font-bold">5</span>
        </div>
        <h2 className="text-primary-text text-2xl font-bold">Where is your Event?</h2>
      </div>

      <div className="ml-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl">
          {locations.map((location, idx) => (
            <Button
              key={idx}
              onClick={() => setSelectedLocation(location)}
              style={{
                fontSize: '16px',
                height: '56px',
                backgroundColor: selectedLocation === location ? '#EAF5FF' : '#fff',
                color: '#2B2B43',
                fontWeight: '400',
                borderRadius: '16px',
                padding: '12px 16px',
                width: '245px',
                border: selectedLocation === location ? '1px solid #054A86' : '1px solid #C7C8D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {location}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={handleGoBack} style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#054A86', border: '1px solid #054A86', backgroundColor: '#fff' }}>
          Go Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedLocation}
          className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${!selectedLocation ? "cursor-not-allowed" : ""}`}
          style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', boxShadow: "0px 8px 20px 0px #4E60FF29" }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LocationSelection;
