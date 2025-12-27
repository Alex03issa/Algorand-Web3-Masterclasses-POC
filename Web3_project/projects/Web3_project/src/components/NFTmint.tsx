import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { sha512_256 } from 'js-sha512'
import { useWallet } from '@txnlab/use-wallet-react'
import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTmintProps) => {
  const [metadataUrl, setMetadataUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const handleMint = async () => {
    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      return
    }

    if (!metadataUrl) {
      enqueueSnackbar('Please paste your metadata URL.', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Minting your MasterPass NFT...', { variant: 'info' })

      const metadataHashBytes = new Uint8Array(
        Buffer.from(sha512_256.digest(metadataUrl))
      )

      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'MasterPass Ticket',
        unitName: 'MTK',
        url: metadataUrl,
        metadataHash: metadataHashBytes,
        defaultFrozen: false,
      })

      enqueueSnackbar(
        `NFT Minted! ASA ID: ${createNFTResult.confirmation.assetIndex}`,
        { variant: 'success' }
      )

      setMetadataUrl('')
      setModalState(false)
    } catch (error) {
      enqueueSnackbar('Failed to mint NFT.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog
      id="mint_nft_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint Your MasterPass NFT 🎟️</h3>
        <p className="text-sm mt-1 mb-4 text-gray-600">
          Paste your IPFS metadata URL from Pinata to mint your ticket.
        </p>

        <input
          type="text"
          placeholder="https://ipfs.io/ipfs/..."
          className="input input-bordered w-full"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>

          <button
            className={`btn btn-primary ${
              metadataUrl.length > 0 ? '' : 'btn-disabled'
            }`}
            onClick={handleMint}
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              'Mint NFT'
            )}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
