import React from "react";
import { FaTools, FaPaintRoller, FaBrush } from "react-icons/fa";
const publicServices = [
  {
    id: 1,
    name: "Cleaning",
    icon: <FaBrush />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Repairing",
    icon: <FaTools />,
    color: "bg-orange-100 text-orange-600",
  },
  //   {
  //     id: 3,
  //     name: "AC/Cooling",
  //     icon: <FaHvac />,
  //     color: "bg-cyan-100 text-cyan-600",
  //   },
  {
    id: 4,
    name: "Painting",
    icon: <FaPaintRoller />,
    color: "bg-green-100 text-green-600",
  },
];

const PublicServices = ({ onServiceClick }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          AganSewa Popular Services
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {publicServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onServiceClick(service.name)}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center border border-transparent hover:border-orange-500"
            >
              <div
                className={`p-4 rounded-full ${service.color} text-3xl mb-4`}
              >
                {service.icon}
              </div>
              <h3 className="font-bold text-slate-700">{service.name}</h3>
              <p className="text-xs text-gray-400 mt-1">
                Book professional now
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicServices;
