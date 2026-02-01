"use client";

import { useState, useMemo } from "react";

interface RarityTier {
  id: string;
  name: string;
  count: number;
  allocationPercent: number;
}

export default function Calculator() {
  // 基本入力
  const [totalPoints, setTotalPoints] = useState<string>("");
  const [fdv, setFdv] = useState<string>("");
  const [totalTokens, setTotalTokens] = useState<string>("");
  const [airdropPercent, setAirdropPercent] = useState<string>("");

  // NFT入力
  const [enableNft, setEnableNft] = useState(false);
  const [nftAirdropPercent, setNftAirdropPercent] = useState<string>("");
  const [totalNftCount, setTotalNftCount] = useState<string>("");

  // レアリティ設定
  const [enableRarity, setEnableRarity] = useState(false);
  const [rarityTiers, setRarityTiers] = useState<RarityTier[]>([
    { id: "1", name: "Common", count: 0, allocationPercent: 50 },
    { id: "2", name: "Rare", count: 0, allocationPercent: 30 },
    { id: "3", name: "Epic", count: 0, allocationPercent: 20 },
  ]);

  // 計算結果
  const results = useMemo(() => {
    const points = parseFloat(totalPoints) || 0;
    const fdvValue = parseFloat(fdv) || 0;
    const tokens = parseFloat(totalTokens) || 0;
    const airdropPct = parseFloat(airdropPercent) || 0;
    const nftPct = parseFloat(nftAirdropPercent) || 0;
    const nftCount = parseFloat(totalNftCount) || 0;

    // トークン価格
    const tokenPrice = tokens > 0 ? fdvValue / tokens : 0;

    // エアドロップに使用されるトークン数
    const airdropTokens = tokens * (airdropPct / 100);

    // エアドロップの総価値
    const totalAirdropValue = airdropTokens * tokenPrice;

    // ポイント向けエアドロップ価値（NFT分を除く）
    const nftAllocationPercent = enableNft ? nftPct : 0;
    const pointAllocationPercent = 100 - nftAllocationPercent;
    const pointAirdropValue = totalAirdropValue * (pointAllocationPercent / 100);

    // 1ポイントあたりの価値
    const valuePerPoint = points > 0 ? pointAirdropValue / points : 0;

    // NFT向けエアドロップ価値
    const nftAirdropValue = totalAirdropValue * (nftAllocationPercent / 100);

    // NFT1枚あたりの価値（レアリティなしの場合）
    const valuePerNft = nftCount > 0 ? nftAirdropValue / nftCount : 0;

    // レアリティごとの計算
    const rarityResults = rarityTiers.map((tier) => {
      const tierAllocation = nftAirdropValue * (tier.allocationPercent / 100);
      const valuePerTierNft = tier.count > 0 ? tierAllocation / tier.count : 0;
      return {
        ...tier,
        totalValue: tierAllocation,
        valuePerNft: valuePerTierNft,
      };
    });

    return {
      tokenPrice,
      totalAirdropValue,
      pointAirdropValue,
      valuePerPoint,
      nftAirdropValue,
      valuePerNft,
      rarityResults,
    };
  }, [
    totalPoints,
    fdv,
    totalTokens,
    airdropPercent,
    nftAirdropPercent,
    totalNftCount,
    enableNft,
    rarityTiers,
  ]);

  const addRarityTier = () => {
    const newId = Date.now().toString();
    setRarityTiers([
      ...rarityTiers,
      { id: newId, name: "", count: 0, allocationPercent: 0 },
    ]);
  };

  const removeRarityTier = (id: string) => {
    setRarityTiers(rarityTiers.filter((tier) => tier.id !== id));
  };

  const updateRarityTier = (
    id: string,
    field: keyof RarityTier,
    value: string | number
  ) => {
    setRarityTiers(
      rarityTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const formatNumber = (num: number) => {
    if (num === 0) return "-";
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(4)}`;
  };

  const totalRarityPercent = rarityTiers.reduce(
    (sum, tier) => sum + tier.allocationPercent,
    0
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          PerpDex Airdrop Calculator
        </h1>
        <p className="text-gray-400 text-sm">
          ポイントとNFTのエアドロップ価値を計算
        </p>
      </div>

      {/* 基本入力 */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-3">基本設定</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              総ポイント
            </label>
            <input
              type="number"
              value={totalPoints}
              onChange={(e) => setTotalPoints(e.target.value)}
              placeholder="1000000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              想定FDV ($)
            </label>
            <input
              type="number"
              value={fdv}
              onChange={(e) => setFdv(e.target.value)}
              placeholder="100000000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              総トークン数
            </label>
            <input
              type="number"
              value={totalTokens}
              onChange={(e) => setTotalTokens(e.target.value)}
              placeholder="1000000000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              エアドロップ割合 (%)
            </label>
            <input
              type="number"
              value={airdropPercent}
              onChange={(e) => setAirdropPercent(e.target.value)}
              placeholder="10"
              min="0"
              max="100"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* NFT設定 */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">NFT設定</h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableNft}
              onChange={(e) => setEnableNft(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enableNft && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                NFTへの割り当て (%)
              </label>
              <input
                type="number"
                value={nftAirdropPercent}
                onChange={(e) => setNftAirdropPercent(e.target.value)}
                placeholder="20"
                min="0"
                max="100"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                総NFT枚数
              </label>
              <input
                type="number"
                value={totalNftCount}
                onChange={(e) => setTotalNftCount(e.target.value)}
                placeholder="10000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* レアリティ設定 */}
      {enableNft && (
        <div className="bg-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">レアリティ設定</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableRarity}
                onChange={(e) => setEnableRarity(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enableRarity && (
            <div className="space-y-3">
              {rarityTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex items-center gap-2 bg-gray-700 rounded-lg p-3"
                >
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) =>
                      updateRarityTier(tier.id, "name", e.target.value)
                    }
                    placeholder="レアリティ名"
                    className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={tier.count || ""}
                    onChange={(e) =>
                      updateRarityTier(
                        tier.id,
                        "count",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="枚数"
                    className="w-24 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={tier.allocationPercent || ""}
                      onChange={(e) =>
                        updateRarityTier(
                          tier.id,
                          "allocationPercent",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="%"
                      min="0"
                      max="100"
                      className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                  {rarityTiers.length > 1 && (
                    <button
                      onClick={() => removeRarityTier(tier.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between">
                <button
                  onClick={addRarityTier}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  レアリティを追加
                </button>
                <span
                  className={`text-sm ${
                    totalRarityPercent === 100
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  合計: {totalRarityPercent}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 計算結果 */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-3">計算結果</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">トークン価格</p>
            <p className="text-xl font-bold text-white">
              {formatNumber(results.tokenPrice)}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">エアドロップ総価値</p>
            <p className="text-xl font-bold text-white">
              {formatNumber(results.totalAirdropValue)}
            </p>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">1ポイントあたりの価値</p>
          <p className="text-2xl font-bold text-green-400">
            {formatNumber(results.valuePerPoint)}
          </p>
        </div>

        {enableNft && (
          <>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">
                NFT1枚あたりの平均価値
              </p>
              <p className="text-2xl font-bold text-yellow-400">
                {formatNumber(results.valuePerNft)}
              </p>
            </div>

            {enableRarity && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">レアリティ別価値</p>
                {results.rarityResults.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex justify-between items-center bg-black/20 rounded-lg px-4 py-2"
                  >
                    <span className="text-white">{tier.name || "未設定"}</span>
                    <span className="text-purple-400 font-semibold">
                      {formatNumber(tier.valuePerNft)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-center text-gray-500 text-xs">
        * この計算は想定値であり、実際のエアドロップ価値を保証するものではありません
      </p>
    </div>
  );
}
