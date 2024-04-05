import React from 'react';
import Header from '../components/Header';
import FlatsTable from '../components/FlatsTable';
import EditFlatForm from '../components/EditFlatForm'; // Importa el componente de edición de flats

export default function FlatsPage() {
  return (
    <div>
      <Header/>
      <div className="container">
        <h1>EditFlats</h1>
        <EditFlatForm/> {/* Renderiza el componente de edición de flats */}
      </div>
    </div>
  );
}
