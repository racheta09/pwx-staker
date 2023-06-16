"use client"
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react"
import StakeCard from "@/components/stakeCard"
import DataCard from "@/components/dataCard"
import StakesCard from "@/components/stakesCard"
import CalculatorCard from "@/components/calculatorCard"
import AdminCard from "@/components/adminCard"

export default function Home() {
  const address = useAddress()
  const stakeAddress = "0x0653e9BD8DBD8b33FA0a46430370524f617092ba"
  const pwxAddress = "0xea9579a69EbD08217926B364E8c8de513FDf8E23"
  const usdtAddress = "0x7c19bC82119F535Ee18b759aAE81d4b5D95E4d3d"

  const { data: stakeContract } = useContract(stakeAddress)
  const { data: stakesLength } = useContractRead(
    stakeContract,
    "stakesLength",
    [address]
  )
  const { data: owner } = useContractRead(stakeContract, "owner")

  return (
    <div className="w-full">
      <nav className="navbar bg-primary text-primary-content">
        <a className="btn btn-ghost normal-case text-xl">PWX Stake</a>
      </nav>

      {address ? (
        <div className="w-full min-h-screen bg-base-200">
          <h1 className="mb-4 pt-4 text-3xl font-bold text-center">
            Welcome to Pocket Wallet Staking Dapp
          </h1>
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <DataCard
              address={address}
              stakeAddress={stakeAddress}
              pwxAddress={pwxAddress}
              usdtAddress={usdtAddress}
            />
            <StakeCard
              address={address}
              stakeAddress={stakeAddress}
              pwxAddress={pwxAddress}
              usdtAddress={usdtAddress}
            />
            <CalculatorCard address={address} stakeAddress={stakeAddress} />
            {stakesLength != 0 && (
              <StakesCard address={address} stakeAddress={stakeAddress} />
            )}
            {owner == address && (
              <AdminCard address={address} stakeAddress={stakeAddress} />
            )}
          </div>
        </div>
      ) : (
        <div className="hero min-h-screen bg-[url(/bg3.jpg)] bg-cover">
          <div className="max-w-md flex flex-col items-center">
            <h1 className="mb-5 text-4xl font-bold text-center">
              Welcome to Pocket Wallet Staking Dapp
            </h1>
            <ConnectWallet />
          </div>
        </div>
      )}
    </div>
  )
}
