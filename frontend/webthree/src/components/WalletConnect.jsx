import { useEffect, useState, useCallback, useMemo } from 'react';
import Web3 from 'web3';


const WalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);


  const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access or error connecting');
        alert("There was an error connecting your wallet. Please try again.");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask to use this service");
    }
  };


  const getBalance = useCallback(async () => {
    if (account && web3) {
      setLoading(true);
      try {
        const balance = await web3.eth.getBalance(account);
        const formattedBalance = Web3.utils.fromWei(balance, 'ether');
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
      setLoading(false);
    }
  }, [account, web3]);


  const getNetwork = useCallback(async () => {
    if (web3) {
      try {
        const chainId = await web3.eth.getChainId();
        setNetwork(chainId);
      } catch (error) {
        console.error("Error fetching network:", error);
      }
    }
  }, [web3]);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null); 
          setBalance(null);
        } else {
          setAccount(accounts[0]); 
          getBalance(); 
          getNetwork();
        }
      });

     
      window.ethereum.on('chainChanged', () => {
        window.location.reload(); 
      });
    }

   
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [getBalance, getNetwork]);

  useEffect(() => {
    if (account) {
      getBalance();
      getNetwork();
    }
  }, [account, getBalance, getNetwork]);

  return (
<div className="flex flex-col items-center space-y-4 p-4">
  <button
    className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
    onClick={connectWallet}
  >
    {account ? `Connected: ${account}` : "Connect Wallet"}
  </button>

  {loading ? (
    <p className="text-gray-500">Loading...</p>
  ) : (
    balance && <p className="text-lg font-semibold">Balance: {balance} ETH</p>
  )}

  {network && (
    <p className="text-sm text-gray-600">Network ID: {network}</p>
  )}
</div>

  );
};

export default WalletConnect;



// // // import { useEffect, useState, useCallback, useMemo } from 'react';
// // // import Web3 from 'web3';
// // // import {ethers} from 'ethers';

// // // const WalletConnect = () => {
// // //   const [account, setAccount] = useState(null);
// // //   const [balance, setBalance] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [network, setNetwork] = useState(null);
// // //   const [, setContract] = useState(null);



// // //   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");


// // //   // Initialize Web3 instance
// // //   const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);

// // //   // Load contract ABI and address
// // //   useEffect(() => {
// // //     const loadContract = async () => {
// // //       try {
// // //         const response = await fetch('/Lock.json'); // Fetch Lock.json from public folder
// // //         const contractData = await response.json();
// // //         const contractABI = contractData.abi;
// // //         const contractAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Replace with your deployed contract address

// // //         if (web3) {
// // //           const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
// // //           setContract(contractInstance);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error loading contract:', error);
// // //       }
// // //     };

// // //     loadContract();
// // //   }, [web3]);

// // //   // Connect wallet with MetaMask
// // //   const connectWallet = async () => {
// // //     if (window.ethereum) {
// // //       try {
// // //         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
// // //         setAccount(accounts[0]);
// // //       } catch (error) {
// // //         console.error('User denied account access or error connecting');
// // //         alert("There was an error connecting your wallet. Please try again.");
// // //       }
// // //     } else {
// // //       alert("MetaMask not detected. Please install MetaMask to use this service");
// // //     }
// // //   };

// // //   // Get balance
// // //   const getBalance = useCallback(async () => {
// // //     if (account && web3) {
// // //       setLoading(true);
// // //       try {
// // //         const balance = await web3.eth.getBalance(account);
// // //         const formattedBalance = Web3.utils.fromWei(balance, 'ether');
// // //         setBalance(formattedBalance);
// // //       } catch (error) {
// // //         console.error("Error fetching balance:", error);
// // //       }
// // //       setLoading(false);
// // //     }
// // //   }, [account, web3]);

// // //   // Get network
// // //   const getNetwork = useCallback(async () => {
// // //     if (web3) {
// // //       try {
// // //         const chainId = await web3.eth.getChainId();
// // //         setNetwork(chainId);
// // //       } catch (error) {
// // //         console.error("Error fetching network:", error);
// // //       }
// // //     }
// // //   }, [web3]);

