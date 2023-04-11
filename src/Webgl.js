import {Canvas,useFrame, useThree} from '@react-three/fiber'
import {Image,Text,Float,useGLTF,PerspectiveCamera,Html,RoundedBox, Text3D, OrbitControls,Plane,useVideoTexture, Preload} from '@react-three/drei'
import { EffectComposer, HueSaturation,DepthOfField, Bloom, Noise, Vignette, SMAA } from '@react-three/postprocessing'
import { Suspense, useRef, useState,useEffect } from 'react';
import * as THREE from 'three';
import Icons from './Icons';
import {useSpring, animated,config } from '@react-spring/three'

import Box from './Box';
  


export default function Webgl(){

    const [playerhovered,setplayerhovered] = useState(false)
    const [imageshovered,sethovered] = useState(false)

    const [video] = useState(() => {
      const vid = document.createElement("video");
      vid.src = 'screen-video.mp4';
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = false;
      vid.play()
      
     
      return vid;
    });

    const {nodes} = useGLTF('Logo.glb')
    nodes.Logo.material.map.anisotropy = 6
 
 
   function RightImage(props){
     const ref = useRef()
     const texture = useVideoTexture("video-left.mp4")

     const [defaultcolor,setcolor] = useState('#1cbe70')

     function Hovered(){
      video.pause()
      setcolor('#1cbe70')
      
     }
     
     function UnHovered(){
      video.play()
      setcolor('#06F984')
      
     }
     
     useFrame(() =>{ 
      //  ref.current?.material.color.set('#1cbe70')
       ref.current?.material.color.lerp(new THREE.Color(defaultcolor),0.04)

     })
     return(
      //  <Image ref={ref} onPointerEnter={() => video.pause()} onPointerLeave={() => video.play()} toneMapped={false}  position={[3.5,-0.15,0.5]} rotation={[0,-Math.PI * 0.45,0]} scale={[4.5,2.8,1]} url={props.url} tranparent opacity={1} />
       <Plane ref={ref} args={[1.15,2.2]} onPointerEnter={() => Hovered() } onPointerLeave={() => UnHovered()} toneMapped={false}  position={[3.5,-0.15,0.5]} rotation={[0,-Math.PI * 0.45,0]} scale={[4.5,2.8,1]} url={props.url} tranparent opacity={1}>
       <meshPhysicalMaterial side={THREE.DoubleSide} color={'#1cbe70'} map={texture}/>
     </Plane>
     )
   }
 
   function LeftImage(props){
     const ref = useRef()
     const texture = useVideoTexture("video-left.mp4")
 

     const [defaultcolor,setcolor] = useState('#43c1f3')

     useFrame(() =>{
       texture.needsUpdate = true
     })

     function Hovered(){
      video.pause()
      setcolor('#0180D3')
      
     }
     
     function UnHovered(){
      video.play()
      setcolor('#43c1f3')
      
     }
     
     useFrame(() =>{ 
       ref.current?.material.color.lerp(new THREE.Color(defaultcolor),0.04)
     })
     return(
      //  <Image onPointerEnter={() => setcolor('#FF84F4')} onPointerLeave={() => setcolor('#FF37ED')} ref={ref} toneMapped={false} position={[-3.5,-0.25,0]} rotation={[0,Math.PI * 0.45,0]} scale={[5,5,5]} url="artbasel.png" transparent opacity={1} />
      <Plane args={[1.15,1.3]} onPointerEnter={() => Hovered()} onPointerLeave={() => UnHovered()} ref={ref} toneMapped={false} position={[-3.5,-0.25,0]} rotation={[0,Math.PI * 0.45,0]} scale={[5,5,5]} url="artbasel.png" transparent opacity={1}>
      <meshPhysicalMaterial side={THREE.DoubleSide} color={'#43c1f3'} map={texture}/>
    </Plane>
     )
   }
 
   function VideoImage(){
     const texture = useVideoTexture("logovideo.mp4")
 
     return(
       <Plane args={[12,11]} position={[0,0.8,-3.8]}>
         <meshPhysicalMaterial color={'#5D0AE5'} map={texture}/>
       </Plane>
     )
   }
 
   function VideoPlayer(){
    //  const texture = useVideoTexture("video.mp4")
    //  texture.image.classList.add('red')
    //  document.querySelector('.red')?.pause()
   const textureref = useRef()

  
  //  textureref.current?.anisotropy = 8

   //  texture.anisotropy = 8

    //  setTimeout(() =>{
    //   sethovered(true)
    //  },3000)

 
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

 
     return(
       <RoundedBox
    
       position={[0,0,-2]}
       scale={[4.6,2.6,1]}
     args={[1,1,0.2]} // Width, height, depth. Default is [1, 1, 1]
     radius={0.035} // Radius of the rounded corners. Default is 0.05
     smoothness={5} // The number of curve segments. Default is 4
     creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
   >
    <meshStandardMaterial toneMapped={false} >
    <videoTexture ref={textureref} attach="map" args={[video]} />

      </meshStandardMaterial>
     </RoundedBox>
   
     )
   }
 
 
    function Logo(){
 
     const ref = useRef()
 
     useFrame(() =>{
        ref.current.rotation.z += 0.025
     })
      
     return(
     <primitive ref={ref} object={nodes.Logo} position={[-1.45,2.16,-2]} rotation={[Math.PI * 0.5,0,0]} scale={[0.3,0.05,-0.3]}/>
 
     )
    }
 
    function CameraAnimation(){
      const {mouse} = useThree()
 
       const ref = useRef()
       
       useFrame(() =>{
           ref.current?.position.lerp(new THREE.Vector3(0 + (mouse.x * 2),0,5.5 + (mouse.y * 0.5) ),0.055)
           ref.current?.lookAt(0,0,0)
       })
  
      return(
       <PerspectiveCamera ref={ref} fov={60} position={[0,-40,10]} makeDefault />
 
      )
 
    }
 
    function ExploreBtn(){

     const Btnmaterial = useRef()

     const [currentstate,setstate] = useState(false)

     const { scale } = useSpring({
        scale: currentstate ? 1.05 : 1,
       
        config: config.wobbly
    })

    const {rotation} = useSpring({
         from: {
             rotation: [0,0.9,0.4]
         },
         to: {
             rotation: [0,0,0]
         },
         config: {
            mass: 5,
            tension: 400,
            friction: 50,
          },
          immediate: false,
    })
 
     function Btnhovered(e){
       
        setstate(true)
        document.body.style.cursor = 'pointer'
        Btnmaterial.current.emissiveIntensity = 0.8
 
 
     }
 
     function BtnUnhovered(e){
       
       setstate(false)
       document.body.style.cursor = 'default'
       Btnmaterial.current.emissiveIntensity = 0
 
    }

  
   
     const ref = useRef()
 
      useFrame(() =>{
        Btnmaterial.current?.color.lerp(currentstate ? new THREE.Color('#43c1f3') :  new THREE.Color('#191919'),0.07)  

        ref.current.position.lerp(new THREE.Vector3(-0.9,-1.88,-2) ,0.04)
 
      })
       
       return(
        <animated.group dispose={null} rotation={rotation} scale={scale}>
         <RoundedBox
         onPointerEnter={Btnhovered}
         onPointerLeave={BtnUnhovered}
         ref={ref}
        
       position={[-0.9,-1.88,-5]}
     
     args={[1.42,0.5,0.45]} // Width, height, depth. Default is [1, 1, 1]
     radius={0.125} // Radius of the rounded corners. Default is 0.05
     smoothness={5} // The number of curve segments. Default is 4
     creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
   >
    <meshStandardMaterial ref={Btnmaterial} color={'#191919'} toneMapped={false} emissive={'#43c1f3'} emissiveIntensity={0}/>
 
    <Text font={'Audiowide-Regular.ttf'} scale={[0.24,0.24,0.24]} position={[0,0,0.25]} >
     Explore
     <meshStandardMaterial color={'white'} toneMapped={false} emissive={'white'} emissiveIntensity={0.5} />
   </Text>
 
     </RoundedBox>
     </animated.group>
       )
    }
 
    function MintBtn(){
 
     const Btnmaterial = useRef()
     const [currentstate,setstate] = useState(false)

     const { scale } = useSpring({
        scale: currentstate ? 1.05 : 1,
        config: config.wobbly
    })

     function Btnhovered(e){
        setstate(true)
        document.body.style.cursor = 'pointer'
        // Btnmaterial.current.color.set('#1cbe70')
        Btnmaterial.current.emissiveIntensity = 0.8
 
 
     }
 
     function BtnUnhovered(e){
        setstate(false)
       document.body.style.cursor = 'default'
    //    Btnmaterial.current.color.set('#191919')
       Btnmaterial.current.emissiveIntensity = 0
 
    }
 
    
     const ref = useRef()
 
      useFrame(() =>{
        Btnmaterial.current?.color.lerp(currentstate ? new THREE.Color('#1cbe70') :  new THREE.Color('#191919'),0.07)  

        ref.current.position.lerp(new THREE.Vector3(0.9,-1.88,-2) ,0.04)
 
      })
       
       return(
        <animated.group dispose={null} scale={scale}>
         <RoundedBox
         onPointerEnter={Btnhovered}
         onPointerLeave={BtnUnhovered}
       
         ref={ref}
       position={[0.9,-1.88,-5]}
     
     args={[1.3,0.5,0.45]} // Width, height, depth. Default is [1, 1, 1]
     radius={0.125} // Radius of the rounded corners. Default is 0.05
     smoothness={5} // The number of curve segments. Default is 4
     creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
   >
    <meshStandardMaterial ref={Btnmaterial} color={'#191919'} toneMapped={false} emissive={'#1cbe70'} emissiveIntensity={0}/>
 
    <Text font={'Audiowide-Regular.ttf'} scale={[0.24,0.24,0.24]} position={[0,0,0.25]} >
     Mint
     <meshStandardMaterial  color={'white'} toneMapped={false} emissive={'white'} emissiveIntensity={0.5} />
   </Text>
 
     </RoundedBox>
     </animated.group>
       )
    }


 
   return (
 
     <>
     <div className='social-container'>
       <button className='faq-btn'>FAQ</button>
       <div className='social-icons'>

       <i className="bi bi-discord"></i>
       <i className="bi bi-twitter"></i>
       <i className="bi bi-instagram"></i>

       </div>

     </div>
       <Canvas dpr={1.5} gl={{ antialias: false,alpha: false,stencil: false }} camera={ {fov: 60,position: [0,0,8]} }>
     <ambientLight />
 

  <Logo/>
  
 <Text3D position={[-0.95,1.96,-2]} scale={[0.36,0.36,0.36]} font={'Audiowide_Regular.json'}>
   SHARONA
   <meshStandardMaterial color={'#2BCA00'} emissiveIntensity={0}/>
 </Text3D> 
     {/* <Image  toneMapped={false} position={[-3.5,-0.25,0]} rotation={[0,Math.PI * 0.45,0]} scale={[5,5,5]} url="IMAGE.png" transparent opacity={1} /> */}
 
   <Text font={'Audiowide-Regular.ttf'} scale={[0.5,0.5,0.5]} position={[-3.45,1.58,0]} rotation={[0,Math.PI * 0.45,0]} >
     EXPLORE
     <meshStandardMaterial color={'#43c1f3'} toneMapped={false} emissive={'#43c1f3'} emissiveIntensity={2} />
   </Text>
  
   <Text font={'Audiowide-Regular.ttf'} scale={[0.6,0.6,0.6]} position={[3.48,1.65,0.5]} rotation={[0,-Math.PI * 0.45,0]} >
     MINT
     <meshStandardMaterial color={'#1cbe70'} toneMapped={false} emissive={'#1cbe70'} emissiveIntensity={2} />
   </Text>
 
   <ExploreBtn/>
   <MintBtn/>
  

  <CameraAnimation/>
     {/* <OrbitControls/> */}
 
 {/* <VideoImage/> */}
 
 <VideoPlayer/>
  
     
     <RightImage url={'physxdig.png'}/>
 
     <LeftImage/>

     
   

 
 
     <EffectComposer disableNormalPass>
         <Bloom mipmapBlur radius={0.8} intensity={0.85} luminanceThreshold={0} luminanceSmoothing={0.97}  />
         <Noise opacity={0.055} />
         <SMAA/>
         <HueSaturation hue={0} saturation={0.1} />
       </EffectComposer>
     
   <Preload all/>

   </Canvas>
 
   </>
   );
 }