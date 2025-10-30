"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d: { price: number[] };
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data.slice(0, 10))) // top 10
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center flex items-center">
        <span className="mr-2">💰</span> Crypto Dashboard
      </h1>

      <div className="overflow-x-auto w-full max-w-6xl shadow-lg rounded-2xl bg-white">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-3 px-4 sm:px-6">Coin</th>
              <th className="py-3 px-4 sm:px-6 text-right">Price (USD)</th>
              <th className="py-3 px-4 sm:px-6 text-right">24h Change</th>
              <th className="py-3 px-4 sm:px-6 text-right">Market Cap</th>
              <th className="py-3 px-4 sm:px-6 text-center hidden sm:table-cell">
                7d Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 sm:px-6 flex items-center space-x-2">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium">{coin.name}</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-right">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`py-3 px-4 sm:px-6 text-right font-medium ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-4 sm:px-6 text-right">
                  ${coin.market_cap.toLocaleString()}
                </td>
                <td className="py-3 px-4 sm:px-6 text-center hidden sm:table-cell">
                  <Sparklines
                    data={coin.sparkline_in_7d.price}
                    width={80}
                    height={30}
                  >
                    <SparklinesLine
                      color={
                        coin.price_change_percentage_24h > 0
                          ? "green"
                          : "red"
                      }
                    />
                  </Sparklines>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
