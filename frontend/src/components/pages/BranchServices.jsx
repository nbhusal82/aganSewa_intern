import React from "react";
import {
  FaFireExtinguisher,
  FaBolt,
  FaWater,
  FaIndustry,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useGetservicebybranchQuery } from "../redux/features/DistrictSlices";

const services = [];

const Services = () => {
  const { state } = useLocation();
  const id = state?.branchID;
  const { data } = useGetservicebybranchQuery(id);

  console.log(data);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 HERO */}
      <div className="bg-slate-900 text-white py-20 text-center">
        <h1 className="text-5xl font-black mb-4">Our Services</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Professional fire safety and protection services tailored for homes,
          businesses, and industries.
        </p>
      </div>

      {/* 🔧 SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition hover:-translate-y-2"
            >
              <div className="text-orange-500 text-4xl mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              <NavLink
                to="/contact"
                className="inline-block text-orange-500 font-bold hover:underline"
              >
                Book Now →
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      {/* 📞 CTA */}
      <div className="bg-orange-500 text-white py-16 text-center">
        <h2 className="text-3xl font-black mb-4">
          Need Emergency Fire Support?
        </h2>
        <p className="mb-6">
          Our experts are available for immediate assistance.
        </p>
        <a
          href="tel:101"
          className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold shadow hover:scale-105 transition"
        >
          Call 101
        </a>
      </div>
    </div>
  );
};

export default Services;
