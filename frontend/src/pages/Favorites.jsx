import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaFish,
} from "react-icons/fa";

const Favorites = () => {
  const {
    favorites = [],
    removeFavorite,
    addToCart,
    currency,
    navigate,
  } = useContext(ShopContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-12 px-4">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
            <FaHeart className="text-white text-3xl" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              My Favorites
            </h1>

            <p className="text-gray-500 mt-2">
              Your favourite seafood products in one place.
            </p>
          </div>

        </div>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-14 text-center">

          <div className="w-28 h-28 mx-auto rounded-full bg-pink-100 flex items-center justify-center">
            <FaFish className="text-5xl text-pink-500" />
          </div>

          <h2 className="text-3xl font-bold mt-8">
            No Favorites Yet
          </h2>

          <p className="text-gray-500 mt-4">
            Save your favourite seafood products and access them quickly
            anytime.
          </p>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-semibold hover:scale-105 transition"
          >
            Browse Seafood
          </button>

        </div>

      ) : (

        /* Favorites Products */
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {favorites.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition"
            >

              {/* Product Image */}
              <div className="relative">

                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />

                {/* Remove Favorite */}
                <div className="absolute top-4 right-4">

                  <button
                    type="button"
                    onClick={() => removeFavorite(item._id)}
                    aria-label={`Remove ${item.name} from favorites`}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                  >
                    <FaTrash />
                  </button>

                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {item.category}
                </p>

                <div className="flex justify-between items-center mt-6">

                  <span className="text-2xl font-bold text-teal-700">
                    {currency}
                    {item.price}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        item._id,
                        item.minQuantity || 0.5
                      )
                    }
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white hover:scale-105 transition"
                  >
                    <FaShoppingCart />
                    Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Favorites;