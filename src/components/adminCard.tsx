import { useContract, useContractRead, Web3Button } from "@thirdweb-dev/react"
import millify from "millify"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useState } from "react"

interface AdminCardProps {
  address: string
  stakeAddress: string
}

interface FormatStatsProps {
  stats: any
  title: string
  symbol: string
}

export default function AdminCard({ address, stakeAddress }: AdminCardProps) {
  const { data: stakeContract } = useContract(stakeAddress)
  const { data: pwx11Stats } = useContractRead(stakeContract, "stakeStats", [0])
  const { data: pwx22Stats } = useContractRead(stakeContract, "stakeStats", [2])
  const { data: pwx44Stats } = useContractRead(stakeContract, "stakeStats", [4])
  const { data: usdt11Stats } = useContractRead(stakeContract, "stakeStats", [
    1,
  ])
  const { data: usdt22Stats } = useContractRead(stakeContract, "stakeStats", [
    3,
  ])
  const { data: usdt44Stats } = useContractRead(stakeContract, "stakeStats", [
    5,
  ])

  const [formState, setFormState] = useState({
    pwxAmount: "0",
    usdtAmount: "0",
  })

  return (
    <>
      <div className="card bg-base-100 shadow-xl gap-4">
        <div className="card-body">
          <h2 className="card-title">Admin Stake Stats</h2>
          <div className="stats stats-vertical">
            <FormatStats
              stats={usdt11Stats}
              title="USDT Silver"
              symbol="USDT"
            />
            <FormatStats stats={usdt22Stats} title="USDT Gold" symbol="USDT" />
            <FormatStats
              stats={usdt44Stats}
              title="USDT Diamond"
              symbol="USDT"
            />
            <FormatStats stats={pwx11Stats} title="PWX Silver" symbol="PWX" />
            <FormatStats stats={pwx22Stats} title="PWX Gold" symbol="PWX" />
            <FormatStats stats={pwx44Stats} title="PWX Diamond" symbol="PWX" />
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl gap-4">
        <div className="card-body">
          <h2 className="card-title">Admin Withdraw Functions</h2>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">USDT Amount</span>
            </label>
            <input
              type="text"
              placeholder="USDT Amount"
              className="input input-bordered w-full max-w-xs"
              name="usdtAmount"
              value={formState.usdtAmount}
              onChange={(e) =>
                setFormState({
                  pwxAmount: formState.pwxAmount,
                  usdtAmount: e.target.value,
                })
              }
            />
          </div>
          <Web3Button
            contractAddress={stakeAddress}
            action={async (contract) => {
              await contract.call("withdrawUSDT", [
                parseEther(formState.usdtAmount),
              ])
            }}
          >
            Withdraw USDT
          </Web3Button>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">PWX Amount</span>
            </label>
            <input
              type="text"
              placeholder="USDT Amount"
              className="input input-bordered w-full max-w-xs"
              name="usdtAmount"
              value={formState.pwxAmount}
              onChange={(e) =>
                setFormState({
                  pwxAmount: e.target.value,
                  usdtAmount: formState.usdtAmount,
                })
              }
            />
          </div>
          <Web3Button
            contractAddress={stakeAddress}
            action={async (contract) => {
              await contract.call("withdrawPWX", [
                parseEther(formState.pwxAmount),
              ])
            }}
          >
            Withdraw PWX
          </Web3Button>
        </div>
      </div>
    </>
  )
}

const FormatStats = ({ stats, title, symbol }: FormatStatsProps) => {
  return (
    <>
      <div className="stat">
        <div className="stat-title">{`${title} Quantity`}</div>
        <div className="stat-value">
          {millify(stats?.totalSold ?? 0, {
            precision: 2,
          })}
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">{`${title} Amount`}</div>
        <div className="stat-value">
          {stats &&
            `${millify(parseFloat(formatEther(stats.totalAmount)), {
              precision: 2,
            })} ${symbol}`}
        </div>
      </div>
    </>
  )
}
