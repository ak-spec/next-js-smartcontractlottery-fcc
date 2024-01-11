import { useMoralis } from "react-moralis";
import { useEffect } from "react";


const ManualNavbar = () => {
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if(!account){
                window.localStorage.removeItem("connected");
                deactivateWeb3()
            }
        })
    }, [])

    useEffect(() => {
        if(typeof window !== undefined){
            if(window.localStorage.getItem("connected")){
                enableWeb3();
            }  
        }           
    }, [isWeb3Enabled])

    return (
        <>
            <h1>Hello</h1>
            {
            account ?  <p>You are connected to: {account}</p> : 
             <button onClick={() =>{ 
                enableWeb3();
                if(typeof window !== undefined){
                    window.localStorage.setItem("connected", "injected");
                }
            }} disabled={isWeb3EnableLoading}>Connect Wallet</button>
             }
            
        </>
    )
}

export default ManualNavbar;