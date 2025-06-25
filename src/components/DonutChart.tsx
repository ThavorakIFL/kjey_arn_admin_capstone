"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface GenreStats {
    genre: string;
    count: number;
    color: string;
}

export interface DonutChartProps {
    totalBooks: number;
    data: GenreStats[];
    className?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    className = "",
    totalBooks,
}) => {
    const [animatedData, setAnimatedData] = useState<
        (GenreStats & {
            animatedPercentage: number;
            startAngle: number;
            endAngle: number;
        })[]
    >([]);

    const total = data.reduce((sum, item) => sum + item.count, 0);
    const size = 192; // 48 * 4 (w-48 h-48)
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        // Calculate angles and percentages
        let currentAngle = 0;
        const processedData = data.map((item) => {
            const percentage = (item.count / total) * 100;
            const angle = (item.count / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            return {
                ...item,
                animatedPercentage: 0,
                startAngle,
                endAngle,
            };
        });

        setAnimatedData(processedData);

        // Trigger animation
        const timer = setTimeout(() => {
            setAnimatedData((prev) =>
                prev.map((item) => ({
                    ...item,
                    animatedPercentage: (item.count / total) * 100,
                }))
            );
        }, 200);

        return () => clearTimeout(timer);
    }, [data, total]);

    const createPath = (
        startAngle: number,
        endAngle: number,
        animationProgress: number = 1
    ) => {
        const actualEndAngle =
            startAngle + (endAngle - startAngle) * animationProgress;

        if (actualEndAngle <= startAngle) return "";

        const startAngleRad = (startAngle - 90) * (Math.PI / 180);
        const endAngleRad = (actualEndAngle - 90) * (Math.PI / 180);

        const x1 = size / 2 + radius * Math.cos(startAngleRad);
        const y1 = size / 2 + radius * Math.sin(startAngleRad);
        const x2 = size / 2 + radius * Math.cos(endAngleRad);
        const y2 = size / 2 + radius * Math.sin(endAngleRad);

        const largeArcFlag = actualEndAngle - startAngle > 180 ? 1 : 0;

        return `M ${size / 2} ${
            size / 2
        } L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
        <Card className={`border-0 shadow-sm ${className}`}>
            <CardContent>
                {/* Functional Donut Chart */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg
                        width={size}
                        height={size}
                        className="transform -rotate-90"
                    >
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth={strokeWidth}
                        />

                        {/* Data segments */}
                        {animatedData.map((item, index) => {
                            const animationProgress =
                                item.animatedPercentage /
                                ((item.count / total) * 100);
                            const path = createPath(
                                item.startAngle,
                                item.endAngle,
                                animationProgress
                            );

                            return (
                                <path
                                    key={index}
                                    d={path}
                                    fill={item.color}
                                    className="transition-all duration-1000 ease-out"
                                    opacity={0.9}
                                />
                            );
                        })}

                        {/* Inner circle to create donut effect */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius - strokeWidth / 2}
                            fill="white"
                        />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {totalBooks}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Books
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    {data.map((genre, index) => {
                        const percentage = (
                            (genre.count / total) *
                            100
                        ).toFixed(1);
                        const correspondingAnimated = animatedData[index];
                        const isAnimating =
                            correspondingAnimated &&
                            correspondingAnimated.animatedPercentage <
                                (genre.count / total) * 100;

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full transition-all duration-300"
                                        style={{ backgroundColor: genre.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {genre.genre}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        {genre.count} Books
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({percentage}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default DonutChart;
