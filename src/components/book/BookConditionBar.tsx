// components/book/BookConditionBar.tsx
interface BookConditionBarProps {
    condition?: string | number;
    className?: string;
}

export default function BookConditionBar({
    condition,
    className = "",
}: BookConditionBarProps) {
    // Convert condition to percentage - handles multiple input types:
    // - Numbers: 76 -> 76%
    // - Strings with %: "76%" -> 76%
    // - Text conditions: "Good" -> 60%
    // - null/undefined -> 50% (default)
    const getConditionPercentage = (condition?: string | number): number => {
        if (!condition) return 50; // Default to 50% if no condition specified

        // Ensure condition is a string
        const conditionString = String(condition);
        const conditionLower = conditionString.toLowerCase();

        // If it's already a percentage
        if (conditionLower.includes("%")) {
            const percentage = parseInt(conditionLower.replace("%", ""));
            return isNaN(percentage)
                ? 50
                : Math.min(Math.max(percentage, 0), 100);
        }

        // If it's a pure number (like 76 instead of "76%")
        const numericValue = parseFloat(conditionString);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            return numericValue;
        }

        // Map condition strings to percentages
        const conditionMap: Record<string, number> = {
            poor: 20,
            fair: 40,
            good: 60,
            "very good": 76,
            excellent: 90,
            "like new": 95,
            new: 100,
        };

        return conditionMap[conditionLower] || 76; // Default to 76% (Very Good) like in the image
    };

    const getConditionLabel = (condition?: string | number): string => {
        if (!condition) return "Very Good";

        // Ensure condition is a string
        const conditionString = String(condition);

        // If it's already a percentage, convert to label
        if (conditionString.includes("%")) {
            const percentage = parseInt(conditionString.replace("%", ""));
            if (isNaN(percentage)) return "Very Good";
            if (percentage >= 95) return "Like New";
            if (percentage >= 85) return "Excellent";
            if (percentage >= 70) return "Very Good";
            if (percentage >= 50) return "Good";
            if (percentage >= 30) return "Fair";
            return "Poor";
        }

        // If it's a pure number, convert to label
        const numericValue = parseFloat(conditionString);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            if (numericValue >= 95) return "Like New";
            if (numericValue >= 85) return "Excellent";
            if (numericValue >= 70) return "Very Good";
            if (numericValue >= 50) return "Good";
            if (numericValue >= 30) return "Fair";
            return "Poor";
        }

        return conditionString;
    };

    const percentage = getConditionPercentage(condition);
    const label = getConditionLabel(condition);

    // Determine color based on percentage
    const getProgressColor = (percentage: number): string => {
        if (percentage >= 80) return "bg-green-500";
        if (percentage >= 60) return "bg-yellow-500";
        if (percentage >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const progressColor = getProgressColor(percentage);

    return (
        <div className={`${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Condition</h3>
                <span className="text-sm text-gray-600">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Condition Label */}
            <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
    );
}
