import React, { useState, useLayoutEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import MindMap from './components/MindMap';
import PrintLayout from './components/PrintLayout';
import GalleryModal from './components/GalleryModal';
import { MindMapNode, MindMapLayout, MindMapObject } from './types';
import { Icon } from './components/Icons';
import { galleryMindMaps, iconList } from './data';

const App: React.FC = () => {
    // State for display mode
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // State for mind map data and layouts
    const [layouts, setLayouts] = useState<{ [key: string]: MindMapLayout }>({});
    const [activeMindMap, setActiveMindMap] = useState<MindMapObject | null>(null);
    const [generatedMindMap, setGeneratedMindMap] = useState<MindMapObject | null>(null);

    // State for AI generator
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for MindMap component dimensions
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions(); // Initial measurement and on activeMindMap change

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [activeMindMap]);

    const handleLayoutUpdate = (mapId: string, layout: MindMapLayout) => {
        setLayouts(prev => ({
            ...prev,
            [mapId]: layout,
        }));
    };
    
    const handleGenerateMindMap = async () => {
        if (!userInput.trim()) {
            setError("Please enter a description for your mind map.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // A schema for a leaf node (grandchild). It cannot have children.
            const mindMapGrandchildNodeSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The title of the node. Keep it concise." },
                    imageUrl: { type: Type.STRING, description: `An optional icon name. Must be one of: ${iconList.join(', ')}.` },
                },
                required: ["name"]
            };

            // A schema for a child node. Its children must be leaf nodes.
            const mindMapChildNodeSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The title of the node. Keep it concise." },
                    imageUrl: { type: Type.STRING, description: `An optional icon name. Must be one of: ${iconList.join(', ')}.` },
                    children: {
                        type: Type.ARRAY,
                        items: mindMapGrandchildNodeSchema
                    }
                },
                required: ["name"]
            };

            // The top-level schema for the entire mind map object. This defines a structure with a max depth.
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    mindMap: {
                       description: "The root node of the generated mind map.",
                       type: Type.OBJECT,
                       properties: {
                           name: { type: Type.STRING, description: "The title of the root node. Keep it concise." },
                           imageUrl: { type: Type.STRING, description: `An optional icon name. Do not use an icon for the root node.` },
                           children: {
                               type: Type.ARRAY,
                               items: mindMapChildNodeSchema
                           }
                       },
                       required: ["name"]
                    }
                },
                required: ["mindMap"]
            };
            
            const prompt = `You are an expert at creating structured mind maps. Based on the following text, generate a mind map in a hierarchical JSON format that strictly follows the provided schema.

User's Text:
"${userInput}"

Rules:
1. The root node should represent the main topic.
2. The 'name' property is the text displayed in a node. Keep it concise (2-4 words).
3. The 'children' property is an array of child nodes, creating the hierarchy.
4. The 'imageUrl' is an optional icon for a node. Choose the most relevant icon from this list ONLY: [${iconList.join(', ')}]. Do not use an icon if none are relevant. The root node should not have an icon.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const jsonText = response.text;
            const parsedJson = JSON.parse(jsonText);
            const mindMapData = parsedJson.mindMap;

            if (!mindMapData || !mindMapData.name) {
                throw new Error("The generated mind map is missing a root node or name.");
            }
            
            const newMindMap: MindMapObject = {
                title: mindMapData.name,
                id: `generated-${Date.now()}`,
                data: mindMapData,
            };

            setGeneratedMindMap(newMindMap);
            setActiveMindMap(newMindMap);

        } catch (e) {
            console.error("Error generating mind map:", e);
            setError("Sorry, something went wrong. The AI may have produced an invalid structure. Please try a different prompt.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPrintMode && activeMindMap && layouts[activeMindMap.id]) {
        return <PrintLayout 
                    mindMap={activeMindMap} 
                    layout={layouts[activeMindMap.id]} 
                    onExit={() => setIsPrintMode(false)} 
                />;
    }
    
    return (
        <div className="bg-transparent text-slate-800 min-h-screen flex flex-col antialiased">
            {isGalleryOpen && (
                <GalleryModal
                    galleryMindMaps={galleryMindMaps}
                    generatedMindMap={generatedMindMap}
                    activeMindMap={activeMindMap}
                    onClose={() => setIsGalleryOpen(false)}
                    onMapSelect={(map) => {
                        setActiveMindMap(map);
                        setIsGalleryOpen(false);
                    }}
                />
            )}
            <header className="p-4 shadow-md bg-white/70 backdrop-blur-sm border-b-2 border-slate-200 no-print flex flex-col items-center">
                <h1 className="text-4xl font-bold text-slate-700 tracking-wide mb-4">
                  <span className="title-underline">Create Your Own Mind Map</span>
                </h1>
                <div className="w-full max-w-4xl p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50">
                    <div className="flex flex-col md:flex-row gap-2 items-center">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="e.g., A plan for a successful product launch with phases for research, development, marketing, and post-launch analysis..."
                            className="w-full flex-grow p-3 text-lg text-slate-800 leading-loose bg-slate-50 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder:text-slate-600"
                            rows={3}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerateMindMap}
                            disabled={isLoading}
                            className="w-full md:w-auto px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300 transform bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-lg flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Icon name="loader" className="w-6 h-6 mr-2 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="sparkles" className="w-6 h-6 mr-2" />
                                    <span>Generate Mind Map</span>
                                </>
                            )}
                        </button>
                    </div>
                    {error && <p className="text-red-600 mt-2 text-center font-semibold">{error}</p>}
                </div>
            </header>
            
            <main className="flex-grow flex flex-col p-4">
                <div ref={containerRef} className="w-full h-full min-h-[50vh] flex-grow border-4 border-dashed border-slate-300 rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    {dimensions.width > 0 && dimensions.height > 0 && activeMindMap ? (
                        <MindMap
                            data={activeMindMap.data}
                            mapId={activeMindMap.id}
                            width={dimensions.width}
                            height={dimensions.height}
                            key={activeMindMap.id}
                            layout={layouts[activeMindMap.id]}
                            onLayoutUpdate={handleLayoutUpdate}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-2xl text-slate-500">Generate a mind map or choose one from the gallery!</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 flex justify-center items-center gap-4 no-print">
                    <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="px-6 py-2 text-md rounded-full transition-all duration-300 transform bg-white text-slate-700 border-2 border-slate-400 hover:bg-slate-100 hover:scale-105 shadow-lg flex items-center"
                        title="Browse the gallery of pre-made mind maps"
                    >
                        <Icon name="grid" className="w-5 h-5 mr-2" />
                        Open Mind Map Gallery
                    </button>
                    <button
                        onClick={() => setIsPrintMode(true)}
                        disabled={!activeMindMap || !layouts[activeMindMap.id]}
                        className="px-6 py-2 text-md rounded-full transition-all duration-300 transform bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg flex items-center disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                        title="Export the currently selected map as a PNG image"
                    >
                        <Icon name="download" className="w-5 h-5 mr-2" />
                        Export Selected Map
                    </button>
                </div>
            </main>
        </div>
    );
};

export default App;
