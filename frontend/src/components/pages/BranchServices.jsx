import React from "react";
import {
  FaFireExtinguisher,
  FaBolt,
  FaWater,
  FaIndustry,
  FaShieldAlt,
  FaTools,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useGetservicebybranchQuery } from "../redux/features/DistrictSlices";

// Icon mapping logic
const iconMap = {
  fire: <FaFireExtinguisher />,
  electric: <FaBolt />,
  water: <FaWater />,
  industry: <FaIndustry />,
  safety: <FaShieldAlt />,
  tools: <FaTools />,
};

// .env bata Image Base URL line
const IMG_URL = import.meta.env.VITE_IMG_URL;

const Services = () => {
  const { state } = useLocation();
  const id = state?.branchID;
  const { data, isLoading, isError } = useGetservicebybranchQuery(id);
  const services = data?.data || [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 🔥 HERO SECTION */}
      <div className="relative bg-slate-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1516216628859-9bccecad13f7?q=80&w=1600"
            alt="bg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
            AganSewa Solutions
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6 leading-tight">
            Hamra <span className="text-orange-500">Premium</span> Sewa Haru
          </h1>
          <p className="text-xl text-gray-300">
            Tapai ko surakshya hamro pahilo prathyamikta. 24/7 bharpardo sewa.
          </p>
        </div>
      </div>

      {/* 🔧 DYNAMIC SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center bg-red-50 p-12 rounded-3xl border border-red-100">
            <h3 className="text-xl font-bold text-red-600">
              Sewa haru load garna sakiyena.
            </h3>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-slate-900 underline font-bold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service) => {
              // Backend Image URL Construction
              // .env ko URL + uploads folder + image name
              const imageSrc = service.image
                ? `${IMG_URL}/uploads/${service.image}`
                : `https://source.unsplash.com/featured/?${service.name}`;

              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-[2.5rem] p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden rounded-4xl bg-slate-100">
                    <img
                      src={imageSrc}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                      alt={service.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=800";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm text-orange-500 text-2xl">
                      {iconMap[service.icon?.toLowerCase()] || <FaTools />}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                        {service.name}
                      </h2>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg text-orange-600 font-bold text-sm">
                        <FaStar size={12} /> 4.9
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.description ||
                        "Hamro expert haru dwara uttam sewa pradan gari necha. Aajai samparka garnuhos."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                          Start From
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          {service.price
                            ? `Rs. ${service.price}`
                            : "Negotiable"}
                        </span>
                      </div>

                      <NavLink
                        to="/contact"
                        state={{ service: service.name }}
                        className="flex items-center justify-center bg-slate-900 text-white w-14 h-14 rounded-2xl hover:bg-orange-500 hover:w-32 transition-all duration-300 group/btn overflow-hidden relative"
                      >
                        <span className="absolute left-6 opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold whitespace-nowrap">
                          Book Now
                        </span>
                        <FaArrowRight className="group-hover/btn:translate-x-10 transition-transform" />
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📞 CTA SECTION */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-orange-500 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-200">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6">
              Apatkalin Sewa Chahiyeko Cha?
            </h2>
            <p className="text-orange-100 mb-10 max-w-xl mx-auto text-lg font-medium">
              Hamro team 24/7 tayar chha. Kunai pani samasya bhae turuntai dial
              garnuhos.
            </p>
            <a
              href="tel:101"
              className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            >
              Dial 101 <FaArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
