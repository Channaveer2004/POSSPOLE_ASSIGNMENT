import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
          Hello, World 
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Welcome to your Next.js + Tailwind project.  
          Build something amazing 🚀
        </p>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition-colors shadow-lg"
        >
          Get Started
        </a>
      </div>

      {/* Logo Section */}
      <div className="mt-12 flex gap-8">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={40}
          priority
        />
        <br />
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        Made with ❤️ using Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
