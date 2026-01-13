import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { FaArrowRight, FaPhoneAlt } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useGetdistrictQuery } from "../redux/features/DistrictSlices";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";

const Home = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const navigate = useNavigate();
  const { data: districtData, isLoading, isError } = useGetdistrictQuery();
  const districts = [{ value: "kathmandu", label: "kathmandu" }];
  console.log(districtData);

  const availablePlaces = selectedDistrict
    ? placesByDistrict[selectedDistrict] || []
    : [];
  const palceByDistrict = {
    kathmandu: [{ id: 1, value: "thamel", label: "thamel" }],
  };
  const handelChange = (e) => {
    const place = e.target.value;
    setSelectedPlace(place);
    if (place) {
      navigate(`/${place}`);
    }
  };

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1486006396113-c7b36766558b?q=80&w=1600",
    },
    {
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600",
    },
    {
      image:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1600",
    },
    {
      image:
        "https://images.unsplash.com/photo-1581091870627-3a5cbb1c7f6c?q=80&w=1600",
    },
    {
      image:
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1600",
    },
  ];

  const showSlider = !selectedDistrict;
  if (isLoading) return <Loading isLoading={isLoading} />;
  if (isError) return <Error />;

  return (
    <div className="font-sans text-slate-900">
      <section className="relative h-screen w-full overflow-hidden bg-slate-900">
        {/* 🔥 HERO SLIDER */}
        {showSlider && (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            speed={1000}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-screen w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative h-screen w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/60"></div>

                  {/* TEXT ON IMAGE */}
                  <div className="relative z-10 flex items-center h-full px-10 md:px-20">
                    <div className="max-w-2xl text-white space-y-6">
                      <h2 className="text-4xl md:text-6xl font-extrabold">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-200">
                        {slide.subtitle}
                      </p>
                      <NavLink
                        to="/services"
                        className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold transition"
                      >
                        Explore Services <FaArrowRight />
                      </NavLink>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* 🔽 CENTER SEARCH BOX */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-5xl font-black mb-4">Aangan Sewa</h1>
            <p className="mb-8 text-lg">
              Quality home services at your doorstep
            </p>

            <div className="bg-white/95 rounded-xl p-6 text-gray-800 w-105">
              <p className="mb-4 font-semibold">Where do you need a service?</p>

              <div className="flex gap-4">
                <select
                  className="w-1/2 p-3 rounded border"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedPlace("");
                  }}
                >
                  <option value="">District</option>
                  {districts.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>

                <select
                  className="w-1/2 p-3 rounded border"
                  value={selectedPlace}
                  onChange={handelChange}
                  disabled={!selectedDistrict}
                >
                  <option value="">Place</option>
                  {availablePlaces.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 📞 EMERGENCY BUTTON */}
        <div className="absolute bottom-6 right-6 z-30 hidden md:block">
          <a
            href="tel:101"
            className="bg-white px-4 py-3 rounded-xl shadow-xl flex gap-3 items-center hover:scale-105 transition"
          >
            <FaPhoneAlt className="text-orange-500" />
            <span className="font-bold text-slate-900">Dial 101</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
