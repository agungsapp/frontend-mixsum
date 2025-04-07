import React, { useCallback, useEffect, useState } from "react";

interface CountdownProps {
    endTime: number; // Timestamp dalam milidetik
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeLeft = useCallback(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
    }, [endTime]);

    useEffect(() => {
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [calculateTimeLeft]);

    return (
        <div className="flex justify-center gap-3">
            <button className="cursor-default rounded-2xl text-white bg-red-700 px-5 py-2.5 text-xl font-bold">{`${timeLeft.hours} Jam`}</button>
            <button className="cursor-default rounded-2xl text-white bg-red-700 px-5 py-2.5 text-xl font-bold">{`${timeLeft.minutes} Menit`}</button>
            <button className="cursor-default rounded-2xl text-white bg-red-700 px-5 py-2.5 text-xl font-bold">{`${timeLeft.seconds} Detik`}</button>
        </div>
    );
};

export default Countdown;
