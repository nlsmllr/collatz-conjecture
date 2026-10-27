import CollatzConjecture from "./Components/collatz-conjecture";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-8">
      <CollatzConjecture />
    </div>
  );
}
