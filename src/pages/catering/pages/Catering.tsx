import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import EventTypeCard from "../components/catering/EventTypeCard";
import corporateEventImage from "@/assets/corporate-event.jpg";
import Caterers from "@/assets/Caterers.svg";
import privateChef from "@/assets/Private_Chefs.svg";
import privateEventImage from "@/assets/private-event.jpg";
import { Button } from "../components/ui/button";
import DateTimePicker from '@/components/ui/calendar';
import EventTypeSelection from "../components/catering/EventTypeSelection";
import ProviderTypeSelection from "../components/catering/ProviderTypeSelection";
import CuisineSelection from "../components/catering/CuisineSelection";
import CourseSelection from "../components/catering/CourseSelection";
import LocationSelection from "../components/catering/LocationSelection";
import BudgetSelection from "../components/catering/BudgetSelection";
import BookingSummary from "../components/catering/BookingSummary"; // Import BookingSummary

const Catering = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // Step states to manage visibility
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedServiceStyles, setSelectedServiceStyles] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  // Event and provider data
  const eventTypes = [
    { id: "corporate", title: "Corporate Event", image: corporateEventImage },
    { id: "private", title: "Private Event", image: privateEventImage },
  ];

  const providerTypes = [
    {
      id: "caterer", 
      title: "Caterer", 
      image: Caterers,
      description: "Enjoy a traditional catering experience with flexible service options tailored to your needs.",
      serviceStyles: ["Boxed Meal", "Pass-Around", "Sharing Table", "Buffet", "Plated Meal"],
    },
    {
      id: "Private_Chefs", 
      title: "Private Chefs", 
      image: privateChef,
      description: "Experience a personalized fine-dining meal prepared and served by a professional chef.",
      serviceStyles: ["Boxed Meal", "Pass-Around", "Sharing Table", "Buffet", "Plated Meal"],
    },
  ];

  const cuisineTypes = [
    { name: "American", image: "/images/icons/american.svg" },
    { name: "Asian", image: "/images/icons/asian.svg" },
    { name: "Dessert", image: "/images/icons/dessert.svg" },
    { name: "French", image: "/images/icons/french.svg" },
    { name: "Indian", image: "/images/icons/indian.svg" },
    { name: "Italian", image: "/images/icons/italian.svg" },
    { name: "Mediterranean", image: "/images/icons/Mediterranean.svg" },
    { name: "Middle-Eastern", image: "/images/icons/Middle-Eastern.svg" },
    { name: "Japanese", image: "/images/icons/japanese.svg" },
    { name: "Latin American", image: "/images/icons/latin-american.png" },
  ];

  const courseTypes = [
    { name: "Canapes", image: "/images/icons/Canapes.svg" },
    { name: "Starters", image: "/images/icons/Starters.svg" },
    { name: "Mains", image: "/images/icons/mains.svg" },
    { name: "Sides", image: "/images/icons/sides.svg" },
    { name: "Desserts", image: "/images/icons/dessert.svg" },
    { name: "Cold Beverages", image: "/images/icons/Cold_Beverages.svg" },
    { name: "Hot Beverages", image: "/images/icons/Hot_Beverages.svg" },
    { name: "Snacks", image: "/images/icons/snacks.svg" },
    { name: "Ice Cream Station", image: "/images/icons/ice_cream_station.svg" },
    { name: "Coffee Station", image: "/images/icons/coffee_station.svg" },
  ];

  const locations = ["Ajman", "Dubai", "Sharjah"];
  const budgetOptions = [
    { id: "basic", title: "Basic", price: "AED70" },
    { id: "premium", title: "Premium", price: "AED350" },
    { id: "luxury", title: "Luxury", price: "AED550" },
    { id: "elite", title: "Elite", price: "AED700" },
  ];

  // Handler functions
  const handleGuestCountChange = (amount: number) => {
    // Prevent going below 1 guest
    setGuestCount((prevCount) => Math.max(1, prevCount + amount));
  };

  const handleSelectDateTime = () => {
    setIsDateTimePickerVisible(true);
  };

  const handleDateTimeConfirm = (formattedDateTime: string) => {
    setSelectedDateTime(formattedDateTime);
  };

  const handleContinue = () => {
    if (step === 1 && selectedEvent) setStep(2); // Move to provider selection
    else if (step === 2 && selectedProvider) setStep(3); // Move to cuisines selection
    else if (step === 3 && selectedCuisines.length > 0) setStep(4); // Move to courses selection
    else if (step === 4 && selectedCourses.length > 0) setStep(5); // Move to location selection
    else if (step === 5 && selectedLocation) setStep(6); // Move to budget selection
    else if (step === 6 && selectedBudget) setStep(7); // Move to booking summary
  };

  const handleGoBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else if (step === 6) setStep(5);
    else if (step === 7) setStep(6); // Go back to budget selection
  };

  // Toggle selection functions
  const toggleServiceStyle = (style: string) => {
    setSelectedServiceStyles(prevState =>
      prevState.includes(style) ? prevState.filter(item => item !== style) : [...prevState, style]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prevState =>
      prevState.includes(cuisine) ? prevState.filter(item => item !== cuisine) : [...prevState, cuisine]
    );
  };

  const toggleCourse = (course: string) => {
    setSelectedCourses(prevState =>
      prevState.includes(course) ? prevState.filter(item => item !== course) : [...prevState, course]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="bg-neutral-white">
          <div className="container py-6">
            <div className="flex items-center gap-2 text-sm mb-6">
              <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-neutral-gray-dark hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Breadcrumbs
              </button>
              <span className="text-neutral-gray">/</span>
              <span className="text-neutral-gray-dark">Breadcrumbs</span>
            </div>

            <h1 className="md:text-4xl font-bold text-primary text-[28px]">Catering Service</h1>
          </div>
        </div>

        <div className="container mx-auto px-1 py-6 pb-24">
          {/* Show the steps */}
          {step === 1 && <EventTypeSelection selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} guestCount={guestCount} setGuestCount={setGuestCount} selectedDateTime={selectedDateTime} setIsDateTimePickerVisible={setIsDateTimePickerVisible} handleSelectDateTime={handleSelectDateTime} handleContinue={handleContinue} handleGuestCountChange={handleGuestCountChange} />}
          {step === 2 && <ProviderTypeSelection selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} providerTypes={providerTypes} toggleServiceStyle={toggleServiceStyle} handleGoBack={handleGoBack} handleContinue={handleContinue} selectedServiceStyles={selectedServiceStyles} />}
          {step === 3 && <CuisineSelection selectedCuisines={selectedCuisines} setSelectedCuisines={setSelectedCuisines} cuisineTypes={cuisineTypes} handleGoBack={handleGoBack} handleContinue={handleContinue} toggleCuisine={toggleCuisine} />}
          {step === 4 && <CourseSelection selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} courseTypes={courseTypes} handleGoBack={handleGoBack} handleContinue={handleContinue} toggleCourse={toggleCourse} />}
          {step === 5 && <LocationSelection selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} locations={locations} handleGoBack={handleGoBack} handleContinue={handleContinue} />}
          {step === 6 && <BudgetSelection selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget} budgetOptions={budgetOptions} handleGoBack={handleGoBack} handleContinue={handleContinue} />}

          {/* Show the Booking Summary after step 6 */}
          {step === 7 && (
            <BookingSummary
              eventType={selectedEvent}
              guestCount={guestCount}
              selectedDateTime={selectedDateTime}
              selectedProvider={selectedProvider}
              selectedServiceStyles={selectedServiceStyles}
              selectedCuisines={selectedCuisines}
              selectedCourses={selectedCourses}
              selectedLocation={selectedLocation}
              selectedBudget={selectedBudget}
              handleGoBack={handleGoBack} // Pass the handleGoBack function
            />
          )}

        </div>
      </main>

      <Footer />

      {isDateTimePickerVisible && <DateTimePicker isOpen={isDateTimePickerVisible} onClose={() => setIsDateTimePickerVisible(false)} onConfirm={handleDateTimeConfirm} />}
    </div>
  );
};

export default Catering;
