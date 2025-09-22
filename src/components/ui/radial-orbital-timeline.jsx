"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };

      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center
                 bg-white text-black dark:bg-black dark:text-white
                 overflow-auto select-none transition-colors duration-500"
      ref={containerRef}
      onClick={handleContainerClick}
      aria-label="Radial orbital timeline of project sections"
      role="region"
    >
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(0px, 0px)`,
          }}
        >
          {/* Central NASA Icon */}
          <div
            className="absolute w-28 h-28 rounded-full animate-pulse flex items-center justify-center z-10 cursor-default"
            aria-hidden="true"
          >
            <div className="absolute w-24 h-24 rounded-full border border-black dark:border-white animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-black/80 dark:border-white/80 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Black icon for light mode */}
            <img
              src="public/assets/nasa-black-icon.png"
              alt="NASA Logo Black"
              className="object-contain block dark:hidden"
              draggable={false}
            />
            {/* White icon for dark mode */}
            <img
              src="public/assets/nasa-white-icon.png"
              alt="NASA Logo White"
              className="object-contain hidden dark:block"
              draggable={false}
            />
          </div>

          {/* Orbit ring */}
          <div
            className="absolute w-96 h-96 rounded-full border border-black/70 dark:border-white/70"
            aria-hidden="true"
          ></div>

          {/* Orbiting nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`Project section: ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(item.id);
                  }
                }}
              >
                {/* Pulsing halo */}
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%)`,
                    width: "56px",
                    height: "56px",
                    left: "-8px",
                    top: "-8px",
                  }}
                ></div>

                {/* Node circle with icon */}
                <div
                  className={`
                    w-18 h-18 rounded-full flex items-center justify-center
                    ${
                      isExpanded
                        ? "bg-white text-black"
                        : isRelated
                        ? "bg-white/50 text-black"
                        : "bg-white dark:bg-black text-black dark:text-white"
                    }
                    border-2 
                    ${
                      isExpanded
                        ? "border-black dark:border-white shadow-lg shadow-black/30 dark:shadow-white/30"
                        : isRelated
                        ? "border-black dark:border-white animate-pulse"
                        : "border-black/40 dark:border-white/40"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-125" : ""}
                  `}
                >
                  <Icon size={28} aria-hidden="true" />
                </div>

                {/* Node title */}
                <div
                  className={`
                    absolute top-18 whitespace-nowrap
                    text-xs font-semibold tracking-wider
                    transition-all duration-300
                    ${
                      isExpanded
                        ? "text-black dark:text-white scale-110"
                        : "text-black/90 dark:text-white/90"
                    }
                  `}
                >
                  <span className={`${isExpanded ? "hidden" : "visible"}`}>
                    {item.title}
                  </span>
                </div>

                {/* Expanded card with detailed textual content */}
                {isExpanded && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 max-w-xs z-30">
                    {/* Gradient border layer */}
                    <div
                      className="absolute -inset-0.5 rounded-lg animate-spin-slow"
                      style={{
                        background: "conic-gradient(#3b82f6, #22c55e, #3b82f6)", // blue-green gradient
                        zIndex: 0,
                      }}
                    ></div>

                    {/* Card content */}
                    <Card className="relative w-full bg-white dark:bg-black/90 backdrop-blur-lg rounded-lg overflow-auto max-h-[300px] shadow-xl shadow-black/10 dark:shadow-white/10 z-10 transition-colors duration-500">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-black/50 dark:bg-white/50"></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm mt-2 text-black dark:text-white">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-black/80 dark:text-white/80 whitespace-pre-line">
                        {item.content}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
