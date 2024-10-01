'use client'
import { API_URL } from "@/api/api"


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use router for redirection
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import StlViewerComponent from '@/components/RotateStlView';  // Ensure this path is correct
import { Product } from '@/types/Product';  // Import the Product type

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // Use Product type for products
  const [loading, setLoading] = useState(true);  // Add loading state
  const router = useRouter();  // For redirecting the user

  // Check if tokens exist in localStorage to determine login status and seller status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sellerStatus = JSON.parse(localStorage.getItem('isSeller') || 'false');  // Get seller status from localStorage

    if (accessToken) {
      setIsLoggedIn(true);  // User is logged in
      setIsSeller(sellerStatus);  // Set seller status
    } else {
      setIsLoggedIn(false);  // User is not logged in
    }
  }, []);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);  // Store the fetched products in state
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchProducts();  // Call the fetch function when the component mounts
  }, []);

  // Redirect the user when "Publicar Producto" is clicked
  const handlePublishProductClick = () => {
    if (!isLoggedIn) {
      // Redirect to login/register page if not logged in
      router.push('/login');
    } else if (!isSeller) {
      // Redirect to create seller page if logged in but not a seller
      router.push('/register_seller');
    } else {
      // Redirect to publish product page if logged in and is a seller
      router.push('/publish_product');
    }
  };

  // Show a loading screen while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="text-lg font-bold">Loading...</div>
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-white rounded-full ml-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="relative mb-12 bg-gray-800">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg overflow-hidden pl-8">
            <div className="w-1/2 space-y-4 text-center">
              <h2 className="text-4xl font-bold mb-4">
                La Impresión 3D, más fácil que nunca.
              </h2>
              <h3 className="mb-4">
                Nunca más le vas a tener que pedir el cosito al ferretero.
              </h3>

              {/* Conditionally render the "Regístrate" button based on login status */}
              {!isLoggedIn && (
                <a href="./register">
                  <button className="bg-white text-black py-6 px-16 rounded-full font-bold text-lg mt-10">
                    Ver Catalogo
                  </button>
                </a>
              )}
            </div>

            <div className="w-1/2 h-[400px]">
              <StlViewerComponent url="/Capybara.stl" />
            </div>
          </div>
        </section>

        {/* Conditionally render the "Elegidos para vos" section only if products are available */}
        {products.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Elegidos para vos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (  // Get 4 random products
                <ProductCard
                  key={product.code}
                  product={{
                    code: product.code,
                    name: product.name,
                    material: product.material,
                    stock: product.stock,
                    description: product.description,
                    image_url: product.image_url,
                    seller: product.seller,
                    price: product.price
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <section className="relative mb-12">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg overflow-hidden pl-8">

            <div className="w-1/2 h-[400px]">
              <StlViewerComponent url="/Printer.stl" />
            </div>

            <div className="w-1/2 space-y-4 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Necesitas algo específico?
              </h2>
              <h3 className="mb-4">
                Conectá con vendedores especializados.
              </h3>

              {/* Conditionally render the "Regístrate" button based on login status */}
              {!isLoggedIn && (
                <a href="./register">
                  <button className="bg-white text-black py-6 px-16 rounded-full font-bold text-lg mt-10">
                    Contactar
                  </button>
                </a>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}


