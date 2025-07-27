import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

interface CountdownProps {
    endTime: number; // Timestamp dalam milidetik
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
    const [timeDisplay, setTimeDisplay] = useState<string[]>([]);

    const calculateTimeLeft = useCallback(() => {
        const now = dayjs();
        const end = dayjs(endTime);
        const diff = end.diff(now);

        if (diff <= 0) {
            setTimeDisplay(["Promo telah berakhir"]);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
            setTimeDisplay([
                `${days} Hari`,
                `${hours} Jam`,
                `${minutes} Menit`,
                `${seconds} Detik`,
            ]);
        } else if (hours > 0) {
            setTimeDisplay([
                `${hours} Jam`,
                `${minutes} Menit`,
                `${seconds} Detik`,
            ]);
        } else {
            setTimeDisplay([`${minutes} Menit`, `${seconds} Detik`]);
        }
    }, [endTime]);

    useEffect(() => {
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000); // Update setiap detik
        return () => clearInterval(interval);
    }, [calculateTimeLeft]);

    if (timeDisplay.length === 0) {
        return null;
    }

    return (
        <div className="flex justify-center gap-3">
            {timeDisplay.map((time, index) => (
                <button
                    key={index}
                    className="cursor-default rounded-2xl text-white bg-red-700 px-5 py-2.5 text-xl font-bold"
                >
                    {time}
                </button>
            ))}
        </div>
    );
};

export default Countdown;
