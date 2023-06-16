import { useContract, useContractRead, Web3Button } from "@thirdweb-dev/react"
import millify from "millify"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useState } from "react"

interface AdminCardProps {
  address: string
  stakeAddress: string
}

export default function AdminCard({ address, stakeAddress }: AdminCardProps) {
  const { data: stakeContract } = useContract(stakeAddress)

  const [formState, setFormState] = useState({
    pwxAmount: "0",
    usdtAmount: "0",
  })

  return (
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
  )
}
