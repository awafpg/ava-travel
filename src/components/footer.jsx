import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold">Ava Travel</h2>
          <p className="mt-1 text-sm text-blue-200">
            Explore the world with us. Your adventure starts here.
          </p>
        </div>

        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Destinations
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="mt-6 text-center text-blue-300 text-xs">
        &copy; {new Date().getFullYear()} Ava Travel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
