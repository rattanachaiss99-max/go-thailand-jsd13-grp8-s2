import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center bg-sky-200 rounded-2xl p-10 mt-2 shadow-2xl">
      <h1 className="text-3xl font-bold">Welcome to Our App</h1>
      <button className="bg-sky-500 p-2 rounded-2xl mt-4 text-white font-bold hover:-translate-y-1.5 duration-300"><Link to="/about">Go to About</Link></button>
      <p className="mt-4 underline underline-offset-1 hover:text-amber-600 hover:font-bold"><Link to="/contact">Go to Contact</Link></p>
    </div>
  );
}