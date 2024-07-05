import React from "react";
import LandingNav from "@/components/LandingNav";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import { HoverEffect } from "./ui/card-hover-effect";
import { FlipWords } from "./ui/flip-words";
import Footer from "./Footer";

interface LadingPageProps {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (val: boolean) => void;
}

const LandingPage = ({ children, open, setOpen }: LadingPageProps) => {
 const features = [
   {
     title: "AI-Powered PDF/Images Integration",
     description:
       "Easily convert your PDFs/Images into question papers or create them manually. Perfect for tailored content creation!",
     link: "#",
   },
   {
     title: "Create & Share Question Papers",
     description:
       "Design and share your own question papers. Make them public for everyone or keep them private for personal use.",
     link: "#",
   },
   {
     title: "Interactive Testing & Score Tracking",
     description:
       "Take tests instantly, track your scores, and retake to improve. Keep learning and see your progress!",
     link: "#",
   },
   {
     title: "Edit & Retake Anytime",
     description:
       "Edit your question papers anytime and retake tests to boost your scores. Keep refining your knowledge!",
     link: "#",
   },
   {
     title: "Bookmark & Engage",
     description:
       "Bookmark question papers for later and join the interactive comment section. Like, dislike, and share posts and comments!",
     link: "#",
   },
 ];

 const words = [
   "Upload PDFs/Images",
   "Design Your Own",
   "Track Your Progress",
   "Engage-in-Discussions",
 ];

  return (
    <main className="h-auto w-full relative flex flex-col items-center justify-start">
      <div className=" absolute inset-0 bottom-shadow h-screen w-full  bg-[linear-gradient(to_right,#1f1d1d12_2px,transparent_2px),linear-gradient(to_bottom,#1f1d1d12_2px,transparent_2px)]  dark:bg-[linear-gradient(to_right,#c0bbbb12_2px,transparent_2px),linear-gradient(to_bottom,#c0bbbb12_2px,transparent_2px)] bg-[size:60px_60px]"></div>
      <LandingNav />
      <AuthModal
        open={open as boolean}
        setOpen={setOpen as (newVal: boolean) => void}
      >
        {children}
      </AuthModal>
      <div className="flex flex-col top-shadow h-[55vh] md:h-90 lg:h-screen justify-center items-center text-center">
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-3xl sm:text-5xl font-bold text-center md:text-6xl xl:text-8xl">
            Questionpaper Hub
          </h1>
        </div>
        <h4 className="mt-2 font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-[#A8B3CF] max-w-[900px]">
          <p>Effortlessly create, share, and take tests.</p>
          <FlipWords words={words} />. All in one seamless platform!
        </h4>
        <div className="flex gap-4 mt-4 z-50">
          <Button variant="secondary">Check</Button>
          <Button>Get started</Button>
        </div>
      </div>
      {/* <section
        id="hero"
        className="w-[85%] md:w-[45rem] xl:w-[75rem] z-50 h-[20rem] md:h-[20rem] lg:h-[35rem] mx-auto bg-white rounded-t-lg mt-8 overflow-clip shadow-custom-blue"
      >
        <img
          className="object-fill md:object-cover lg:object-cover z-[100] w-full h-full"
          src="questionpaperhubheroimage.png"
          alt="hero-section-image"
        />
      </section> */}
      <section className="w-[85%] md:w-[45rem] xl:w-[75rem] z-[50] mt-1 lg:mt-20">
        <div className="bg-gradient-to-r py-2 from-primary to-secondary-foreground text-transparent bg-clip-text relative z-50">
          <h3 className="text-2xl sm:text-3xl font-bold text-center md:text-4xl xl:text-6xl">
            Platform Highlights
          </h3>
        </div>
        <section className="mt-8">
          <HoverEffect items={features} />
        </section>
      </section>
      <div className="h-64"></div>
      <Footer />
    </main>
  );
};

export default LandingPage;