// // //   // Listen for account and network changes
// // //   useEffect(() => {
// // //     if (window.ethereum) {
// // //       window.ethereum.on('accountsChanged', (accounts) => {
// // //         if (accounts.length === 0) {
// // //           setAccount(null);
// // //           setBalance(null);
// // //         } else {
// // //           setAccount(accounts[0]);
// // //           getBalance();
// // //           getNetwork();
// // //         }
// // //       });

// // //       window.ethereum.on('chainChanged', () => {
// // //         window.location.reload();
// // //       });
// // //     }

// // //     return () => {
// // //       if (window.ethereum) {
// // //         window.ethereum.removeListener('accountsChanged', () => {});
// // //         window.ethereum.removeListener('chainChanged', () => {});
// // //       }
// // //     };
// // //   }, [getBalance, getNetwork]);

// // //   // Fetch balance and network info when account changes
// // //   useEffect(() => {
// // //     if (account) {
// // //       getBalance();
// // //       getNetwork();
// // //     }
// // //   }, [account, getBalance, getNetwork]);

// // //   return (
// // //     <div className="flex flex-col items-center space-y-4 p-4">
// // //       <button
// // //         className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
// // //         onClick={connectWallet}
// // //       >
// // //         {account ? `Connected: ${account}` : "Connect Wallet"}
// // //       </button>

// // //       {loading ? (
// // //         <p className="text-gray-500">Loading...</p>
// // //       ) : (
// // //         balance && <p className="text-lg font-semibold">Balance: {balance} ETH</p>
// // //       )}

// // //       {network && (
// // //         <p className="text-sm text-gray-600">Network ID: {network}</p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default WalletConnect;

// // // import { useEffect, useState, useCallback } from 'react';
// // // import { ethers } from 'ethers';

// // // const WalletConnect = () => {
// // //   const [account, setAccount] = useState(null);
// // //   const [balance, setBalance] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [network, setNetwork] = useState(null);
// // //   const [provider, setProvider] = useState(null);

// // //   useEffect(() => {
// // //     const initProvider = async () => {
// // //       const ethProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// // //       setProvider(ethProvider);
// // //     };

// // //     initProvider();
// // //   }, []);


// // //   const connectWallet = async () => {
// // //     try {
// // //       const accounts = await provider.listAccounts();
// // //       if (accounts.length > 0) {
// // //         setAccount(accounts[0]);
// // //       } else {
// // //         console.warn("No accounts found on local provider.");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error connecting to local provider:", error);
// // //     }
// // //   };
  

// // //   const getBalance = useCallback(async () => {
// // //     if (account) {
// // //       setLoading(true);
// // //       try {
// // //         const balance = await provider.getBalance(account);
// // //         const formattedBalance = ethers.utils.formatEther(balance);
// // //         setBalance(formattedBalance);
// // //       } catch (error) {
// // //         console.error("Error fetching balance:", error);
// // //       }
// // //       setLoading(false);
// // //     }
// // //   }, [account, provider]);
  
// // //   // const connectWallet = async () => {
// // //   //   if (window.ethereum) {
// // //   //     try {
// // //   //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
// // //   //       setAccount(accounts[0]);
// // //   //     } catch (error) {
// // //   //       console.error('User denied account access or error connecting:', error);
// // //   //     }
// // //   //   } else {
// // //   //     alert("MetaMask not detected. Please install MetaMask to use this service");
// // //   //   }
// // //   // };

// // //   // const getBalance = useCallback(async () => {
// // //   //   if (account && provider) {
// // //   //     setLoading(true);
// // //   //     try {
// // //   //       const balance = await provider.getBalance(account);
// // //   //       setBalance(ethers.formatEther(balance));
// // //   //     } catch (error) {
// // //   //       console.error("Error fetching balance:", error);
// // //   //     }
// // //   //     setLoading(false);
// // //   //   }
// // //   // }, [account, provider]);

