import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventTypeCard from "@/components/catering/EventTypeCard";
import corporateEventImage from "@/assets/corporate-event.jpg";
import privateEventImage from "@/assets/private-event.jpg";
import { Button } from "@/components/ui/button";
import DateTimePicker from '@/components/ui/calendar';

const Catering = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);

  const eventTypes = [
    {
      id: "corporate",
      title: "Corporate Event",
      image: corporateEventImage,
    },
    {
      id: "private",
      title: "Private Event",
      image: privateEventImage,
    },
  ];

  const handleGuestCountChange = (amount: number) => {
    setGuestCount(prev => Math.max(prev + amount, 0));
  };

  const handleSelectDateTime = () => {
    setIsDateTimePickerVisible(true);
  };

  const handleDateTimeConfirm = (formattedDateTime: string) => {
    setSelectedDateTime(formattedDateTime);
  };

  const handleContinue = () => {
    // Handle continue action
    console.log("Continue clicked");
    // Navigate to next step or perform action
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="bg-neutral-white">
          <div className="container py-6">
            <div className="flex items-center gap-2 text-sm mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-neutral-gray-dark hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Breadcrumbs
              </button>
              <span className="text-neutral-gray">/</span>
              <span className="text-neutral-gray-dark">Breadcrumbs</span>
            </div>

            <h1 className="md:text-4xl font-bold text-primary text-[28px]">
              Catering Service
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-1 py-6 pb-24">
          {/* Step 1 - Event Type Selection */}
          <div
            className="bg-neutral-white border rounded-2xl p-6 md:p-8"
            style={{ border: "1px solid #EDEEF2" }}
          >
            <div className="flex items-center mb-6 gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--primary))" }}
              >
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h2 className="text-primary-text text-2xl font-bold">
                What Type Of Event Are you Planning?
              </h2>
            </div>

            {/* Event Type Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl ml-12">
              {eventTypes.map((event) => (
                <EventTypeCard
                  key={event.id}
                  image={event.image}
                  title={event.title}
                  selected={selectedEvent === event.id}
                  onClick={() => {
                    setSelectedEvent(event.id);
                    setGuestCount(0);
                  }}
                />
              ))}
            </div>
            {selectedEvent && (
              <div style={{ marginTop: "24px", paddingLeft: '45px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B43' }}>
                  How Many Guests are you expecting?
                </h2>

                <div className="flex gap-6">
                  <button
                    onClick={() => handleGuestCountChange(-1)}
                    style={{ height: '32px', width: '32px', marginTop: '5px', backgroundColor: '#EAF5FF', borderRadius: '8px' }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={guestCount}
                    readOnly
                    style={{
                      height: '44px',
                      width: '94px',
                      border: '1px solid #C7C8D2',
                      borderRadius: '8px',
                      textAlign: 'center',
                      lineHeight: '44px',
                    }}
                  />
                  <button
                    onClick={() => handleGuestCountChange(1)}
                    style={{ height: '32px', width: '32px', marginTop: '5px', backgroundColor: '#EAF5FF', borderRadius: '8px' }}
                  >
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
                      <button
                        onClick={handleSelectDateTime}
                        className="text-[#056AC1] underline hover:text-opacity-70 transition-colors"
                        style={{ fontSize: '16px', fontWeight: '700' }}
                      >
                        Change Date/Time
                      </button>
                    </div>

                    {/* Existing button section */}
                    <div className="flex justify-between mt-8" style={{ paddingRight: '45px' }}>
                      <Button
                        disabled
                        className="cursor-not-allowed"
                        style={{ 
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#C7C8D2',
                          border: '1px solid #EDEEF2',
                          backgroundColor: '#fff',

                        }}
                      >
                        Go Back
                      </Button>
                      <Button
                        onClick={handleContinue}
                        className="bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70"
                        style={{ 
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          boxShadow: "0px 8px 20px 0px #4E60FF29"
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="mt-6"
                    variant="default"
                    size="default"
                    style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}
                    onClick={handleSelectDateTime}
                  >
                    Select Date and Time
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {isDateTimePickerVisible && (
        <DateTimePicker 
          isOpen={isDateTimePickerVisible}
          onClose={() => setIsDateTimePickerVisible(false)}
          onConfirm={handleDateTimeConfirm}
        />
      )}
    </div>
  );
};

export default Catering;
