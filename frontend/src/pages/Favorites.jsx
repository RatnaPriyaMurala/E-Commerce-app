import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";

const Favorites = () => {
  const {
    favorites,
    removeFavorite,
    addToCart,
    currency,
    navigate,
  } = useContext(ShopContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/30 to-sky-50">
      <section className="py-7 sm:py-9">
        <div className="text-center mb-7">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-50 flex items-center justify-center">
            <FaHeart className="text-xl sm:text-2xl text-red-500" />
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-800">
            My Favorites
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Your saved seafood products in one place.
          </p>
        </div>

        {!favorites || favorites.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 sm:p-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center">
              <FaHeart className="text-3xl text-cyan-500" />
            </div>

            <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-800">
              No Favorites Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Save your favorite seafood products here so you can
              quickly find them later.
            </p>

            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-6 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Browse Seafood
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {favorites.map((item) => {
              const image = Array.isArray(item.image)
                ? item.image[0]
                : item.image;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-52 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(item._id);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                      title="Remove from favorites"
                    >
                      <FaTrash className="text-xs" />
                    </button>

                    <div className="absolute top-2.5 left-2.5 bg-white/95 text-red-500 text-[9px] font-bold px-2 py-1 rounded-full shadow">
                      Favorite
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] uppercase tracking-wide text-cyan-600 font-semibold">
                      {item.category}
                    </p>

                    <h2
                      className="mt-1 text-base font-bold text-gray-800 line-clamp-1 cursor-pointer hover:text-cyan-700 transition"
                      onClick={() => navigate(`/product/${item._id}`)}
                      title={item.name}
                    >
                      {item.name}
                    </h2>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[9px] text-gray-400">
                          Starting from
                        </p>

                        <p className="mt-0.5 text-lg font-extrabold text-cyan-700">
                          {currency}
                          {Number(item.price || 0).toLocaleString("en-IN")}
                          <span className="ml-1 text-[9px] font-medium text-gray-400">
                            / KG
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            item._id,
                            item.minQuantity || 0.5
                          )
                        }
                        className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-700 transition"
                        title="Add to cart"
                      >
                        <FaShoppingCart className="text-xs" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="mt-4 w-full flex items-center justify-center gap-2 border border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl py-2 text-xs font-semibold transition"
                    >
                      View Product
                      <FaArrowRight className="text-[9px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Favorites;