// // //   const getNetwork = useCallback(async () => {
// // //     if (provider) {
// // //       try {
// // //         const network = await provider.getNetwork();
// // //         setNetwork(network.chainId);
// // //       } catch (error) {
// // //         console.error("Error fetching network:", error);
// // //       }
// // //     }
// // //   }, [provider]);

// // //   useEffect(() => {
// // //     if (account) {
// // //       getBalance();
// // //       getNetwork();
// // //     }
// // //   }, [account, getBalance, getNetwork]);

// // //   return (
// // //     <div className="flex flex-col items-center space-y-4 p-4">
// // //       <button
// // //         className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
// // //         onClick={connectWallet}
// // //       >
// // //         {account ? `Connected: ${account}` : "Connect Wallet"}
// // //       </button>

// // //       {loading ? (
// // //         <p className="text-gray-500">Loading...</p>
// // //       ) : (
// // //         balance && <p className="text-lg font-semibold">Balance: {balance} ETH</p>
// // //       )}

// // //       {network && (
// // //         <p className="text-sm text-gray-600">Network ID: {network}</p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default WalletConnect;



// // import { useEffect, useState, useCallback } from 'react';
// // import { ethers } from 'ethers';

// // const WalletConnect = () => {
// //   const [account, setAccount] = useState(null);
// //   const [balance, setBalance] = useState(null);
// //   const [network, setNetwork] = useState(null);

// //   // Set provider to local Hardhat or Ganache network
// //   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// //   // Connect to the first account on the local network
// //   const connectToLocalhost = async () => {
// //     try {
// //       const accounts = await provider.listAccounts();
// //       if (accounts.length > 0) {
// //         setAccount(accounts[0]); // Set the address as a string
// //       } else {
// //         console.warn("No accounts found on the local network.");
// //       }
// //     } catch (error) {
// //       console.error("Failed to connect to local network:", error);
// //     }
// //   };

  

// //   // Fetch balance for the connected account
// //   const getBalance = useCallback(async () => {
// //     if (account) {
// //       try {
// //         const balance = await provider.getBalance(account);
// //         setBalance(ethers.utils.formatEther(balance));
// //       } catch (error) {
// //         console.error("Error fetching balance:", error);
// //       }
// //     }
// //   }, [account, provider]);

// //   // Fetch and display network ID
// //   const getNetwork = useCallback(async () => {
// //     try {
// //       const networkData = await provider.getNetwork();
// //       setNetwork(networkData.chainId);
// //     } catch (error) {
// //       console.error("Error fetching network:", error);
// //     }
// //   }, [provider]);

// //   // Fetch balance and network when the account changes
// //   useEffect(() => {
// //     if (account) {
// //       getBalance();
// //       getNetwork();
// //     }
// //   }, [account, getBalance, getNetwork]);

// //   return (
// //     <div className="flex flex-col items-center space-y-4 p-4">
// //       <button
// //         className="bg-blue-400 text-white px-6 py-3 rounded-lg"
// //         onClick={connectToLocalhost}
// //       >
// //         {/* {account && typeof account === 'string' ? `Connected: ${account}` : "Connect Wallet"} */}

// //         {account ? `Connected: ${account}` : "Connect to Localhost"}
// //       </button>

// //       {balance && <p className="text-lg font-semibold">Balance: {balance} ETH</p>}
// //       {network && <p className="text-sm text-gray-600">Network ID: {network}</p>}
// //     </div>
// //   );
// // };

// // export default WalletConnect;


// // import { useEffect, useState, useCallback, useMemo } from 'react';
// // import { ethers } from 'ethers';

// // const WalletConnect = () => {
// //   const [account, setAccount] = useState(null);
// //   const [balance, setBalance] = useState(null);
// //   const [network, setNetwork] = useState(null);

// //   // Set provider to local Hardhat or Ganache network
// //   const provider = useMemo(() => new ethers.JsonRpcProvider("http://127.0.0.1:8545"), []);

