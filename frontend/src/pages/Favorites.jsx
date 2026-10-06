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
      <section className="py-4 sm:py-6">
        {/* PAGE HEADER */}
        <div className="mb-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 sm:h-12 sm:w-12">
            <FaHeart className="text-base text-red-500 sm:text-lg" />
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            My Favorites
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Your saved seafood products in one place.
          </p>
        </div>

        {/* EMPTY FAVORITES */}
        {!favorites || favorites.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm sm:p-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50">
              <FaHeart className="text-xl text-cyan-500" />
            </div>

            <h2 className="mt-3 text-xl font-bold text-gray-800 sm:text-2xl">
              No Favorites Yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              Save your favorite seafood products here so you can quickly
              find them later.
            </p>

            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Browse Seafood
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        ) : (
          /* FAVORITES GRID */
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {favorites.map((item) => {
              const image = Array.isArray(item.image)
                ? item.image[0]
                : item.image;

              return (
                <div
                  key={item._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {/* PRODUCT IMAGE */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={image}
                      alt={item.name}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
                    />

                    {/* REMOVE FAVORITE */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(item._id);
                      }}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow transition hover:bg-red-50"
                      title="Remove from favorites"
                      aria-label={`Remove ${item.name} from favorites`}
                    >
                      <FaTrash className="text-xs" />
                    </button>

                    {/* FAVORITE BADGE */}
                    <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-red-500 shadow">
                      Favorite
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="p-3 sm:p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-600">
                      {item.category}
                    </p>

                    <h2
                      className="mt-0.5 cursor-pointer truncate text-base font-bold text-gray-800 transition hover:text-cyan-700"
                      onClick={() => navigate(`/product/${item._id}`)}
                      title={item.name}
                    >
                      {item.name}
                    </h2>

                    {/* PRICE + CART */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
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
                          addToCart(item._id, item.minQuantity || 0.5)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700"
                        title="Add to cart"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <FaShoppingCart className="text-xs" />
                      </button>
                    </div>

                    {/* VIEW PRODUCT */}
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
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