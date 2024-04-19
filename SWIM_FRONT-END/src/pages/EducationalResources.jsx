import React from "react";

const EducationalResources = () => {
  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        position: "absolute",
        top: "25px",
        left: 0,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#AFE1AF",
      }}
    >
      <h2 className="text-3xl font-bold mb-4 text-[#228B22]">
        Educational Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResourceCard
          title="Climate Change in Africa: Impacts and Solutions"
          description="Explore the impacts of climate change on agriculture, water resources, and communities in Africa. Learn about sustainable practices and adaptation strategies to mitigate these effects."
          link="https://www.uneca.org/climate-change-impacts-and-solutions-africa"
        />
        <ResourceCard
          title="Food Waste Reduction Strategies in Ghana"
          description="Discover effective strategies for reducing food waste in households and communities in Ghana. Learn about local initiatives and practical tips for minimizing food waste."
          link="https://www.fao.org/3/i3455e/i3455e.pdf"
        />
        {/* Add more resource cards here */}
        <ResourceCard
          title="Climate Change and Food Security in Ghana: A Statistical Analysis"
          description="Read a comprehensive statistical analysis of the correlation between climate change and food security in Ghana. This report provides insights into the challenges faced by Ghanaian farmers and potential adaptation measures."
          link="https://www.ghanaweb.com/GhanaHomePage/NewsArchive/Food-insecurity-looms-large-over-Ghana-as-effects-of-climate-change-bite-1116775"
        />
        <ResourceCard
          title="Sustainable Agriculture Practices for Climate Resilience in Africa"
          description="Learn about sustainable agriculture practices that enhance climate resilience in African countries. This guide offers practical advice and case studies from Ghana and other African nations."
          link="https://www.afdb.org/en/documents/document/sustainable-agriculture-practices-for-climate-resilience-in-africa-35026"
        />
        <ResourceCard
          title="Food Waste Reduction Initiatives in Ghana: Success Stories"
          description="Explore success stories of food waste reduction initiatives implemented in Ghanaian communities. This video series highlights innovative approaches and their positive impacts on food security and sustainability."
          link="https://www.youtube.com/watch?v=1234567890"
        />
      </div>
    </div>
  );
};

const ResourceCard = ({ title, description, link }) => {
  return (
    <div className="bg-[#AFE1AF] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <a href={link} className="text-blue-500 hover:underline">
        Learn more
      </a>
    </div>
  );
};

export default EducationalResources;
