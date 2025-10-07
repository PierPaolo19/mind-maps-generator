import { MindMapNode } from './types';

const completeLandscape: MindMapNode = {
  name: "Reusable AI Patterns",
  children: [
    { name: "Industry Verticals", imageUrl: 'industry-verticals' },
    { name: "Horizontal Functions", imageUrl: 'horizontal-fn' },
    { name: "Reusable AI Patterns", imageUrl: 'pattern' },
  ],
};

const businessAndFinance: MindMapNode = {
  name: "Business & Finance Verticals",
  imageUrl: "briefcase",
  children: [
    { name: "Insurance", imageUrl: "shield", children: [ { name: "Smarter Underwriting" }, { name: "Automated Claims" }, { name: "Next-Gen Fraud Detection" } ] },
    { name: "Finance", imageUrl: "bank", children: [ { name: "The Financial Co-Pilot" }, { name: "Automated Compliance (RegTech)" }, { name: "Market Intelligence on Demand" } ] },
    { name: "Legal", imageUrl: "scales", children: [ { name: "AI-Powered Document Review" }, { name: "Intelligent Legal Research" }, { name: "Automated Contract Drafting" } ] },
    { name: "Real Estate & Construction", imageUrl: "home", children: [ { name: "Generative Architectural Design" }, { name: "Automated Construction Planning" }, { name: "Dynamic Property Listings" } ] },
  ]
};

const consumerAndServices: MindMapNode = {
  name: "Consumer & Services Verticals",
  imageUrl: "cart",
  children: [
    { name: "Retail & CPG", imageUrl: "cart", children: [ { name: "The AI Shopping Assistant" }, { name: "Resilient Supply Chains" }, { name: "Content That Converts" } ] },
    { name: "Travel & Hospitality", imageUrl: "plane", children: [ { name: "AI-Powered Trip Planning" }, { name: "Dynamic Pricing" }, { name: "Proactive Disruption Management" } ] },
    { name: "Media & Entertainment", imageUrl: "camera", children: [ { name: "AI-Assisted Creativity" }, { name: "Intelligent Archives" }, { name: "Localization at Scale" } ] },
    { name: "Logistics & Transportation", imageUrl: "truck", children: [ { name: "Dynamic Route Optimization" }, { name: "Intelligent Document Processing" }, { name: "Predictive Disruption Analysis" } ] },
  ]
};

const techAndInfrastructure: MindMapNode = {
  name: "Tech & Infra Verticals",
  imageUrl: "server",
  children: [
    { name: "Manufacturing", imageUrl: "factory", children: [ { name: "Generative Design" }, { name: "Predictive Maintenance" }, { name: "Automated Quality Control" } ] },
    { name: "Telecommunications", imageUrl: "telecom", children: [ { name: "Proactive Network Operations" }, { name: "AI-Powered Field Service" }, { name: "Smart Contract Analysis" } ] },
    { name: "Energy & Utilities", imageUrl: "bolt", children: [ { name: "Grid Management" }, { name: "Predictive Maintenance" }, { name: "Renewable Energy Optimization" } ] },
    { name: "Automotive", imageUrl: "car", children: [ { name: "Intelligent In-Vehicle Assistant" }, { name: "AI-Powered Diagnostics" }, { name: "Accelerated Vehicle Design" } ] },
  ]
};

const publicAndSocial: MindMapNode = {
    name: "Public & Social Verticals",
    imageUrl: "users",
    children: [
        { name: "Healthcare & Life Sciences", imageUrl: "heart", children: [ { name: "AI-Powered Drug Discovery" }, { name: "The End of Clinical Paperwork" }, { name: "Synthetic Data for Research" } ] },
        { name: "Public Sector", imageUrl: "building", children: [ { name: "Intelligent Constituent Services" }, { name: "Policy Analysis & Simulation" }, { name: "Automated Grant Processing" } ] },
        { name: "Education", imageUrl: "book", children: [ { name: "Personalized Learning Assistants" }, { name: "Curriculum Development" }, { name: "Administrative Co-pilot" } ] },
    ]
}

const horizontalFunctions: MindMapNode = {
  name: "Horizontal Business Functions",
  imageUrl: "horizontal-fn",
  children: [
    { name: "Human Resources (HR)", imageUrl: "users", children: [ { name: "The Talent Co-pilot" }, { name: "Frictionless Onboarding" } ] },
    { name: "Sales & Marketing", imageUrl: "cart", children: [ { name: "Hyper-Personalized Campaigns" }, { name: "The Sales Assistant" } ] },
    { name: "IT & Cybersecurity", imageUrl: "server", children: [ { name: "The Developer’s Co-pilot" }, { name: "Intelligent Incident Management" } ] },
    { name: "Corporate Finance", imageUrl: "bank", children: [ { name: "Automated Financial Storytelling" }, { name: "Intelligent Expense Processing" } ] },
  ],
};

const interconnectedPatterns: MindMapNode = {
  name: "Reusable AI Patterns",
  imageUrl: "pattern",
  children: [
    { name: "Synthetic Data Generation", imageUrl: "server", children: [ { name: "Fraud Detection (Finance)" }, { name: "Predictive Maintenance" } ] },
    { name: "Hyper-Personalization", imageUrl: "users", children: [ { name: "Shopping Assistants (Retail)" }, { name: "Financial Co-Pilots (Finance)" } ] },
    { name: "Information Synthesis", imageUrl: "book", children: [ { name: "Market Intelligence (Finance)" }, { name: "Clinical Summarization (Healthcare)" } ] },
    { name: "Conversational Interfaces", imageUrl: "chat", children: [ { name: "Customer Support (All)" }, { name: "In-Vehicle Assistant" } ] },
    { name: "Simulation & Digital Twins", imageUrl: "layers", children: [ { name: "Supply Chain (Retail)" }, { name: "Network Operations (Telco)" } ] },
    { name: "Content Generation", imageUrl: "edit", children: [ { name: "Marketing Copy (Sales)" }, { name: "Code Generation (IT)" } ] },
  ],
};

export const galleryMindMaps: { title: string; id: string; data: MindMapNode }[] = [
    { title: "The Complete Landscape", id: "landscape", data: completeLandscape },
    { title: "Business & Finance", id: "finance", data: businessAndFinance },
    { title: "Consumer & Services", id: "consumer", data: consumerAndServices },
    { title: "Tech & Infrastructure", id: "tech", data: techAndInfrastructure },
    { title: "Public & Social", id: "social", data: publicAndSocial },
    { title: "Horizontal Functions", id: "horizontal", data: horizontalFunctions },
    { title: "Interconnected Patterns", id: "patterns", data: interconnectedPatterns },
];

export const iconList: string[] = [
    'briefcase', 'cart', 'server', 'users', 'shield', 'bank', 'scales', 
    'home', 'plane', 'camera', 'truck', 'factory', 'telecom', 'bolt', 'car',
    'heart', 'building', 'book', 'pattern', 'horizontal-fn', 'industry-verticals',
    'edit', 'chat', 'layers'
];