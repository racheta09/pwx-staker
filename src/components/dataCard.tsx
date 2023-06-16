import { useContract, useContractRead } from "@thirdweb-dev/react"
import millify from "millify"
import { formatEther } from "ethers/lib/utils"

interface DataCardProps {
  address: string
  stakeAddress: string
  pwxAddress: string
  usdtAddress: string
}

export default function DataCard({
  address,
  stakeAddress,
  pwxAddress,
  usdtAddress,
}: DataCardProps) {
  const { data: stakeContract } = useContract(stakeAddress)
  const { data: pwxContract } = useContract(pwxAddress)
  const { data: usdtContract } = useContract(usdtAddress)
  const { data: pwxBalance } = useContractRead(pwxContract, "balanceOf", [
    address,
  ])
  const { data: usdtBalance } = useContractRead(usdtContract, "balanceOf", [
    address,
  ])
  const { data: totalStakers } = useContractRead(stakeContract, "totalStakers")
  const { data: stakedPWX } = useContractRead(stakeContract, "stakedPWX")
  const { data: stakedUSDT } = useContractRead(stakeContract, "stakedUSDT")

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Staking Stats</h2>
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">Total Stakers</div>
            <div className="stat-value">
              {millify(totalStakers ?? 0, {
                precision: 2,
              })}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">USDT Staked</div>
            <div className="stat-value">
              {millify(parseFloat(formatEther(stakedUSDT ?? 0)), {
                precision: 2,
              })}{" "}
              USDT
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Staked PWX</div>
            <div className="stat-value">
              {millify(parseFloat(formatEther(stakedPWX ?? 0)), {
                precision: 2,
              })}{" "}
              PWX
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">USDT Balance</div>
            <div className="stat-value">
              {millify(parseFloat(formatEther(usdtBalance ?? 0)), {
                precision: 2,
              })}{" "}
              USDT
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">PWX Balance</div>
            <div className="stat-value">
              {millify(parseFloat(formatEther(pwxBalance ?? 0)), {
                precision: 2,
              })}{" "}
              PWX
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
