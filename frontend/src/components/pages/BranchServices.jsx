import React, { useEffect } from "react";
import {
  FaFireExtinguisher,
  FaBolt,
  FaWater,
  FaIndustry,
  FaShieldAlt,
  FaTools,
  FaStar,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

const IMG_URL = import.meta.env.VITE_IMG_URL;

const Services = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // URL athawa state bata ID ra Name line
  const branchID = state?.branchID;
  const branchName = state?.branchName || "Our";

  const { data, isLoading, isError } = useGetservicebybranchQuery(branchID, {
    skip: !branchID, // ID chhaina bhane query skip garne
  });

  const services = data?.data || [];

  // Yadi user direct link bata aayo ra ID chhaina bhane Home pathaune
  useEffect(() => {
    if (!branchID) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [branchID, navigate]);

  if (!branchID) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          No Branch Selected!
        </h2>
        <p className="text-slate-500 mt-2">
          Redirecting you to home to select a branch...
        </p>
        <NavLink to="/" className="mt-4 text-orange-600 font-bold underline">
          Click here to go now
        </NavLink>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-2 text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">
            <FaMapMarkerAlt /> {branchName} Branch
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="text-orange-500">{branchName}</span> ma hamra Sewa
            haru
          </h1>
          <p className="text-xl text-gray-300">
            Tapai ko surakshya hamro pahilo prathyamikta. Bharpardo ra
            bishwasilo sewa.
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
                className="h-96 bg-gray-200 animate-pulse rounded-[2.5rem]"
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
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-slate-400">
              Yo branch ma halasallai kunai sewa uplabdha chhaina.
            </h3>
            <NavLink to="/" className="text-orange-500 underline mt-4 block">
              Arko branch select garnuhos
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service) => {
              // Path Sudhaar: uploads/services/
              const imageSrc = service.image
                ? `${IMG_URL}/uploads/services/${service.image}`
                : "https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=800";

              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-[2.5rem] p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden rounded-4xl bg-slate-100">
                    <img
                      src={imageSrc}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={service.name}
                      onError={(e) => {
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
                        "Hamro expert haru dwara uttam sewa pradan gari necha."}
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
                        state={{ service: service.name, branch: branchName }}
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

      {/* 📞 EMERGENCY CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-20 text-center">
        <div className="bg-orange-500 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-4">
            Apatkalin Sewa Chahiyeko Cha?
          </h2>
          <p className="mb-8 opacity-90 text-lg">Hamro team 24/7 tayar chha.</p>
          <a
            href="tel:101"
            className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-900 hover:text-white transition-all"
          >
            Dial 101 <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
