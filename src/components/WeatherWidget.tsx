"use client"

import type React from "react"
import { useState, type SVGProps } from "react"

export const WeatherWidget: React.FC = () => {
  const [location, setLocation] = useState("New York")
  const [temperature] = useState("16.28")
  const [condition] = useState("Clouds")
  const [lastUpdated] = useState("12:23 AM")

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden shadow-lg">
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </h2>
          <CloudIcon className="text-white w-10 h-10" />
        </div>

        <div className="text-7xl font-bold text-white text-center my-4">
          <span>{temperature}°C</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-sm text-white/90">{condition}</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {[
            { time: "Now", temp: temperature },
            { time: "+1h", temp: "15" },
            { time: "+2h", temp: "14" },
            { time: "+3h", temp: "13" },
            { time: "+4h", temp: "12" },
          ].map((slot, i) => (
            <div
              key={slot.time}
              className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
            >
              <p className="text-sm font-medium text-white mb-2">{slot.time}</p>
              {i === 3 ? (
                <SunsetIcon className="text-yellow-300 w-7 h-7 mx-auto mb-2" />
              ) : (
                <CloudIcon className="text-white w-7 h-7 mx-auto mb-2" />
              )}
              <p className="text-base font-bold text-white">{slot.temp}°</p>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/70">Last updated: {lastUpdated}</div>

        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search location..."
            className="w-full rounded-lg bg-white/15 backdrop-blur-sm py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-colors"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CloudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

function SunsetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10V2" />
      <path d="m4.93 10.93 1.41 1.41" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="m19.07 10.93-1.41 1.41" />
      <path d="M22 22H2" />
      <path d="m16 6-4 4-4-4" />
      <path d="M16 18a4 4 0 0 0-8 0" />
    </svg>
  )
}
