import { Web3Button } from "@thirdweb-dev/react"
import millify from "millify"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useState } from "react"

interface CalculatorCardProps {
  address: string
  stakeAddress: string
}

export default function CalculatorCard({
  address,
  stakeAddress,
}: CalculatorCardProps) {
  const [formState, setFormState] = useState({
    amount: "0",
    tier: "0",
  })
  const [reward, setReward] = useState("0")

  return (
    <div className="card bg-base-100 shadow-xl gap-4">
      <div className="card-body">
        <h2 className="card-title">Staking Calculator</h2>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Select your staking tier</span>
        </label>
        <select
          className="select select-bordered"
          name="usdtTier"
          value={formState.tier}
          onChange={(e) =>
            setFormState({ amount: formState.amount, tier: e.target.value })
          }
        >
          <option value={1}>USDT Silver</option>
          <option value={3}>USDT Gold</option>
          <option value={5}>USDT Diamond</option>
          <option value={0}>PWX Silver</option>
          <option value={2}>PWX Gold</option>
          <option value={4}>PWX Diamond</option>
        </select>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">USDT Amount</span>
        </label>
        <input
          type="text"
          placeholder="USDT Amount"
          className="input input-bordered w-full max-w-xs"
          name="usdtAmount"
          value={formState.amount}
          onChange={(e) =>
            setFormState({ amount: e.target.value, tier: formState.tier })
          }
        />
      </div>
      <Web3Button
        contractAddress={stakeAddress}
        action={async (contract) => {
          const reward = await contract.call("calculateReward", [
            parseEther(formState.amount),
            parseInt(formState.tier),
          ])
          setReward(formatEther(reward))
        }}
      >
        Calculate Reward
      </Web3Button>
      <div className="stat">
        <div className="stat-title">Total Reward</div>
        <div className="stat-value">
          {`${millify(parseFloat(reward) ?? 0, {
            precision: 2,
          })} ${parseInt(formState.tier) % 2 == 0 ? "PWX" : "USDT"}`}
        </div>
      </div>
    </div>
  )
}
