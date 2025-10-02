import React, { useState } from "react";
import MainFeed from "./MainFeed";
import RightSidebar from "./RightSidebar";
import "./EcoPathCommunity.css";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("Hot");

  return (
    <div className="ecopath-container">
      <MainFeed activeTab={activeTab} setActiveTab={setActiveTab} />
      <RightSidebar />
    </div>
  );
};

export default CommunityPage;
