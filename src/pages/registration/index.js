import React, { useState } from 'react'
import {RiEyeCloseFill,RiEyeFill} from 'react-icons/ri'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,updateProfile,  } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from  'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    let [email,setEmail]=useState("")
    let [fullname,setFullname]=useState("")
    let [password,setPassword]=useState("")

    let [emailerr,setEmailerr]=useState("")
    let [fullnameerr,setFullnameerr]=useState("")
    let [passworderr,setPassworderr]=useState("")
    let [success,setSuccess]=useState("")
    let [loading,setLoading]=useState(false)


    let[passwordshow, setPasswordshow]=useState(false)

    let handleemail=(e)=>{
        setEmail(e.target.value)
        setEmailerr("")
        setSuccess("")
    }

    let handlefullname=(e)=>{
        setFullname(e.target.value)
        setFullnameerr("")
        setSuccess("")
    }
    
    let handlepassword=(e)=>{
        setPassword(e.target.value)
        setPassworderr("")
        setSuccess("")
    }

    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    let handleSubmit=()=>{
        if(!email){
            setEmailerr("Email is required")
        }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
            setEmailerr("Invalid Email")
        }

        if(!fullname){
            setFullnameerr("Full name is requireds")
        }

        if(!password){
            setPassworderr("Password is required")
        } else if(!password.match(regularExpression)){
            setPassworderr("Password must be at lest 6 digit long and contain uppercase,lowercase letter and symbol")
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email) && fullname && password.match(regularExpression)){
            setLoading(true)
            createUserWithEmailAndPassword(auth, email, password)
            .then((data)=>{
                updateProfile(auth.currentUser, {
                    displayName: fullname, photoURL: "./images/defaultProPic.png"
                  }).then(() => {
                    toast.success("Registration complete. Please verify your email.",{
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark"
                        });
                    sendEmailVerification(auth.currentUser);
                    setEmail("")
                    setFullname("")
                    setPassword("")
                    setLoading(false)
                    
                    setTimeout(()=>{
                        navigate("/login")
                    },3000)
                  }).then(()=>{
                    set(ref(db, 'users/' + data.user.uid), { // realtime database upload
                        username: data.user.displayName,
                        email: data.user.email,
                        photoURL:data.user.photoURL,
                      });
                  }).catch((error) => {
                        console.log(error)
                  });
                }).catch((error)=>{
                    if(error.code.includes("auth/email-already-in-use")){
                        setEmailerr("Email Already in Use");
                        setLoading(false)
                    }
                })
        }
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

        <div className='w-6/12 flex justify-end'>
            <div className='mr-16 mt-40'>
                <h3 className='text-nunito text-heading text-3xl font-bold'>Get started with easily register</h3>
                <p className='mt-3 text-nunito text-secondary text-xl font-regular'>Free register and you can enjoy it</p>

                <div className='mt-[50px] relative w-[368px]'>
                    <p className='text-nunito font-semibold text-inputfont  absolute top-[-13px] left-[37px] bg-white px-[18px]'> Email Address</p>
                    <input onChange={handleemail} className='w-full border-2 border-solid border-secondary py-6 px-14  rounded-lg' type='email' value={email}/>
                    {emailerr&& (<p className='text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{emailerr}</p>)}
                </div>

                <div className='mt-[34px] relative w-[368px]'>
                    <p className='text-nunito font-semibold text-inputfont  absolute top-[-13px] left-[37px] bg-white px-[18px]'> Full Name</p>
                    <input onChange={handlefullname} className='border-2 w-full border-solid border-secondary py-6 px-14 rounded-lg' type='text' value={fullname}/>
                    {fullnameerr&& (<p className='text-nunito font-semibold bg-red-500 py-1.5 rounded text-white pl-1'>{fullnameerr}</p>)}
                </div>

                <div className='mt-[34px] relative w-[368px]'>
                    <p className='text-nunito font-semibold text-inputfont absolute top-[-13px] left-[37px] bg-white px-[18px]'> Password</p>
                    <input onChange={handlepassword} className='w-full border-2 border-solid border-secondary py-6 px-14  rounded-lg' type={passwordshow? "text":"password"} value={password}/>

                    {passwordshow?<RiEyeFill onClick={()=>setPasswordshow(!passwordshow)} className='absolute top-7 right-5 cursor-pointer'/> 
                    : <RiEyeCloseFill onClick={()=>setPasswordshow(!passwordshow)} className='absolute top-7 right-5 cursor-pointer'/>}

                    {passworderr&& (<p className='text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{passworderr}</p>)}
                    {success&& (<p className='text-nunito font-semibold bg-green-500 w-[368px] py-1.5 rounded text-white pl-1'>{success}</p>)}
                    
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
                            </div>) : (<button onClick={handleSubmit} className='text-nunito w-[368px] py-5 rounded-full bg-button mt-12 text-white'> Sign Up</button>)}
                
                
                
                <p className='mt-9 text-center w-[368px] text-opensens font-regular text-sm'>Already have an account ? <Link to={"/login"} className='font-bold text-span cursor-pointer'>Sign In</Link></p>
            </div>
        </div>

        <div className='w-6/12'>
            <img className='w-full h-screen object-cover' src='./images/registration.png'/>
        </div>

    </div>
  )
  
}

export default Registration;