import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainSection from "@/components/signin/MainSection";

const SignIn = () => {
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="container mx-auto">
    <MainSection />
   </main>

   <Footer />
  </div>
 );
};

export default SignIn;
