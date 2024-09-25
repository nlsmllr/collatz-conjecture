import CollatzConjecture from "./Components/collatz-conjecture";


export default function Home() {
  return (
    <div className="items-center justify-items-center p-8 pb-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <CollatzConjecture />
      </main>
     
    </div>
  );
}
