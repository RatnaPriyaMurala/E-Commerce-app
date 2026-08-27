import React, { useState, useEffect } from "react";
import { assests } from "../assets/assests";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

import {
  FaFish,
  FaImage,
  FaBoxes,
  FaWeightHanging,
  FaRupeeSign,
  FaSave,
  FaLeaf,
  FaFire,
  FaHeartbeat,
  FaClipboardList
} from "react-icons/fa";

const Add = ({ token }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const editingProduct = location.state?.product || null;

  // ===========================
  // STATES
  // ===========================

  const [category, setCategory] = useState("Live Fish");

  const [subCategory, setSubCategory] = useState("Boneless Fish");

  const [name, setName] = useState("");

  const [overview, setOverview] = useState("");

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState(0);

  const [isAvailable, setIsAvailable] = useState(true);

  const [bestseller, setBestseller] = useState(false);

  const [image, setImage] = useState(null);

  const [weight, setWeight] = useState({
    min: "",
    max: "",
  });

  const [description, setDescription] = useState({
    proteins: "",
    calories: "",
    vitamins: "",
    minerals: "",
    uses: "",
    benefits: "",
  });

  // ===========================
  // CATEGORY LIST
  // ===========================

  const categories = [
    "Live Fish",
    "Fresh Water Fish",
    "Sea Fish",
    "Kolkata Fish",
    "Prawns",
    "Crabs",
  ];

  const subCategories = [
    "Only Prawn Meat",
    "Boneless Apollo",
    "Only Crab Meat",
    "Boneless Fish",
  ];

  // ===========================
  // EDIT MODE
  // ===========================

  useEffect(() => {

    if (!editingProduct) return;

    setName(editingProduct.name);

    setOverview(editingProduct.overview || "");

    setCategory(editingProduct.category);

    setSubCategory(editingProduct.subCategory);

    setPrice(editingProduct.price);

    setStock(editingProduct.stock || 0);

    setIsAvailable(
      editingProduct.isAvailable ?? true
    );

    setBestseller(
      editingProduct.bestseller
    );

    setWeight({
      min: editingProduct.minQuantity,
      max: editingProduct.maxQuantity,
    });

    setDescription({

      proteins:
        editingProduct.description?.proteins || "",

      calories:
        editingProduct.description?.calories || "",

      vitamins:
        editingProduct.description?.vitamins || "",

      minerals:
        editingProduct.description?.minerals || "",

      uses:
        editingProduct.description?.uses || "",

      benefits:
        editingProduct.description?.benefits?.join("\n") || "",

    });

  }, [editingProduct]);

  // ===========================
  // SUBMIT PRODUCT
  // ===========================

  const onSubmitHandler = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("name", name);

      formData.append("overview", overview);

      formData.append("price", price);

      formData.append("category", category);

      formData.append(
        "subCategory",
        subCategory || ""
      );

      formData.append("stock", stock);

      formData.append(
        "isAvailable",
        isAvailable ? "true" : "false"
      );

      formData.append(
        "bestseller",
        bestseller
      );

      formData.append(
        "minWeight",
        weight.min
      );

      formData.append(
        "maxWeight",
        weight.max
      );

      const finalDescription = {

        ...description,

        benefits: description.benefits
          ? description.benefits
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

      };

      formData.append(
        "description",
        JSON.stringify(finalDescription)
      );

      if (image) {

        formData.append(
          "image",
          image
        );

      }

      if (editingProduct) {

        formData.append(
          "id",
          editingProduct._id
        );

      }

      const url = editingProduct

        ? `${backendUrl}/api/product/update`

        : `${backendUrl}/api/product/add`;

      const response = await axios.post(

        url,

        formData,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      if (response.data.success) {

        toast.success(response.data.message);

        setName("");

        setOverview("");

        setPrice("");

        setStock(0);

        setImage(null);

        setCategory("Live Fish");

        setSubCategory("Boneless Fish");

        setWeight({
          min: "",
          max: "",
        });

        setDescription({
          proteins: "",
          calories: "",
          vitamins: "",
          minerals: "",
          uses: "",
          benefits: "",
        });

        setIsAvailable(true);

        setBestseller(false);

        navigate("/list", {
          replace: true,
          state: null,
        });

      }

      else {

        toast.error(response.data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(error.message);

    }

  };
    return (

    <form
      onSubmit={onSubmitHandler}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >

      {/* ================= HEADER ================= */}

      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white shadow-xl">

        <div className="flex items-center gap-4">

          <FaFish className="text-5xl" />

          <div>

            <h1 className="text-3xl font-bold">

              {editingProduct
                ? "Update Product"
                : "Add New Product"}

            </h1>

            <p className="text-cyan-100 mt-2">

              Add premium seafood products with complete details.

            </p>

          </div>

        </div>

      </div>

      {/* ================= IMAGE CARD ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-3 mb-6">

          <FaImage className="text-cyan-600 text-2xl" />

          <h2 className="text-xl font-bold">

            Product Image

          </h2>

        </div>

        <div className="flex gap-6">

          <label
            htmlFor="image1"
            className="cursor-pointer"
          >

            <img

              src={
                image
                  ? URL.createObjectURL(image)
                  : editingProduct
                  ? editingProduct.image?.[0]
                  : assests.upload_area
              }

              className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 object-cover hover:scale-105 transition"

              alt=""

            />

          </label>

          <input

            hidden

            id="image1"

            type="file"

            onChange={(e)=>setImage(e.target.files[0])}

          />

        </div>

      </div>

      {/* ================= PRODUCT INFORMATION ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-3 mb-6">

          <FaClipboardList className="text-blue-600 text-2xl"/>

          <h2 className="text-xl font-bold">

            Product Information

          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-semibold">

              Product Name

            </label>

            <input

              type="text"

              value={name}

              onChange={(e)=>setName(e.target.value)}

              className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-cyan-500"

              placeholder="Fish Name"

              required

            />

          </div>

          <div>

            <label className="font-semibold">

              Overview

            </label>

            <textarea

              rows="3"

              value={overview}

              onChange={(e)=>setOverview(e.target.value)}

              className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-cyan-500"

              placeholder="Short Product Overview"

              required

            />

          </div>

        </div>

      </div>

      {/* ================= NUTRITION ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-3 mb-6">

          <FaHeartbeat className="text-red-500 text-2xl"/>

          <h2 className="text-xl font-bold">

            Nutrition Details

          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-semibold flex items-center gap-2">

              <FaLeaf className="text-green-600"/>

              Proteins

            </label>

            <input

              type="text"

              value={description.proteins}

              onChange={(e)=>

                setDescription({

                  ...description,

                  proteins:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

            />

          </div>

          <div>

            <label className="font-semibold flex items-center gap-2">

              <FaFire className="text-orange-500"/>

              Calories

            </label>

            <input

              type="text"

              value={description.calories}

              onChange={(e)=>

                setDescription({

                  ...description,

                  calories:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

            />

          </div>

          <div>

            <label className="font-semibold">

              Vitamins

            </label>

            <input

              type="text"

              value={description.vitamins}

              onChange={(e)=>

                setDescription({

                  ...description,

                  vitamins:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

            />

          </div>

          <div>

            <label className="font-semibold">

              Minerals

            </label>

            <input

              type="text"

              value={description.minerals}

              onChange={(e)=>

                setDescription({

                  ...description,

                  minerals:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

            />

          </div>

          <div className="md:col-span-2">

            <label className="font-semibold">

              Uses

            </label>

            <textarea

              rows="3"

              value={description.uses}

              onChange={(e)=>

                setDescription({

                  ...description,

                  uses:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

            />

          </div>

          <div className="md:col-span-2">

            <label className="font-semibold">

              Health Benefits

            </label>

            <textarea

              rows="5"

              value={description.benefits}

              onChange={(e)=>

                setDescription({

                  ...description,

                  benefits:e.target.value

                })

              }

              className="w-full mt-2 border rounded-xl p-3"

              placeholder="One benefit per line"

            />

          </div>

        </div>

      </div>
            {/* ================= CATEGORY + PRICE ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

        {/* CATEGORY */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-bold mb-5">
            Product Category
          </h2>

          <div className="space-y-5">

            <div>

              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                {categories.map((cat)=>(
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="block font-semibold mb-2">
                Sub Category
              </label>

              <select
                value={subCategory}
                onChange={(e)=>setSubCategory(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                {subCategories.map((sub)=>(
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* PRICE */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

            <FaRupeeSign className="text-green-600"/>

            Pricing

          </h2>

          <input
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            placeholder="Enter Product Price"
            required
            className="w-full border rounded-xl p-3"
          />

        </div>

      </div>

      {/* ================= STOCK ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-6">

        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

          <FaBoxes className="text-blue-600"/>

          Stock Management

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>

            <label className="block font-semibold mb-2">

              Available Stock (KG)

            </label>

            <input
              type="number"
              min="0"
              step="0.5"
              value={stock}
              onChange={(e)=>setStock(e.target.value)}
              className="w-full border rounded-xl p-3"
              required
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">

              Minimum Weight

            </label>

            <input
              type="number"
              value={weight.min}
              onChange={(e)=>
                setWeight({
                  ...weight,
                  min:e.target.value
                })
              }
              className="w-full border rounded-xl p-3"
              required
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">

              Maximum Weight

            </label>

            <input
              type="number"
              value={weight.max}
              onChange={(e)=>
                setWeight({
                  ...weight,
                  max:e.target.value
                })
              }
              className="w-full border rounded-xl p-3"
              required
            />

          </div>

        </div>

      </div>

      {/* ================= SWITCHES ================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-6">

        <h2 className="text-xl font-bold mb-5">
          Product Options
        </h2>

        <div className="flex flex-col md:flex-row gap-8">

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={bestseller}
              onChange={()=>
                setBestseller(!bestseller)
              }
            />

            <span className="font-medium">
              Bestseller Product
            </span>

          </label>

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e)=>
                setIsAvailable(e.target.checked)
              }
            />

            <span className="font-medium">
              Available For Orders
            </span>

          </label>

        </div>

      </div>

      {/* ================= SAVE BUTTON ================= */}

      <div className="w-full flex justify-end mt-8">

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:scale-105 transition text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl"
        >

          <FaSave/>

          {editingProduct
            ? "Update Product"
            : "Add Product"}

        </button>

      </div>

    </form>
  );
};

export default Add;