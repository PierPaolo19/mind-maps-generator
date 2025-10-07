import React from 'react';
import { MindMapObject } from '../types';
import { Icon } from './Icons';

// Card component is now local to the GalleryModal
const Card: React.FC<{map: MindMapObject, isActive: boolean, onClick: () => void, isGenerated?: boolean}> = ({ map, isActive, onClick, isGenerated }) => {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 ${
                isActive
                ? 'bg-blue-100 border-blue-400 ring-4 ring-blue-300/50'
                : 'bg-white border-slate-300 hover:border-blue-300'
            }`}
        >
            <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${isActive ? 'bg-blue-200' : 'bg-slate-100'}`}>
                    <Icon name={isGenerated ? "sparkles" : (map.data.imageUrl || 'pattern')} className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
                <h3 className={`text-lg font-semibold ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>{map.title}</h3>
            </div>
        </button>
    );
}

interface GalleryModalProps {
    galleryMindMaps: MindMapObject[];
    generatedMindMap: MindMapObject | null;
    activeMindMap: MindMapObject | null;
    onClose: () => void;
    onMapSelect: (map: MindMapObject) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
    galleryMindMaps,
    generatedMindMap,
    activeMindMap,
    onClose,
    onMapSelect,
}) => {
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print"
            onClick={onClose}
        >
            <div 
                className="bg-white/90 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b-2 border-slate-200">
                    <h2 className="text-3xl font-semibold text-slate-600">Mind Map Gallery</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <Icon name="close" className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <div className="p-4 overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedMindMap && (
                             <Card 
                                map={generatedMindMap}
                                isActive={activeMindMap?.id === generatedMindMap.id}
                                onClick={() => onMapSelect(generatedMindMap)}
                                isGenerated
                             />
                        )}
                        {galleryMindMaps.map((map) => (
                           <Card 
                                key={map.id}
                                map={map}
                                isActive={activeMindMap?.id === map.id}
                                onClick={() => onMapSelect(map)}
                           />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
