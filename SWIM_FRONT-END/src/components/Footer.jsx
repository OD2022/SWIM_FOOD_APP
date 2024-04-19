import React from "react";
import { useLocation } from "react-router-dom";
const Footer = () =>

{
  const location = useLocation();
  const hideFooter = ["/receive"].some((path) =>
    location.pathname.startsWith(path)
  );


  if (hideFooter) {
    return null;
  }
  return (
    <footer className="bg-[#000000] pb-0">
      <div className="container mx-auto text-center">
        <p className="text-white">© 2022 SWIM-Food Climate Solutions</p>
        <nav>
          <ul className="flex justify-end space-x-4 mb-8">
            <li>
              <a href="/edu" className="text-white hover:text-gray-300">
                Edu
              </a>
            </li>
            <li>
              <a href="/comms" className="text-white hover:text-gray-300">
                Comms
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
