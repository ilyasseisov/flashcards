import type React from "react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, Palette, Zap, Atom } from "lucide-react";
import { Badge } from "../ui/badge";

interface TechnologyProgress {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  current: number;
  total: number;
  percentage: number;
}

export default function Dashboard() {
  const technologies: TechnologyProgress[] = [
    {
      name: "HTML",
      icon: Code2,
      current: 3,
      total: 10,
      percentage: 30,
    },
    {
      name: "CSS",
      icon: Palette,
      current: 7,
      total: 12,
      percentage: 58,
    },
    {
      name: "JavaScript",
      icon: Zap,
      current: 5,
      total: 15,
      percentage: 33,
    },
    {
      name: "React",
      icon: Atom,
      current: 2,
      total: 8,
      percentage: 25,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-600">
          Track your learning journey across different technologies
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {technologies.map((tech) => (
          <Card key={tech.name} className="p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-md p-2">
                  <tech.icon className="text-primary h-6 w-6" />
                </div>
                <span className="text-lg font-semibold">{tech.name}</span>
              </div>
              <Badge variant="outline" className="font-bold">
                {tech.current}/{tech.total}
              </Badge>
            </div>
            <Progress value={tech.percentage} className="mb-2 h-2" />
            <p className="text-sm text-gray-500">{tech.percentage}% Complete</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
