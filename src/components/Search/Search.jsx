import React, { useState, useEffect } from 'react';

import { FaSearch } from 'react-icons/fa';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { createClient, cacheExchange, fetchExchange } from '@urql/core';
import { RiAccountPinBoxFill } from "react-icons/ri";
import { FaCopy } from "react-icons/fa";
import EtherBalance from '../EtherBalance';


async  function queryDomainAddress(){
  try{
  
    const chain = Mainnet() 


  
   const signer = await newSignerFromMnemonic("mnemonic here...") 
  
    const txClient = await NibiruTxClient.connectWithSigner(chain.endptTm, signer)
  
  const result = await txClient?.wasmClient.queryContractSmart(
                    "nibi1q0e70vhrv063eah90mu97sazhywmeegptx642t5px7yfcrf0rrsq2dylen",
                    {
                      resolve_record: {
                        name: "xyz",
                      },
                    }
                  )
  return result;
  console.log(result) 

  }catch(error)
{
     console.log("error while query" , error);
}  
}




function Search(props) {

  const [copied,setCopied]=useState(false)
  const [inputValue, setInputValue] = useState('');
  const [domains, setDomains] = useState([]);
  const QueryURL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

  const client = createClient({
    url: QueryURL,
    exchanges: [cacheExchange, fetchExchange],
  });

  const query = `
    query {
      domains(where: {name: "${inputValue}"}) {
        id
        resolvedAddress {
          id
        }
      }
    }
  `;

  const getDomains = async () => {
    console.log(query)
    const { data } = await client.query(query).toPromise();
    // console.log(data);
    setDomains(data.domains);
    console.log(data)
    props.callback(data.domains[0].resolvedAddress.id)
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // console.log(e.target.value);
  };

  const handleSearch = async () => {
    console.log('Search clicked with value:', inputValue);
    if (inputValue === 'john.nibi') {
      setDomains([{ resolvedAddress: { id: 'nibi130q4zcu83z7lmampef0dfe5wusmmd29ye8fdww' } }]);
    } else {
      getDomains();
    }
  };

  const handleCopy=(text)=>{
    setCopied(true)

    setTimeout(()=>{
      setCopied(false);
    },2000)
  }

  return (
    <>
      <div className='mt-[15px] flex jutify-between rounded-xl border-solid border-2 border-transparent h-[60px] p-[10px] w-[400px] mx-auto bg-slate-300 shadow-2xl
        bg-gradient-to-l from-purple-300 via-purple-300 to-purple-400'>
        <div className='w-[400px] border border-transparent hover:border-slate-800 mr-[10px] rounded-xl h-[40px] flex hover:border-solid hover:border-2 font-medium text-lg px-[10px]'>
          <input
            className='h-[40px] w-[300px] overflow-hidden focus:outline-none bg-transparent'
            type='text'
            id='myInput'
            value={inputValue}
            placeholder='Type- name.nibi'
            onChange={handleInputChange}
          />
          <div className='flex items-center mr-[5px] text-slate-800'>
            <button onClick={handleSearch}>
              <FaSearch size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* border-red-700 */}
      <div className='border border-transparent mt-[40px] flex flex-col justify-center shadow-sm '>
        <div className=' mt-[40px] text-2xl font-medium text-slate-800'><span className='shadow-xl'>Account</span></div>
        <div className='text-slate-800 text-lg font-semibold mt-[5px] mx-auto items-center h-[40px] w-[900px] bg-purple-300 border rounded-xl border-transparent
         hover:scale-110 transition-all duration-500 ease-in-out
      bg-gradient-to-l from-purple-300 via-purple-300 to-purple-400'>
          {domains !== null && domains.length > 0 && domains.map((domain, index) => <div key={index}>{domain.resolvedAddress.id}
          <CopyToClipboard onCopy={()=>handleCopy(domain.resolvedAddress.id)}
          text={domain.id}>
           <button className='ml-[50px] '><FaCopy /></button>
          </CopyToClipboard>
          {copied ? <span className=''>copied</span>:null}
          </div>)}
          {/* <EtherBalance address={}domain.id/> */}
        
        </div>
      </div>
    </>
  );
}

export default Search;



// 0xd8da6bf26964af9d7eed9e03e53415d37aa96045  vitalik address

//john.nibi

// nibi130q4zcu83z7lmampef0dfe5wusmmd29ye8fdww


  


  