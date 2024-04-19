import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/donate">
              Donate Foodstuff
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/receive">
              Receive Foodstuff
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
