import { useContract, useContractRead, Web3Button } from "@thirdweb-dev/react"
import { formatEther } from "ethers/lib/utils"
import millify from "millify"

interface DataCardProps {
  address: string
  stakeAddress: string
}

interface StakeRowProps {
  address: string
  stakeAddress: string
  index: number
}

export default function StakesCard({ address, stakeAddress }: DataCardProps) {
  const { data: stakeContract } = useContract(stakeAddress)
  const { data: stakesLength } = useContractRead(
    stakeContract,
    "stakesLength",
    [address]
  )
  const stakesList = Array.from({ length: stakesLength }, (_, index) => index)
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Staking Options</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Stake Tier</th>
                <th>Status</th>
                <th>Amount Staked</th>
                <th>Stake Reward</th>
                <th>Staked On</th>
                <th>Maturity</th>
              </tr>
            </thead>
            <tbody>
              {stakesList.map((stake) => (
                <StakeRow
                  key={stake}
                  address={address}
                  stakeAddress={stakeAddress}
                  index={stake}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const StakeRow = ({ address, stakeAddress, index }: StakeRowProps) => {
  const { data: stakeContract } = useContract(stakeAddress)
  const { data: stakes } = useContractRead(stakeContract, "stakes", [
    address,
    index,
  ])
  const since = new Date(parseInt(stakes?.since ?? 0) * 1000)
  const till = new Date(parseInt(stakes?.till ?? 0) * 1000)
  const now = new Date()
  const stakesName = () => {
    switch (stakes?.stake?.toString()) {
      case "0":
        return "PWX Silver"
      case "1":
        return "USDT Silver"
      case "2":
        return "PWX Gold"
      case "3":
        return "USDT Gold"
      case "4":
        return "PWX Diamond"
      case "5":
        return "USDT Diamond"
    }
  }
  return (
    <tr>
      <th>{index + 1}</th>
      <td>{stakesName()}</td>
      <td>
        {now > till && stakes?.active ? (
          <Web3Button
            contractAddress={stakeAddress}
            action={async (contract) => {
              await contract.call("Unstake", [index])
            }}
          >
            Claim
          </Web3Button>
        ) : stakes?.active ? (
          "Active"
        ) : (
          "Claimed"
        )}
      </td>
      <td>{`${formatEther(stakes?.amount ?? 0)} ${
        parseInt(stakes?.stake) % 2 == 0 ? "PWX" : "USDT"
      }`}</td>
      <td>{`${formatEther(stakes?.reward ?? 0)} ${
        parseInt(stakes?.stake) % 2 == 0 ? "PWX" : "USDT"
      }`}</td>
      <td>{since.toLocaleString()}</td>
      <td>{till.toLocaleString()}</td>
    </tr>
  )
}
