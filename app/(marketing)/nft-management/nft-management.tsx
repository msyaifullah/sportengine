"use client"

import { useEffect, useState } from "react"
import { defineChain, estimateGas, getContract, NFT, ThirdwebClient } from "thirdweb"
import { burn, mintTo } from "thirdweb/extensions/erc721"
import { ConnectButton, ThirdwebProvider, useActiveAccount, useActiveWallet, useDisconnect, useSendTransaction, useWalletBalance } from "thirdweb/react"
// Upload files to IPFS
import { upload } from "thirdweb/storage"
import { createWallet, inAppWallet } from "thirdweb/wallets"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const NFT_CONTRACT_ADDRESS = "0xD1B5fEf12858D883628eBC7f88cB01da7063e766"

const wallets = [inAppWallet(), createWallet("io.metamask"), createWallet("com.coinbase.wallet"), createWallet("me.rainbow")]

interface NFTManagementProps {
  client: ThirdwebClient
}

function NFTManagement({ client }: NFTManagementProps) {
  const { disconnect } = useDisconnect()
  const wallet = useActiveWallet()

  const chain = defineChain(
    // {
    // chainId: 1, // Replace with your actual chainId
    // rpcUrl: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your actual RPC URL
    // nativeCurrency: {
    //     decimals: 18,
    //     name: "Sepolia ETH",
    //     symbol: "SepoliaETH",
    // },
    // slug: "Sepolia",
    // }
    11155111 //sepolia
  )
  const account = useActiveAccount()
  const address = account?.address
  const { data: balance, isLoading } = useWalletBalance({
    client,
    chain,
    address: address,
  })

  const contract = getContract({
    address: NFT_CONTRACT_ADDRESS,
    chain: chain,
    client,
  })

  useEffect(() => {
    const getNFT = async () => {
      //   setIsLoadingNFTs(true)
      //   const data: NFT[] = await getOwnedNFTs({ contract, owner: address! })
      //   setOwnedNFTs(data)
      //   setIsLoadingNFTs(false)
    }
    getNFT()
  }, [])

  const { mutate: sendTx, data: transactionResult } = useSendTransaction()

  const [tokenAddressToMint, setTokenAddressToMint] = useState<string>("")
  const [tokenIdToBurn, setTokenIdToBurn] = useState<string>("")
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])
  const [isLoadingNFTs, setIsLoadingNFTs] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [isBurning, setIsBurning] = useState<boolean>(false)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(null)

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicture(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handlePictureUpload = async () => {
    if (!address || !profilePicture) return
    const uri = await upload({
      client,
      files: [profilePicture],
    })
    console.log(uri)
    setProfilePictureURL(uri)
  }

  const handleEstimationGas = async () => {
    if (!address || !profilePictureURL) return
    const transaction = await mintTo({
      contract,
      to: tokenAddressToMint,
      nft: {
        name: "NFT Name",
        description: "NFT Description",
        image: profilePictureURL,
        properties: {
          rarity: "Common",
        },
      },
    })
    const gasEstimate = await estimateGas({ transaction })
    console.log("estmated gas used", gasEstimate)
  }

  const handleMint = async () => {
    if (!address || !profilePictureURL) return
    try {
      setIsMinting(true)
      const transaction = await mintTo({
        contract,
        to: tokenAddressToMint,
        nft: {
          name: "NFT Name",
          description: "NFT Description",
          image: profilePictureURL,
          properties: {
            rarity: "Common",
          },
        },
      })
      sendTx(transaction)
      console.log(`Minted NFT with token ID ${tokenAddressToMint}`)
      setTokenAddressToMint("")
      setIsMinting(false)
    } catch (error) {
      console.error("Failed to mint NFT:", error)
    }
  }

  const handleBurn = async () => {
    try {
      setIsBurning(true)
      const transaction = await burn({
        contract,
        tokenId: BigInt(tokenIdToBurn),
      })
      sendTx(transaction)
      console.log(`Burned NFT with token ID ${tokenIdToBurn}`)
      setTokenIdToBurn("")
      setIsBurning(false)
    } catch (error) {
      console.error("Failed to burn NFT:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">NFT Management</h1>
      <div>
        <p>Wallet connetion : </p>
        <p>Wallet address: {account?.address}</p>
        <p>
          Wallet balance: {balance?.displayValue} {balance?.symbol}
        </p>
      </div>

      {!address ? (
        <ConnectButton client={client} wallets={wallets} />
      ) : (
        <>
          <p> Connected as {JSON.stringify(wallet!)}</p>
          <Button onClick={() => disconnect(wallet!)}>disconnect</Button>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Your NFTs</CardTitle>
              <CardDescription>List of your owned NFTs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingNFTs ? (
                <p>Loading your NFTs...</p>
              ) : ownedNFTs && ownedNFTs.length > 0 ? (
                <ul>
                  {ownedNFTs.map((nft) => (
                    <li key={nft.id.toString()}>Token ID: {nft.id.toString()}</li>
                  ))}
                </ul>
              ) : (
                <p>You don&lsquo;t own any NFTs yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Mint NFT</CardTitle>
              <CardDescription>Create a new NFT</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input id="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} />

                {previewUrl && (
                  <>
                    <div className="mt-2">
                      <img src={previewUrl} alt="Profile picture preview" className="size-32 rounded-full object-cover" />
                    </div>
                    <Button onClick={handlePictureUpload}>upload</Button>
                  </>
                )}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="tokenIdToMint">Token ID</Label>
                <Input id="tokenIdToMint" value={tokenAddressToMint} onChange={(e) => setTokenAddressToMint(e.target.value)} placeholder="Enter token address wallet to mint" />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button onClick={handleMint} disabled={isMinting && !profilePictureURL}>
                {isMinting ? "Minting..." : "Mint NFT"}
              </Button>
              <Button onClick={handleEstimationGas}>Estimate gass check on console</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Burn NFT</CardTitle>
              <CardDescription>Destroy an existing NFT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="tokenIdToBurn">Token ID</Label>
                <Input id="tokenIdToBurn" value={tokenIdToBurn} onChange={(e) => setTokenIdToBurn(e.target.value)} placeholder="Enter token ID to burn" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBurn} variant="destructive" disabled={isBurning}>
                {isBurning ? "Burning..." : "Burn NFT"}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

export default function NFTManagementPage({ client }: NFTManagementProps) {
  return (
    <ThirdwebProvider>
      <NFTManagement client={client} />
    </ThirdwebProvider>
  )
}
