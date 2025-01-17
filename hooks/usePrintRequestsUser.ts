import { useState, useEffect } from 'react';
import { API_URL } from '@/api/api';
import { PrintRequest } from '@/types/PrintRequests';
import { useRouter, useParams } from 'next/navigation'; // Ensure this import is correct
import { AuctionResponse } from '@/types/AuctionResponse';

const usePrintRequestsUser = (requestType: 'print-requests' | 'design-requests' | 'design-reverse-auctions' | 'print-reverse-auction' ) => {
  const [printRequests, setPrintRequests] = useState<PrintRequest[]>([]);
  const [expandedTable, setExpandedTable] = useState<string | null>(null); // Manage expanded table
  const router = useRouter(); 
  const [responses, setResponses] = useState<AuctionResponse[]>([]);


  // Function to fetch the print requests and their store names
 
  // Fetch print requests from the API
  useEffect(() => {
    const fetchPrintRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/${requestType}/mine/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const data: PrintRequest[] = await response.json();
          setPrintRequests(data);
          
        } else {
          console.error('Failed to fetch print requests');
        }
      } catch (error) {
        console.error('Error fetching print requests:', error);
      }
    };

    fetchPrintRequests();
  }, [requestType]);


  const handleAcceptResponse = async (requestID: number, responseID: number) => {

    console.log('Aceptando respuesta:', responseID, 'para solicitud:', requestID);

      const response = await fetch(`${API_URL}/${requestType}/${requestID}/accept-response/${responseID}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      alert('Oferta aceptada exitosamente');
      window.location.reload();

      /*
    try {
      console.log('Aceptando respuesta:', responseID, 'para solicitud:', requestID);

      const response = await fetch(`${API_URL}/${requestType}/${requestID}/accept-response/${responseID}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      alert('Oferta aceptada exitosamente');
      window.location.reload();

    /*  if (response.ok) {
        console.log('Respuesta aceptada exitosamente:', data);
        
        setPrintRequests(prevRequests => 
          prevRequests.map(req => 
            req.requestID === requestID 
              ? { ...req, status: 'Aceptada' } 
              : req
          )
        );

        alert('Oferta aceptada exitosamente');
        window.location.reload();
      } else {
        console.error('Error al aceptar la respuesta:', data.error || 'Error desconocido');
        alert(data.error || 'Error al aceptar la oferta');
      }
    } catch (error) {
      console.error('Error al aceptar la respuesta:', error);
      alert('Error al aceptar la oferta. Por favor, intente nuevamente.');
    }*/
  };
  

  // Handle Decline Request
  const handleDeclineRequest = async (requestID: number) => {
    try {
      console.log('Original requestType:', requestType);
      
      const apiRequestType = requestType === 'design-reverse-auctions' 
        ? 'design-reverse-auction'
        : requestType;
      
      console.log('API requestType:', apiRequestType);

      const url = `${API_URL}/${apiRequestType}/${requestID}/user-respond/`;
      console.log('URL final:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: 'Reject',
        }),
      });

      if (response.ok) {
        setPrintRequests((prevRequests) =>
          prevRequests.filter((request) => request.requestID !== requestID)
        );
        alert('Request declined!');
      } else {
        console.error('Failed to decline the request');
      }
    } catch (error) {
      console.error('Error declining the request:', error);
    }
  };

  const handleRequestResponses = async (requestID: number) => {
    try {
      const response = await fetch(`${API_URL}/${requestType}/${requestID}/responses/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponses(data);
        return data;
      } else {
        console.error('Error al obtener las respuestas');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener las respuestas:', error);
      return [];
    }
  };

  // Handle Accept Request
  const handleAcceptRequest = async (requestID: number) => {
    try {
      const response = await fetch(`${API_URL}/${requestType}/${requestID}/user-respond/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: 'Accept',
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const preferenceID = data.preference_id; // Extract preference ID
        const payment_link = data.payment_link; 

        // Update the status of the request to 'Cotizada'
        setPrintRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.requestID === requestID
              ? { ...request, status: 'Cotizada' }
              : request
          )
        );
  
        // If preference ID exists, navigate to the Mercado Pago page with the ID
        if (preferenceID) {
          router.push(`/mp_pref/${preferenceID}`);
        }else if(payment_link){
          router.push(payment_link);
        }
  
      } else {
        console.error('Failed to accept the request');
      }
    } catch (error) {
      console.error('Error accepting the request:', error);
    }
  };

  // Filter requests into different statuses
  const pendingRequests = printRequests.filter((req: PrintRequest) => 
    requestType === "design-reverse-auctions" || requestType === "print-reverse-auction" 
      ? true 
      : req.status === 'Pendiente'
  );
  
  // Para reverse auctions, no necesitamos los otros estados
  const quotedRequests = requestType === "design-reverse-auctions" || requestType === "print-reverse-auction"
    ? [] 
    : printRequests.filter((req: PrintRequest) => req.status === 'Cotizada');
  
  const acceptedRequests = requestType === "design-reverse-auctions" || requestType === "print-reverse-auction"
    ? [] 
    : printRequests.filter((req: PrintRequest) => req.status === 'Aceptada');
  
  const finalizedRequests = requestType === "design-reverse-auctions" || requestType === "print-reverse-auction"
    ? [] 
    : printRequests.filter((req: PrintRequest) => req.status === 'Realizada');
  
  const deliveredRequests = requestType === "design-reverse-auctions" || requestType === "print-reverse-auction"
    ? [] 
    : printRequests.filter((req: PrintRequest) => req.status === 'Entregada');

  return {
    pendingRequests,
    quotedRequests,
    acceptedRequests,
    finalizedRequests,
    deliveredRequests,
    expandedTable,
    setExpandedTable,
    handleAcceptResponse,
    handleDeclineRequest,
    handleAcceptRequest,
    handleRequestResponses,
    responses,
  };
};

export default usePrintRequestsUser;


