import Image from 'next/image';
import StlViewerComponent from '@/components/RotateStlView';  // Ensure this path is correct
import StarIcon from '@/components/StarIcon';
import { Product } from '@/types/Product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (

    <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* Container with fixed size for consistent image and STL rendering */}
      <div className="h-48 w-full flex items-center justify-center bg-gray-700">
        {product.stlUrl ? (
          <StlViewerComponent url={product.stlUrl} width={200} height={200} className="max-h-full max-w-full" />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>


      {/* <Link href={`/product/${product.id}`}> */}
      <Link href={"/products_catalog"}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-400 mb-2">{product.category}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>




    </div>
  );
};

export default ProductCard;







//OBS NO BORRAR:
//SI DESPUES CAMBIAMOS EL SLT VIEWER PARA QUE SIEMPRE GIRE Y NO HACE FALTA TOCARLO, PODEMOS USAR LO DE ABAJO PARA QUE TODO EL RECUADRO SEA EL LINK


// import Link from 'next/link';
// import Image from 'next/image';
// import StlViewerComponent from '@/components/RotateStlView';  // Ensure this path is correct
// import StarIcon from '@/components/StarIcon';
// import { Product } from '@/types/Product'; 

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   return (
//     <Link href={`/product/${product.id}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg block">
//       <div className="h-48 w-full flex items-center justify-center bg-gray-700">
//         {product.stlUrl ? (
//           <StlViewerComponent url={product.stlUrl} width={200} height={200} className="max-h-full max-w-full" />
//         ) : (
//           <Image
//             src={product.image}
//             alt={product.name}
//             width={200}
//             height={200}
//             className="max-h-full max-w-full object-contain"
//           />
//         )}
//       </div>

//       <div className="p-4">
//         <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
//         <p className="text-gray-400 mb-2">{product.category}</p>
//         <div className="flex justify-between items-center">
//           <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
//           <div className="flex items-center">
//             <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
//             <span>{product.rating.toFixed(1)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
