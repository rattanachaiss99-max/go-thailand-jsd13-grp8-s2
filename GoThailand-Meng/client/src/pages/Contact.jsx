export default function Contact() {
  return (

    <div className="flex flex-col bg-orange-500 rounded-md m-2 p-10 shadow-2xl">
      <h1 className="font-bold text-2xl pb-2">Contact Us</h1>
      <p>Message : </p>
      <textarea className="bg-white rounded-md w-full"></textarea>
      <button className="bg-teal-400 w-35 rounded-md text-white hover:cursor-pointer  hover:bg-teal-600 hover:-translate-y-2 p-2 mt-5 duration-300">Send Message</button>
    </div>
  );
}