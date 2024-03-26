import ObjectDetection from "@/components/ObjectDetection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex-col items-center p-8">
      <h1 className="font-extrabold gradient-title text-3xl md:text-6xl lg:text-8xl text-center tracking-wide">Detection App</h1>
      <ObjectDetection/>

    </div>
  );
}
