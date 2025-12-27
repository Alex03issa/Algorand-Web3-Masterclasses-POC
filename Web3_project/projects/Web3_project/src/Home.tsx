// src/components/Home.tsx
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'

const Home: React.FC = () => {
  const { activeAddress } = useWallet()

  // Modal states
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openTransactModal, setOpenTransactModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-purple-400 to-pink-300 p-6">
      
      {/* Main Card */}
      <div className="text-center bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        
        {/* Main Title */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-3">
          Welcome to MasterPass 🎟️
        </h1>

        {/* Subheading */}
        <p className="text-gray-700 mb-10">
          Your ticket to join the next-gen Web3 event.<br />
          Connect, explore, and get inspired!
        </p>

        {/* Buttons Block */}
        <div className="flex flex-col gap-4">

          {/* Connect Wallet */}
          <button
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setOpenWalletModal(true)}
          >
            Connect Wallet
          </button>

          {/* Show only if a wallet is connected */}
          {activeAddress && (
            <>
              {/* Send Payment */}
              <button
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => setOpenTransactModal(true)}
              >
                Send Payment
              </button>

              {/* Mint NFT */}
              <button
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => setOpenMintModal(true)}
              >
                Mint MasterPass NFT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Wallet Modal */}
      <ConnectWallet
        openModal={openWalletModal}
        closeModal={() => setOpenWalletModal(false)}
      />

      {/* Payment Modal */}
      <Transact
        openModal={openTransactModal}
        setModalState={setOpenTransactModal}
      />

      {/* NFT Mint Modal */}
      <NFTmint
        openModal={openMintModal}
        setModalState={setOpenMintModal}
      />
    </div>
  )
}

export default Home
