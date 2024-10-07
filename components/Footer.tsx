interface FooterProps { //ahora se le puede poner un className
  className?: string;
}

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Footer({ className = '' }: FooterProps) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const router = useRouter();

    // Check if tokens exist in localStorage to determine login status and seller status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sellerStatus = JSON.parse(localStorage.getItem('isSeller') || 'false');

  
    if (accessToken) {
      setIsLoggedIn(true);
      setIsSeller(sellerStatus);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

    // Redirect the user when "Publicar producto" button is clicked
    const handlePublishProductClick = () => {
      if (!isLoggedIn) {
        router.push('/login');
      } else if (!isSeller) {
        router.push('/register_seller');
      } else {
        router.push('/publish_product');
      }
    };

    // Redirect the user when "Publicar producto" button is clicked
    const handleOfferServicesClick = () => {
      if (!isLoggedIn) {
        router.push('/login');
      } else if (!isSeller) {
        router.push('/register_seller');
      } else {
        router.push('/offer_services');
      }
    };

  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Comprar</h3>
          <ul>
            <li className="mb-2"><a href="/products_catalog" className="hover:underline">Catálogo</a></li>
            <li className="mb-2"><a href="/lookfor_designer" className="hover:underline">Diseñadores</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Vender</h3>
          <ul>
            <li className="mb-2"><a onClick={handlePublishProductClick} style={{ cursor: 'pointer' }} className="hover:underline">Publicar</a></li>
            <li className="mb-2"><a onClick={handleOfferServicesClick} style={{ cursor: 'pointer' }} className="hover:underline">Ofrecer Servicios</a></li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="mb-2">FAQ</li>
            <li className="mb-2">Terminos y Condiciones</li>
            <li className="mb-2">Politica de Privacidad</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-right">&copy; 2023 Printcraft.<br/> All rights reserved.</h3>
        </div>
      </div>
    </div>
  </footer>
  );
}
