import React from 'react';

const EducationalCard = ({ title, description, imageUrl, videoUrl }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="text-gray-500">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Ver Video
          </a>
        )}
      </div>
    </div>
  );
};

export default EducationalCard;