// //   // Connect to the first account on the local network
// //   const connectToLocalhost = async () => {
// //     try {
// //       const accounts = await provider.listAccounts();
// //       if (accounts.length > 0) {
// //         setAccount(accounts[0].address); // Set the address as a string
// //       } else {
// //         console.warn("No accounts found on the local network.");
// //       }
// //     } catch (error) {
// //       console.error("Failed to connect to local network:", error);
// //     }
// //   };

// //   // Fetch balance for the connected account
// //   const getBalance = useCallback(async () => {
// //     if (account) {
// //       try {
// //         const balance = await provider.getBalance(account);
// //         setBalance(ethers.utils.formatEther(balance)); // Format the balance to ETH
// //       } catch (error) {
// //         console.error("Error fetching balance:", error);
// //       }
// //     }
// //   }, [account, provider]);

// //   // Fetch and display network ID
// //   const getNetwork = useCallback(async () => {
// //     try {
// //       const networkData = await provider.getNetwork();
// //       setNetwork(networkData.chainId);
// //     } catch (error) {
// //       console.error("Error fetching network:", error);
// //     }
// //   }, [provider]);

// //   // Fetch balance and network when the account changes
// //   useEffect(() => {
// //     if (account) {
// //       getBalance();
// //       getNetwork();
// //     }
// //   }, [account, getBalance, getNetwork]);

// //   return (
// //     <div className="flex flex-col items-center space-y-4 p-4">
// //       <button
// //         className="bg-blue-400 text-white px-6 py-3 rounded-lg"
// //         onClick={connectToLocalhost}
// //       >
// //         {account ? `Connected: ${account}` : "Connect to Localhost"}
// //       </button>

// //       {balance && <p className="text-lg font-semibold">Balance: {balance} ETH</p>}
// //       {network && <p className="text-sm text-gray-600">Network ID: {network}</p>}
// //     </div>
// //   );
// // };

// // export default WalletConnect;
// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { ethers } from 'ethers';

// const WalletConnect = () => {
//   const [account, setAccount] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [network, setNetwork] = useState(null);

//   // Memoize the provider to avoid re-creating it on each render
//   const provider = useMemo(() => new ethers.JsonRpcProvider("http://127.0.0.1:8545"), []);

//   // Connect to the first account on the local network
//   const connectToLocalhost = async () => {
//     try {
//       const accounts = await provider.listAccounts();
//       if (accounts.length > 0) {
//         // Set account based on whether accounts[0] is a string or an object
//         const address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;
//         setAccount(address);
//       } else {
//         console.warn("No accounts found on the local network.");
//       }
//     } catch (error) {
//       console.error("Failed to connect to local network:", error);
//     }
//   };

//   // Fetch balance for the connected account
//   const getBalance = useCallback(async () => {
//     if (account) {
//       try {
//         const balance = await provider.getBalance(account);
//         setBalance(ethers.utils.formatEther(balance)); // Format the balance to ETH
//       } catch (error) {
//         console.error("Error fetching balance:", error);
//       }
//     }
//   }, [account, provider]);

//   // Fetch and display network ID
//   const getNetwork = useCallback(async () => {
//     try {
//       const networkData = await provider.getNetwork();
//       setNetwork(networkData.chainId);
//     } catch (error) {
//       console.error("Error fetching network:", error);
//     }
//   }, [provider]);

//   // Fetch balance and network when the account changes
//   useEffect(() => {
//     if (account) {
//       getBalance();
//       getNetwork();
//     }
//   }, [account, getBalance, getNetwork]);

//   return (
//     <div className="flex flex-col items-center space-y-4 p-4">
//       <button
//         className="bg-blue-400 text-white px-6 py-3 rounded-lg"
//         onClick={connectToLocalhost}
//       >
//         {account ? `Connected: ${account}` : "Connect to Localhost"}
//       </button>

//       {balance !== null && <p className="text-lg font-semibold">Balance: {balance} ETH</p>}
//       {network !== null && <p className="text-sm text-gray-600">Network ID: {network}</p>}
//     </div>
//   );
// };

// export default WalletConnect;
