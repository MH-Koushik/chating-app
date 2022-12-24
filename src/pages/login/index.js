import React from 'react'
import { useState } from 'react'
import {IoMdEyeOff, IoMdEye} from 'react-icons/io'
import {FcGoogle} from 'react-icons/fc'
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup  } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from  'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';
import { getDatabase, ref, set } from "firebase/database";


const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch();
    const db = getDatabase();

    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")

    let [emailerr,setEmailerr]=useState("")
    let [passworderr,setPassworderr]=useState("")
    let [loading,setLoading]=useState(false)
    let[forgotpassword, setForgotpassword]=useState(false)


    let[passwordshow, setPasswordshow]=useState(false)

    let handleemail=(e)=>{
        setEmail(e.target.value)
        setEmailerr("")
    }
    
    let handlepassword=(e)=>{
        setPassword(e.target.value)
        setPassworderr("")
    }
    let handleGoogleSignIn=()=>{
        signInWithPopup(auth, provider).then((data)=>{
                dispatch(userLoginInfo(data))
                localStorage.setItem("userInfo", JSON.stringify(data))
                toast.success("Login Success! Redirecting.",{
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",});

                setTimeout(()=>{
                    navigate("/")
                },[3000])
            
            set(ref(db, 'users/' + data.user.uid), { // realtime database upload
                username: data.user.displayName,
                email: data.user.email,
                photoURL:data.user.photoURL,
                });
            }
        ).catch((error)=>{
            const errorCode = error.code;
        })
    }

    let handleSubmit=()=>{
        if(!email){
            setEmailerr("Email is required")
        }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
            setEmailerr("Invalid Email")
        }

        if(!password){
            setPassworderr("Password is required")
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email) && password){
            setLoading(true)
            signInWithEmailAndPassword(auth, email, password)
            .then((data)=>{
                toast.success("Login Success! Redirecting.",{
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                setEmail("")
                setPassword("")
                setLoading(false)
                dispatch(userLoginInfo(data.user))
                localStorage.setItem("userInfo", JSON.stringify(data.user))
                setTimeout(() => {
                    navigate("/")
                }, 3000);
                
                set(ref(db, 'users/' + data.user.uid), { // realtime database upload
                    username: data.user.displayName,
                    email: data.user.email,
                    photoURL:data.user.photoURL,
                    });
            })

                .catch((error)=>{
                    const errorCode = error.code;
                    if(errorCode.includes("auth/wrong-password")){
                        setPassworderr("Wrong Password")
                        setLoading(false)
                        setForgotpassword(true)
                    }
                    if(errorCode.includes("auth/user-not-found")){
                        setEmailerr("Mail Not found.")
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

    <div className='w-6/12 flex justify-end items-center h-screen'>
        <div className='mr-16'>
            <h3 className='text-nunito text-heading text-3xl font-bold'>Login to your account!</h3>
            <button onClick={handleGoogleSignIn} className='text-nunito text-heading text-sm font-bold mt-[29px] px-9 py-5 border-2 border-solid border-[#B4B3CA] rounded-lg flex hover:ease-in duration-300 hover:bg-gray-400 hover:text-white'>
                <FcGoogle className='w-[20px] h-[20px] mr-[9px]'/> Login with Google</button>

            <div className='mt-[50px] relative w-[368px]'>
                <p className='text-nunito font-semibold text-inputfont  absolute top-[-13px] left-0'> Email Address</p>
                <input onChange={handleemail} className='w-full outline-0 border-b-2 border-solid border-secondary py-[16px]' type='email' value={email}/>
                {emailerr&& (<p className='text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{emailerr}</p>)}
            </div>

            <div className='mt-[34px] relative w-[368px]'>
                <p className='text-nunito font-semibold text-inputfont  absolute top-[-13px] left-0'> Password</p>
                <input onChange={handlepassword} className='w-full outline-0 border-b-2 border-solid border-secondary py-[16px]' type={passwordshow? "text":"password"} value={password}/>

                {passwordshow?<IoMdEye onClick={()=>setPasswordshow(!passwordshow)} className='absolute top-7 right-3 cursor-pointer w-[40px] h-[20px]'/> 
                : <IoMdEyeOff onClick={()=>setPasswordshow(!passwordshow)} className='absolute top-7 right-3 cursor-pointer w-[40px] h-[20px]'/>}

                {passworderr&& (<p className='text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{passworderr}</p>)}
                
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
                        </div>) : (<button onClick={handleSubmit} className='text-nunito w-[368px] py-5 rounded-lg bg-button mt-12 text-white'> Login to Continue</button>)}
            
            {forgotpassword && (<p className='mt-5 text-center w-[368px] text-opensens font-regular text-sm'>Forgot Password ? <Link to={"/forgotpassword"} className='font-bold text-red-500 cursor-pointer'> Click Here</Link></p>) }
                        
            <p className='mt-5 text-center w-[368px] text-opensens font-regular text-sm'>Don’t have an account ? <Link to={"/registration"} className='font-bold text-span cursor-pointer'> Sign up</Link></p>
        </div>
    </div>

    <div className='w-6/12'>
        <img className='w-full h-screen object-cover' src='./images/login.png'/>
    </div>

</div>
  )
}

export default Login