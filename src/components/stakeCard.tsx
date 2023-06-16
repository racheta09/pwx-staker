import { useState, useRef } from "react"
import { parseEther, formatEther } from "ethers/lib/utils"
import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react"

interface StakeCardProps {
  address: string
  stakeAddress: string
  pwxAddress: string
  usdtAddress: string
}

export default function StakeCard({
  address,
  stakeAddress,
  pwxAddress,
  usdtAddress,
}: StakeCardProps) {
  const { data: pwxContract } = useContract(pwxAddress)
  const { data: usdtContract } = useContract(usdtAddress)
  const { data: pwxAllowance } = useContractRead(pwxContract, "allowance", [
    address,
    stakeAddress,
  ])
  const { data: usdtAllowance } = useContractRead(usdtContract, "allowance", [
    address,
    stakeAddress,
  ])
  const [formState, setFormState] = useState({
    usdtAmount: "0",
    pwxAmount: "0",
    usdtTier: "5",
    pwxTier: "4",
  })
  const handleChange = (event: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }
  const usdtRef = useRef<HTMLDialogElement>(null)
  const pwxRef = useRef<HTMLDialogElement>(null)
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Staking Options</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Duration</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>USDT Silver</td>
                <td>11 Days</td>
                <td>0.25%/day</td>
              </tr>
              <tr>
                <td>USDT Gold</td>
                <td>22 Days</td>
                <td>0.50%/day</td>
              </tr>
              <tr>
                <td>USDT Diamond</td>
                <td>44 Days</td>
                <td>0.75%/day</td>
              </tr>
              <tr>
                <td>PWX Silver</td>
                <td>11 Days</td>
                <td>0.15%/day</td>
              </tr>
              <tr>
                <td>PWX Gold</td>
                <td>22 Days</td>
                <td>0.30%/day</td>
              </tr>
              <tr>
                <td>PWX Diamond</td>
                <td>44 Days</td>
                <td>0.45%/day</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-actions justify-around">
          <button
            className="btn btn-primary"
            onClick={() => (usdtRef.current ? usdtRef.current.showModal() : "")}
          >
            Stake USDT
          </button>
          <button
            className="btn btn-primary"
            onClick={() => (pwxRef.current ? pwxRef.current.showModal() : "")}
          >
            Stake PWX
          </button>
        </div>
        <dialog ref={usdtRef} className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Stake USDT and Earn Rewards</h3>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Select your staking tier</span>
              </label>
              <select
                className="select select-bordered"
                name="usdtTier"
                value={formState.usdtTier}
                onChange={handleChange}
              >
                <option value={1}>USDT Silver</option>
                <option value={3}>USDT Gold</option>
                <option value={5}>USDT Diamond</option>
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
                value={formState.usdtAmount}
                onChange={handleChange}
              />
            </div>
            <div className="modal-action">
              {parseFloat(formatEther(usdtAllowance ?? 0)) >=
              parseFloat(formState.usdtAmount) ? (
                <Web3Button
                  contractAddress={stakeAddress}
                  action={async (contract) => {
                    await contract.call("Stake", [
                      parseEther(formState.usdtAmount),
                      parseInt(formState.usdtTier),
                    ])
                  }}
                >
                  Stake USDT
                </Web3Button>
              ) : (
                <Web3Button
                  contractAddress={usdtAddress}
                  action={async (contract) => {
                    await contract.call("approve", [
                      stakeAddress,
                      parseEther(formState.usdtAmount),
                    ])
                  }}
                >
                  Approve USDT
                </Web3Button>
              )}
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog ref={pwxRef} className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Stake PWX and Earn Rewards</h3>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Select your staking tier</span>
              </label>
              <select
                className="select select-bordered"
                name="pwxTier"
                value={formState.pwxTier}
                onChange={handleChange}
              >
                <option value={0}>PWX Silver</option>
                <option value={2}>PWX Gold</option>
                <option value={4}>PWX Diamond</option>
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">PWX Amount</span>
              </label>
              <input
                type="text"
                placeholder="PWX Amount"
                className="input input-bordered w-full max-w-xs"
                name="pwxAmount"
                value={formState.pwxAmount}
                onChange={handleChange}
              />
            </div>
            <div className="modal-action">
              {parseFloat(formatEther(pwxAllowance ?? 0)) >=
              parseFloat(formState.pwxAmount) ? (
                <Web3Button
                  contractAddress={stakeAddress}
                  action={async (contract) => {
                    await contract.call("Stake", [
                      parseEther(formState.pwxAmount),
                      parseInt(formState.pwxTier),
                    ])
                  }}
                >
                  Stake PWX
                </Web3Button>
              ) : (
                <Web3Button
                  contractAddress={pwxAddress}
                  action={async (contract) => {
                    await contract.call("approve", [
                      stakeAddress,
                      parseEther(formState.pwxAmount),
                    ])
                  }}
                >
                  Approve PWX
                </Web3Button>
              )}
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  )
}
