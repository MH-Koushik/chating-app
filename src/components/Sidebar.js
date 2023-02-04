import React, { useEffect, useState } from 'react'
import {AiOutlineHome} from 'react-icons/ai'
import {FiSettings,FiLogOut} from 'react-icons/fi'
import {FaCloudUploadAlt} from 'react-icons/fa'
import {BsChatDotsFill,BsBell} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut,updateProfile,onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux'
import { userLoginInfo } from '../slices/userSlice'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString,getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import { ThreeCircles } from  'react-loader-spinner'
import { getDatabase, set,update } from "firebase/database";

const Sidebar = () => {
  const storage = getStorage();
  const db = getDatabase();
  const navigate=useNavigate();
  const auth = getAuth();
  const dispatch= useDispatch();
  
  let[uploadErr, setUploadErr]= useState("");

  let [imageUpload,setImageUplaod]=useState(false);

  let userdata=useSelector((state)=>state.userLoginInfo.userInfo)

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  let [loading,setLoading]=useState(false)

  const handleImageUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  
  const getCropData = () => {
    if(cropper){
      if (typeof cropper !== "undefined") {
        setUploadErr("")
        setLoading(true);
        setCropData(cropper.getCroppedCanvas().toDataURL());
        const message4 = cropper.getCroppedCanvas().toDataURL()
        const storageRef = ref(storage, auth.currentUser.uid);
        uploadString(storageRef, message4, 'data_url').then(() => {
          getDownloadURL(storageRef).then((downloadURL) => {
              updateProfile(auth.currentUser, { 
                photoURL: downloadURL,
              }) }).then(()=>{
                  setLoading(false);
                  toast.success("Profile Picture Updated!",{
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",})
            
                  setTimeout(()=>{
                    setImageUplaod(false)
                  },600)
            
                  setImage("");
                  setCropData("")
                  setCropper("")
              })
          });
      }
    }else if (!cropper){
      setUploadErr("Please Chose an Image file to Upload.")
    }
 
  };

useEffect(()=>{
  onAuthStateChanged(auth, (data)=>{
    dispatch(userLoginInfo(data))
    localStorage.setItem("userInfo", JSON.stringify(data))
  })
},[])



  let handleLogout=()=>{
    signOut(auth)
    .then(() => {
      dispatch(userLoginInfo(null))
      localStorage.removeItem("userInfo")
      navigate("/login")
    }).catch((error) => {
      console.log(error)
    });
  }
  let handleImageUploadCancel=()=>{
    setImageUplaod(false);
    setImage("");
    setCropData("")
    setCropper("")
    setUploadErr("")
  }
  let handlechatpage=()=>{

  }

  let userData=useSelector((state)=>state.userLoginInfo.userInfo);

  return (
  <>
    <div className=' h-screen bg-button rounded-[20px] w-[186px] ml-8 overflow-hidden '>
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
      <div className='mt-[38px] '>

        <div className='group w-[100px] h-[100px] mx-auto relative rounded-full'>
          <img src={userData.photoURL} className='rounded-full w-full h-full'/>
          <div onClick={()=>setImageUplaod(true)} className='w-full h-full absolute top-0 left-0 bg-black/[.40] rounded-full flex justify-center items-center  opacity-0 group-hover:opacity-100 cursor-pointer'><FaCloudUploadAlt className=' text-center text-white text-2xl'/></div>
        </div>
        <div className='w-full text-center'><p className='mt-1 text-nunito text-xl font-regular text-white'>{userData.displayName}</p></div>

        <div className="relative z-[1] after:z-[-1] after:absolute after:content-[''] after:top-[-19px] after:left-[20px] after:rounded-l-[20px] after:bg-white after:w-full    after:h-[89px] before:h-[89px] before:absolute before:top-[-19px] before:right-0 before:bg-button before:w-[8px] before:content-[''] before:rounded-l-[20px] before:drop-shadow-lg"><AiOutlineHome className='text-[#5F35F5] mt-[78px] text-[46px] mx-auto'/></div>

        <div className="relative z-[1] after:z-[-1] after:absolute after:content-[''] after:top-[-19px] after:left-[20px] after:rounded-l-[20px] after:bg-none  after:w-full    after:h-[89px] before:h-[89px] before:absolute before:top-[-19px] before:right-0 before:bg-button before:w-[8px] before:content-[''] before:rounded-l-[20px] before:drop-shadow-lg"><BsChatDotsFill onClick={handlechatpage} className='text-[#BAD1FF] mt-[78px] text-[46px] mx-auto'/></div>

        <div className="relative z-[1] after:z-[-1] after:absolute after:content-[''] after:top-[-19px] after:left-[20px] after:rounded-l-[20px] after:bg-none  after:w-full    after:h-[89px] before:h-[89px] before:absolute before:top-[-19px] before:right-0 before:bg-button before:w-[8px] before:content-[''] before:rounded-l-[20px] before:drop-shadow-lg"><BsBell className='text-[#BAD1FF] mt-[78px] text-[46px] mx-auto'/></div>

        <div className="relative z-[1] after:z-[-1] after:absolute after:content-[''] after:top-[-19px] after:left-[20px] after:rounded-l-[20px] after:bg-none  after:w-full    after:h-[89px] before:h-[89px] before:absolute before:top-[-19px] before:right-0 before:bg-button before:w-[8px] before:content-[''] before:rounded-l-[20px] before:drop-shadow-lg"><FiSettings className='text-[#BAD1FF] mt-[78px] text-[46px] mx-auto'/></div>
        
        <div className="relative z-[1] after:z-[-1] after:absolute after:content-[''] after:top-[-19px] after:left-[20px] after:rounded-l-[20px] after:bg-none  after:w-full    after:h-[89px] before:h-[89px] before:absolute before:top-[-19px] before:right-0 before:bg-button before:w-[8px] before:content-[''] before:rounded-l-[20px] before:drop-shadow-lg"><FiLogOut onClick={handleLogout} className='text-[#BAD1FF] mt-[120px] text-[46px] mx-auto cursor-pointer'/></div>
      </div>
    </div>
    {imageUpload &&   
      <div className=' absolute w-full h-full bg-black/[.50] z-50 flex justify-center items-center drop-shadow-2xl'>
        <div className='w-2/4 bg-white rounded-lg p-4 w-full flex justify-center'>
          <div className=''>
            <h3 className='text-nunito text-heading text-4xl font-bold text-center '>Upload Profile Photo</h3>
            {image &&
            (<div className=' mt-4 mx-auto w-[100px] h-[100px] rounded-full overflow-hidden'>
              <div className="img-preview    w-full h-full"></div>
              </div>)}

            <div className='overflow-hidden'>
              <input onChange={handleImageUpload} className='mt-4 mb-4' type="file"/>
              {uploadErr && (<p className=' text-center text-nunito font-semibold bg-red-500 w-[368px] py-1.5 rounded text-white pl-1'>{uploadErr}</p>)}
              {image && (<Cropper
                            style={{ height: 400, width: "100%" }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            minCropBoxHeight={100}
                            minCropBoxWidth={100}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false}
                            onInitialized={(instance) => {
                              setCropper(instance);
                            }}
                            guides={true}/> )}
            </div>


            
            {loading?(<div className='flex justify-center mt-4'>
                          <ThreeCircles
                            height="70"
                            width="70"
                            color="#4fa94d"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel="three-circles-rotating"
                            outerCircleColor=""
                            innerCircleColor=""
                            middleCircleColor=""
                          />
                        </div>):(<div className='text-center mb-4'>
                                    <button onClick={getCropData} className=' text-nunito px-6 py-3 rounded-lg bg-button mt-4 text-white text-2xl font-bold'>Uplaod</button>
                                    <button onClick={handleImageUploadCancel}  className=' text-nunito px-6 py-3 rounded-lg bg-white mt-4 ml-4 text-black  border-2 text-2xl font-bold'>Cancel</button>
                                  </div>)}


          </div>
        </div>
      </div>}
  
  </>
  )
}

export default Sidebar