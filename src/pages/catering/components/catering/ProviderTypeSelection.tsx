import React from "react";
import { Button } from "../ui/button";
import EventTypeCard from "../catering/EventTypeCard";

interface ProviderTypeSelectionProps {
  selectedProvider: string | null;
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | null>>;
  providerTypes: { 
    id: string; 
    title: string; 
    image: string; 
    description: string; 
    serviceStyles: string[]; 
  }[];
  toggleServiceStyle: (style: string) => void;
  handleGoBack: () => void;
  handleContinue: () => void;
  selectedServiceStyles: string[];
}

const ProviderTypeSelection: React.FC<ProviderTypeSelectionProps> = ({
  selectedProvider,
  setSelectedProvider,
  providerTypes,
  toggleServiceStyle,
  handleGoBack,
  handleContinue,
  selectedServiceStyles
}) => {
  return (
    <div className="bg-neutral-white border rounded-2xl p-6 md:px-6 md:py-5" style={{ border: "1px solid #EDEEF2" }}>
      <div className="flex items-center mb-6 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--primary))" }}>
          <span className="text-primary-foreground font-bold">2</span>
        </div>
        <h2 className="text-primary-text text-2xl font-bold">What's Type of Provider do you Prefer?</h2>
      </div>

      {/* Provider Type Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl ml-12">
        {providerTypes.map((provider) => (
          <EventTypeCard
            key={provider.id}
            image={provider.image}
            title={provider.title}
            selected={selectedProvider === provider.id}
            onClick={() => setSelectedProvider(provider.id)}
          />
        ))}
      </div>

      {/* Show provider details after selection */}
      {selectedProvider && (
        <div style={{ marginTop: "24px", paddingLeft: '45px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B43' }}>Expert Catering, Your Way</h3>
          <p style={{ fontSize: '16px', fontWeight: '400', color: '#2B2B43', marginTop: '8px' }}>
            {providerTypes.find(p => p.id === selectedProvider)?.description}
          </p>

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B43' }}>Select Service Style:</h3>
            <p style={{ fontSize: '14px', fontWeight: '400', color: '#545563', marginTop: '4px' }}>(You can select multiple options)</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {providerTypes
                .find(p => p.id === selectedProvider)
                ?.serviceStyles.map((style, idx) => (
                  <Button
                    key={idx}
                    onClick={() => toggleServiceStyle(style)}
                    style={{
                      fontSize: '16px',
                      backgroundColor: selectedServiceStyles.includes(style) ? '#EAF5FF' : '#fff',
                      color: '#2B2B43',
                      fontWeight: '400',
                      borderRadius: '16px',
                      padding: '18px 16px',
                      minWidth: '200px',
                      border: selectedServiceStyles.includes(style) ? '1px solid #054A86' : '1px solid #C7C8D2',
                    }}
                  >
                    {style}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8" style={{ paddingRight: '45px' }}>
        <Button onClick={handleGoBack} style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#054A86', border: '1px solid #054A86', backgroundColor: '#fff' }}>
          Go Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedProvider}
          className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${!selectedProvider ? "cursor-not-allowed" : ""}`}
          style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', boxShadow: "0px 8px 20px 0px #4E60FF29" }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ProviderTypeSelection;