'use client';

interface SkillRadarProps {
  skills: {
    skill: string;
    current: number;
    jobsRequiring: number;
  }[];
}

export default function SkillRadar({ skills }: SkillRadarProps) {
  const topSkills = skills.slice(0, 6);
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 5;

  // Calculate points for each skill
  const angleStep = (2 * Math.PI) / topSkills.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Create polygon path
  const polygonPoints = topSkills
    .map((skill, index) => {
      const point = getPoint(index, skill.current);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background levels */}
        {Array.from({ length: levels }).map((_, levelIndex) => {
          const levelRadius = ((levelIndex + 1) / levels) * maxRadius;
          const levelPoints = topSkills
            .map((_, index) => {
              const angle = angleStep * index - Math.PI / 2;
              return `${center + levelRadius * Math.cos(angle)},${
                center + levelRadius * Math.sin(angle)
              }`;
            })
            .join(' ');

          return (
            <polygon
              key={levelIndex}
              points={levelPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-neutral-200 dark:text-neutral-800"
            />
          );
        })}

        {/* Axis lines */}
        {topSkills.map((_, index) => {
          const endPoint = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-neutral-200 dark:text-neutral-800"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgb(59, 130, 246)"
          fillOpacity="0.3"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          className="transition-all duration-700"
        />

        {/* Data points */}
        {topSkills.map((skill, index) => {
          const point = getPoint(index, skill.current);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {topSkills.map((skill, index) => {
          const labelPoint = getPoint(index, 110);
          const angle = angleStep * index - Math.PI / 2;
          const isRight = Math.cos(angle) > 0;

          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={isRight ? 'start' : 'end'}
              className="text-xs fill-current text-black dark:text-white font-medium"
            >
              {skill.skill}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
