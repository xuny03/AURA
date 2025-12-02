import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCardFeatured from "./ProductCardFeatured.jsx";

// MAPEO categoryId → label usable por la UI
function resolveCategory(id) {
  switch (id) {
    case 11:
      return "cpu";
    case 12:
      return "gpu";
    case 2:
      return "componentes";
    case 3:
      return "monitor";
    default:
      return "other";
  }
}

export default function FeaturedSlider({ products }) {
  return (
    <div className="aura-featured-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }}
        className="aura-swiper"
      >
        {products.map((product) => {
          
          const fixedProduct = {
            ...product,
            category: resolveCategory(product.categoryId)
          };

          return (
            <SwiperSlide key={product.id}>
              <div className="aura-slider-card">
                <ProductCardFeatured product={fixedProduct} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
