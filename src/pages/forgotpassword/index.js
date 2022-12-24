import React from 'react'
import { useState } from 'react'
import{IoMdEyeOff, IoMdEye} from 'react-icons/io'
import { getAuth,sendPasswordResetEmail  } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from  'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    let [email,setEmail]=useState("")
    let [emailerr,setEmailerr]=useState("")
    let [loading,setLoading]=useState(false)

    
    let handlepasswordreset=()=>{
        setLoading(true)

        if(!email){
            setEmailerr("Email is required.")
            setLoading(false)
        }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
            setEmailerr("Invalid Email")
            setLoading(false)
        }
        
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            sendPasswordResetEmail(auth, email)
            .then(() => {
                setLoading(false)
                toast.success('Check your Email for Password Reset.', {
                    position: "bottom-center",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                setEmail("")
                setTimeout(()=>{
                    navigate("/login")
                },5000)
            })
            .catch((error) => {
                setLoading(false)
                const errorCode = error.code;
                if(errorCode.includes("auth/user-not-found")){
                    setEmailerr("Email does not match.")
                    setLoading(false)
                }
            });
        }
    }

    let handleemail=(e)=>{
        setEmail(e.target.value)
        setEmailerr("")
    }

    

  return (

    <div className='flex'>
        <ToastContainer position="bottom-center"
            autoClose={6000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"/>
        <div className='w-6/12 flex justify-end items-center h-screen'>
            <div className='mr-16'>
                <h3 className='text-nunito text-heading text-3xl font-bold'>Reset Your Password</h3>
                <div className='mt-[50px] relative w-[368px]'>
                    <p className='text-nunito font-semibold text-inputfont  absolute top-[-13px] left-0'> Email Address</p>
                    <input onChange={handleemail} className='w-full outline-0 border-b-2 border-solid border-secondary py-[16px]' type='email' value={email}/>
                    {emailerr&& (<p className='text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{emailerr}</p>)}
                </div>

                {loading?(<div className='flex justify-center w-[368px] mt-12'>
                                <Puff
                                height="50"
                                width="50"
                                radisu={1}
                                color="#4fa94d"
                                ariaLabel="puff-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true} />
                            </div>) : (<div><button onClick={handlepasswordreset} className='text-nunito w-[180px] py-4 rounded-lg bg-button mt-12 text-white mr-[5px]'>Conffirm</button><button onClick={()=>navigate("/login")} className='text-nunito w-[180px] py-4 rounded-lg bg-button mt-12 text-white'> Cancel</button></div>)}
                            
            </div>
        </div>

            <div className='w-6/12'>
                <img className='w-full h-screen object-cover' src='./images/login.png'/>
            </div>

    </div>
  )
}

export default ForgotPassword