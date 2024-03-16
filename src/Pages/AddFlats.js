import React from "react";
import FlatForm from "../Components/FlatForm";

export default function AddFlats() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Add Flats</h1>
      <FlatForm />  
    </div>
  );
}
