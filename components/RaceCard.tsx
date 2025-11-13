"use client";
import { motion } from "framer-motion";
import useCountdown from "@/lib/useCountdown";

interface RaceCardProps {
  title: string;
  circuit: string;
  date: string;
  country: string;
  imageUrl?: string;
  time?: string;
}

export default function RaceCard({
  title,
  circuit,
  date,
  country,
  imageUrl,
  time,
}: RaceCardProps) {
  const countdown = useCountdown(date, time);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.03 }}
      className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg"
    >
      {/* Background Circuit Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={circuit}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
      )}
      <div className="relative p-6 backdrop-blur-sm">
        <h3 className="text-red-500 font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-300">{circuit}</p>
        <p className="text-gray-400 text-sm mt-1">{country}</p>
        <p className="text-gray-500 text-xs mt-2">Race Date: {date}</p>
        <p className="text-sm text-gray-200 font-semibold mt-3">
          🏁 Starts in: {countdown}
        </p>
      </div>
    </motion.div>
  );
}
