import Image from "next/image";

export default function Home() {
  return (
   <div className="flex justify-center items-center min-h-screen flex-col">

    <div className=" relative w-[80%] h-[240px] mb-4">
        <Image src="/coming.jpg" alt="damn its nice" fill className="object-cover rounded-4xl object-bottom" />
    </div>

      <h1 className="text-4xl">&apos;Guess was the weather</h1>
   </div>
  );
}
