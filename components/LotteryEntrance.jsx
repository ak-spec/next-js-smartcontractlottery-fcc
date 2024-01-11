import { useWeb3Contract, useMoralis } from "react-moralis";
import {abi, contractAddresses} from "../constants"
import { useEffect} from "react";
import {ethers} from "ethers";
import { useNotification } from "@web3uikit/core";

const LotteryEntrance = () => {
    const {chainId, isWeb3Enabled} = useMoralis();
    const raffleAddress = parseInt(chainId) in contractAddresses ? contractAddresses[parseInt(chainId)] : null;
    const dispatch = useNotification();
    
    
    const {data: entranceFee, runContractFunction: getEntranceFee} =
    useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const {runContractFunction: enterRaffle} =
    useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: "enterRaffle",
      params: {},
      msgValue: entranceFee !== null ? entranceFee : 0
    });

    const {data: numPlayers, runContractFunction: getNumberOfPlayers} =
    useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: "getNumberOfPlayers",
      params: {},
    });

    const {data: recentWinner, runContractFunction: getRecentWinner} =
    useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: "getRecentWinner",
      params: {},
    });

    async function updateUI() {
        await getEntranceFee();
        await getNumberOfPlayers();
        await getRecentWinner();
    }

    useEffect(() => {
        if(isWeb3Enabled){
            updateUI();
        }



    }, [isWeb3Enabled])
    
   

    async function handleEnterRaffleSuccess(tx) {
        await tx.wait(1);
        handleNewNotification(tx);
    }

    function handleNewNotification(tx){
        dispatch({
            type: "info",
            message: "Transaction was successful!",
            title: "New Notification",
            icon: "",
            position: "topR"
        });
        updateUI();
    }
    
    
    return (
        <>
            {
                raffleAddress ? 
                <div>
                    <button onClick={async () => { 
                        await enterRaffle({
                            onSuccess: handleEnterRaffleSuccess,
                            onError: (err) => console.log(err)
                        });
                    }}>
                        Enter Raffle
                    </button>
                    <div>Entrance Fee: {entranceFee && <span>{ethers.formatEther(entranceFee.toString())}</span>} ETH</div>
                    <div>Number of players: {numPlayers && <span>{numPlayers.toString()}</span>}</div>
                    <div>Recent Winner: {recentWinner && <span>{recentWinner.toString()}</span>}</div>

                </div> 
                :
                <div>{ isWeb3Enabled ? "Pls connect to the right chain." : "Pls connect to wallet."}</div>
             }
            
        </>
    )
}

export default LotteryEntrance;