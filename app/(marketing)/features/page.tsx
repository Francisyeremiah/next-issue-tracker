import React from "react";
import { FeaturedCardType} from "@/types";

export default function FeaturesPage(){
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl text-gray-400">
                    Features
                </h1>
                <p className="text-xl text-gray-400">
                    Discover how Linear Clone can help you manage your projects more efficiently.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:cols-3 gap-8 mb-16">
                <FeaturedCard 
                    title="Issue Tracking"
                    description="Create, assign, and track issues with ease. Set priorities, due dates, and statuses to keep your team on track."
                />
                <FeaturedCard 
                    title="Intuitive UI"
                    description="A clean, modern interface that makes project management a breeze. No clutter, just what you need to get work done."
                />
                <FeaturedCard 
                    title="Collaboration"
                    description="Work together seamlessly. Comment on issues, mention team members, and keep everyone in the loop."
                />
                <FeaturedCard 
                    title="Custom Workflows"
                    description="Create workflows that match your team's process. Customize statuses, labels, and more."
                />
                <FeaturedCard 
                    title="Real-time Uptodates"
                    description="See changes as they hapen. No need to refresh or wait for updates."
                />
                <FeaturedCard 
                    title="Powerfull Search"
                    description="Find anything instantly with our powerfull search. filter by assignee, status, priority, and more."
                />
            </div>
        </div>
    );
}

function FeaturedCard({title,description}: FeaturedCardType){
    return (
        <div className="
            bg-gray-800 p-6 rounded-lg shadow-sm border 
            border-gray-700"
        >
            <h3 className="text-xl font-semibold mb-2 text-white">
                {title}
            </h3>
            <p className="text-gray-400">
                {description}
            </p>
        </div>
    );
}

