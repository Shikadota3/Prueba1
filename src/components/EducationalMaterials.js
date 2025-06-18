import React from 'react';
import { educationMaterials } from '../mock/education';

const EducationalMaterials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {educationMaterials.map(material => (
        <div key={material.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
          <p className="text-gray-600 mb-4">{material.description}</p>
          {material.type === 'video' ? (
            <a href={material.url} className="text-blue-500 hover:underline">Ver video</a>
          ) : (
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Descargar
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationalMaterials;