import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { showGroupCreate } from '../slices/creatGroupSlice';
import { getStorage, ref as refimg, uploadString,getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase,ref, onValue,set, push, update} from "firebase/database";
import { ThreeCircles } from  'react-loader-spinner'
const CreateGroup = () => {
  const storage = getStorage();
  let dispatch = useDispatch();
  let [groupName, setGroupName]= useState("");
  let [groupNameError, setGroupNameError]= useState("");
  let [showCreateGroupHome, setShowCreateGroupHome]= useState(true);
  let [showGroupPhoto,setShowGroupPhoto]=useState(false);
  let [loading,setLoading]=useState(false);
  let [imageUploadGroupKey,setImageUploadGroupKey]=useState();


  const db = getDatabase();
  let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
  let [creatGroupMemberlist, setCreatGroupMemberlist] = useState([]);


  
 

  let handleImageUploadCancel=()=>{
    dispatch(showGroupCreate(false))
    setGroupName("")
    setImage("");
    setCropData("")
    setCropper("")
  }


  let handleinput=(e)=>{
    setGroupNameError("")
    setGroupName(e);
  }

  let handleCreatGroupCancel=()=>{
    setGroupName("");
    dispatch(showGroupCreate(false));
  }

  let handleCreateGroup=()=>{
    if(!groupName){
      setGroupNameError("Group Name Required!")
    }else{
      set(push(ref(db, 'group' )), {
        groupName: groupName,
        adminId: userdata.uid,
        adminName: userdata.displayName,
      }).then(()=>{
        setShowCreateGroupHome(false)
        setShowGroupPhoto(true)
      })
    }
  }
  useEffect(()=>{
    const userRef = ref(db, 'group');
    onValue(userRef, (snapshot) => {
        let imageGroupKey
        snapshot.forEach((item)=>{
            if(userdata.uid==item.val().adminId && groupName==item.val().groupName){
              imageGroupKey= item.key;
            }
            
        })
        setImageUploadGroupKey(imageGroupKey);
    });

},[handleCreateGroup])

const [image, setImage] = useState();
const [cropData, setCropData] = useState("#");
const [cropper, setCropper] = useState();


let [uploadErr,setUploadErr]=useState("")

const handleImageUpload = (e) => {
  e.preventDefault();
  let files;
  if (e.dataTransfer) {
    setUploadErr("")
    files = e.dataTransfer.files;
  } else if (e.target) {
    setUploadErr("")
    files = e.target.files;
  }
  const reader = new FileReader();
  reader.onload = () => {
    setImage(reader.result);
  };
  reader.readAsDataURL(files[0]);
};


const getCropData = () => {
  setLoading(true)
  if(cropper){
    if (typeof cropper !== "undefined") {
      setUploadErr("")
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL()
      const storageRef = refimg(storage, imageUploadGroupKey);
      uploadString(storageRef, message4, 'data_url').then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          update(ref(db, 'group/'+ imageUploadGroupKey), {
            photoURL: downloadURL,
          })
             }).then(()=>{
                setGroupName("")
                setImage("");
                setCropData("")
                setCropper("")
                dispatch(showGroupCreate(false))
                setLoading(false)
            })
        });
    }
  }else if (!cropper){
    setLoading(false)
    setUploadErr("Please Chose an Image file to Upload.")
  }

};


  let handleShowAddMembercancel=()=>{
    setShowCreateGroupHome(true)
  }

  let memberarr=[];
  let handleAddMember=(item)=>{
    // memberarr.push(item);
    // setCreatGroupMemberlist(memberarr);
    setCreatGroupMemberlist(item);
  }

  return (


    <div className=' absolute w-full h-full bg-black/[.50] z-50 flex justify-center items-center drop-shadow-2xl '>
        <div className='w-2/4 bg-white rounded-lg p-4 '>
          {showCreateGroupHome? 
            (<div className='text-center'>
              <div className='flex justify-center'>
                <div className='w-2/4'>
                  <h3 className='text-nunito text-heading text-3xl font-bold mb-[15px]'>Enter Group Name</h3>
                  <input onChange={(e)=>handleinput(e.target.value)} className='w-full border-2 border-solid border-secondary py-4 px-4  rounded-lg' type='text' value={groupName}/>
                  {groupNameError && (<p className='text-nunito font-semibold bg-red-500 w-full py-1.5 rounded text-white'>{groupNameError}</p>)}
                </div>
              </div>

              <div>
              </div>

              <div>
                <button onClick={handleCreateGroup}  className=' text-nunito px-6 py-3 rounded-lg bg-button mt-4 text-white text-2xl font-bold mr-4'>Creat Group</button>
                <button onClick={handleCreatGroupCancel}  className=' text-nunito text-black px-6 py-3 rounded-lg bg-white mt-4 text-white text-2xl font-bold border-2 border-gray-400'>Cancel</button>
              </div>
            </div>)
            :
                  (<div className=' bg-white rounded-lg p-4 w-full flex justify-center'>
                    <div className=''>
                      <h3 className='text-nunito text-heading text-4xl font-bold text-center '>Upload Group Photo</h3>
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
                        </div>)
                        :
                        (<div className='text-center mb-4'>
                                      <button onClick={getCropData} className=' text-nunito px-6 py-3 rounded-lg bg-button mt-4 text-white text-2xl font-bold'>Uplaod</button>
                                      <button onClick={handleImageUploadCancel}  className=' text-nunito px-6 py-3 rounded-lg bg-white mt-4 ml-4 text-black  border-2 text-2xl font-bold'>Cancel</button>
                        </div>)}


                    </div>
                </div>)}

        </div>

    </div>
















  )
}

export default CreateGroup