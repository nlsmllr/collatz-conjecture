import CollatzConjecture from "./Components/collatz-conjecture";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[120px]" />
        <div
          className="aurora absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="aurora absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-cyan-500/20 blur-[120px]"
          style={{ animationDelay: "-12s" }}
        />
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-8">
        <CollatzConjecture />
      </div>
    </div>
  );
}
