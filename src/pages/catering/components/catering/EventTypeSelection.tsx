import React from "react";
import EventTypeCard from "../catering/EventTypeCard";
import { Button } from "../ui/button";
import corporateEventImage from '@/assets/corporate-event.jpg';
import privateEventImage from '@/assets/private-event.jpg';

interface EventTypeSelectionProps {
  selectedEvent: string | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string | null>>;
  guestCount: number;
  setGuestCount: React.Dispatch<React.SetStateAction<number>>;
  selectedDateTime: string | null;
  setIsDateTimePickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectDateTime: () => void;
  handleContinue: () => void;
  handleGuestCountChange: (amount: number) => void;
}

const EventTypeSelection: React.FC<EventTypeSelectionProps> = ({
  selectedEvent,
  setSelectedEvent,
  guestCount,
  setGuestCount,
  selectedDateTime,
  setIsDateTimePickerVisible,
  handleSelectDateTime,
  handleContinue,
  handleGuestCountChange,
}) => {
  const eventTypes = [
    {
        id: "corporate",
        title: "Corporate Event",
        image: corporateEventImage,  // Use the imported image
    },
    {
        id: "private",
        title: "Private Event",
        image: privateEventImage,   // Use the imported image
    },
  ];

  return (
    <div className="bg-neutral-white border rounded-2xl p-6 md:p-8" style={{ border: "1px solid #EDEEF2" }}>
      <div className="flex items-center mb-6 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--primary))" }}>
          <span className="text-primary-foreground font-bold">1</span>
        </div>
        <h2 className="text-primary-text text-2xl font-bold">What Type Of Event Are you Planning?</h2>
      </div>

      {/* Event Type Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl ml-12">
        {eventTypes.map((event) => (
          <EventTypeCard
            key={event.id}
            image={event.image}
            title={event.title}
            selected={selectedEvent === event.id}
            onClick={() => setSelectedEvent(event.id)}
          />
        ))}
      </div>

      {selectedEvent && (
        <div style={{ marginTop: "24px", paddingLeft: '45px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B43' }}>How Many Guests are you expecting?</h2>
          <div className="flex gap-6">
            <button 
              onClick={() => handleGuestCountChange(-1)} 
              style={{ height: '32px', width: '32px', marginTop: '5px', backgroundColor: '#EAF5FF', borderRadius: '8px' }}>
              -
            </button>
            <input 
              type="number" 
              value={guestCount} 
              readOnly 
              style={{ height: '44px', width: '94px', border: '1px solid #C7C8D2', borderRadius: '8px', textAlign: 'center', lineHeight: '44px' }} 
            />
            <button 
              onClick={() => handleGuestCountChange(1)} 
              style={{ height: '32px', width: '32px', marginTop: '5px', backgroundColor: '#EAF5FF', borderRadius: '8px' }}>
              +
            </button>
          </div>

          {/* Show selected date/time or button */}
          {selectedDateTime ? (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B43', marginBottom: '20px', marginTop: '44px' }}>
                Date and Time of the Event?
              </h3>
              <div className="flex items-center gap-4">
                <span style={{ fontSize: '16px', color: '#2B2B43', fontWeight: 400 }}>
                  {selectedDateTime}
                </span>
                <button onClick={handleSelectDateTime} className="text-[#056AC1] underline hover:text-opacity-70 transition-colors" style={{ fontSize: '16px', fontWeight: '700' }}>
                  Change Date/Time
                </button>
              </div>

              <div className="flex justify-between mt-8" style={{ paddingRight: '45px' }}>
                <Button disabled className="cursor-not-allowed" style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#C7C8D2', border: '1px solid #EDEEF2', backgroundColor: '#fff' }}>
                  Go Back
                </Button>
                <Button onClick={handleContinue} className="bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70" style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', boxShadow: "0px 8px 20px 0px #4E60FF29" }}>
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <Button className="mt-6" variant="default" size="default" style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }} onClick={handleSelectDateTime}>
              Select Date and Time
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventTypeSelection;
