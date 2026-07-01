import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ReviewaiLanding = (): JSX.Element => {
  const navItems = ["Features", "Pricing", "About"];
  const footerLinks = ["Terms", "Privacy", "Contact"];

  return (
    <div className="min-h-screen w-full bg-[#f9f9ff]">
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col bg-[linear-gradient(0deg,rgba(249,249,255,1)_0%,rgba(249,249,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
        <header className="sticky top-0 z-10 border-b border-[#ccc3d8] bg-[#f9f9ff] shadow-[0px_1px_2px_#0000000d]">
          <div className="mx-auto flex h-20 w-full items-center justify-between px-10">
            <div className="flex items-center">
              <span className="mt-[-1.00px] flex items-center whitespace-nowrap [font-family:'Poppins',Helvetica] text-2xl font-bold leading-[33.6px] tracking-[0] text-[#630ed4]">
                ReviewAI
              </span>
            </div>
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-8"
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="mt-[-1.00px] flex items-center whitespace-nowrap [font-family:'Poppins',Helvetica] text-sm font-medium leading-[16.8px] tracking-[0] text-[#4a4455] transition-colors hover:text-[#630ed4]"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                type="button"
                className="h-auto px-4 py-2 [font-family:'Poppins',Helvetica] text-sm font-medium leading-[16.8px] tracking-[0] text-[#4a4455] hover:bg-transparent hover:text-[#630ed4]"
              >
                Watch Demo
              </Button>
              <Button
                type="button"
                className="h-auto rounded-full bg-[#630ed4] px-6 py-2.5 shadow-[0px_1px_2px_#0000000d] [font-family:'Poppins',Helvetica] text-sm font-medium leading-[16.8px] tracking-[0] text-white hover:bg-[#5a0dc1]"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1" />
        <footer className="border-t border-[#ccc3d8] bg-white">
          <Card className="rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="flex items-center justify-between px-10 py-12">
              <section className="flex flex-col items-start gap-[7.99px]">
                <div className="flex items-center">
                  <span className="mt-[-1.00px] flex items-center whitespace-nowrap [font-family:'Poppins',Helvetica] text-sm font-bold leading-[16.8px] tracking-[0] text-[#141b2b]">
                    ReviewAI
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mt-[-1.00px] flex items-center whitespace-nowrap [font-family:'Poppins',Helvetica] text-sm font-normal leading-[21px] tracking-[0] text-[#4a4455]">
                    by Adshree
                  </span>
                </div>
              </section>
              <nav
                aria-label="Footer navigation"
                className="flex items-center gap-8"
              >
                {footerLinks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="[font-family:'Poppins',Helvetica] text-xs font-semibold leading-[14.4px] tracking-[0.24px] text-[#4a4455] transition-colors hover:text-[#630ed4]"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <p className="whitespace-nowrap [font-family:'Poppins',Helvetica] text-xs font-semibold leading-[14.4px] tracking-[0.24px] text-[#4a4455]">
                © 2024 ReviewAI. All rights reserved.
              </p>
            </CardContent>
          </Card>
        </footer>
      </div>
    </div>
  );
};
