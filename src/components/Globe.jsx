import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html, useTexture, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';
import DestinationCard from './DestinationCard';

// Converts lat/lng to Vector3 for marker positioning
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

const Marker = ({ position, city, isTarget, onClick, onOpenModal }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const htmlRef = useRef();
  const { camera } = useThree();

  const isHighlighted = isTarget || hovered;

  useFrame((state) => {
    if (meshRef.current && htmlRef.current) {
      const worldPos = meshRef.current.getWorldPosition(new THREE.Vector3());
      const camVec = camera.position.clone().normalize();
      const markerVec = worldPos.clone().normalize();
      const dot = camVec.dot(markerVec);
      
      let opacity = THREE.MathUtils.clamp((dot + 0.1) * 5.0, 0, 1);
      
      let scale = 1;
      if (isHighlighted) {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.2;
        scale = 1.3 * pulse;
        opacity = Math.max(opacity, 0.4); 
      }

      htmlRef.current.style.opacity = opacity;
      htmlRef.current.style.visibility = opacity <= 0.05 ? 'hidden' : 'visible';
      htmlRef.current.style.transform = `translateY(-30%) scale(${scale})`;
      
      // Disable DOM click hitboxes when the city rotates behind the planet
      htmlRef.current.style.pointerEvents = opacity <= 0.2 ? 'none' : 'auto';
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Invisible anchor mesh */}
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      
      <Html center zIndexRange={[100, 0]} style={{ zIndex: isHighlighted ? 100 : 10 }}>
        <div 
          ref={htmlRef}
          onMouseEnter={() => {
            if (htmlRef.current.style.pointerEvents !== 'none') {
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }
          }}
          onMouseLeave={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
             e.stopPropagation();
             onClick(position);
          }}
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            transition: 'transform 0.2s ease-out',
            willChange: 'opacity, transform, visibility',
            cursor: 'pointer'
          }}
        >
          <MapPin 
            size={isHighlighted ? 35 : 25} 
            color={city.isCustom ? (isHighlighted ? "#ffffff" : "#ff0044") : (isHighlighted ? "#ffffff" : "#00ccff")} 
            fill={city.isCustom ? (isHighlighted ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 0, 68, 0.3)") : (isHighlighted ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 204, 255, 0.2)")}
            strokeWidth={isHighlighted ? 3 : 2.5}
            style={{ filter: `drop-shadow(0px 0px ${isHighlighted ? '15px rgba(255,255,255,0.8)' : (city.isCustom ? '8px #ff0044' : '8px #00ccff')})` }}
          />

          {isHighlighted && (
            <div style={{
              marginTop: '15px',
              transform: 'scale(0.70)',
              transformOrigin: 'top center',
              width: '280px',
              pointerEvents: 'auto'
            }}
            onMouseLeave={() => setHovered(false)}
            >
               <DestinationCard 
                 id={city.id}
                 imageSrc={city.thumbnail}
                 title={city.name}
                 lat={city.lat}
                 lng={city.lng}
                 onClick={(e) => {
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (onOpenModal) onOpenModal(city);
                 }}
               />
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
};

const Globe = ({ cities = [], focusCityId, onOpenModal, onInteract }) => {
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();
  
  const [isFocused, setIsFocused] = useState(false);
  const [targetWorldPos, setTargetWorldPos] = useState(null);
  const [wantsReset, setWantsReset] = useState(false);

  const radius = 2.0;

  const markers = useMemo(() => {
    return cities.map(city => ({
      ...city,
      pos: latLngToVector3(city.lat, city.lng, radius + 0.02)
    }));
  }, [cities]);

  const triggerFocus = (localPos) => {
    const wPos = localPos.clone();
    // Convert local sphere pos tracking to absolute world space
    if (groupRef.current) {
        groupRef.current.localToWorld(wPos);
    }
    setTargetWorldPos(wPos);
    setIsFocused(true);
  };

  useEffect(() => {
    if (focusCityId) {
      const targetCity = markers.find(m => m.id === focusCityId);
      if (targetCity) {
        triggerFocus(targetCity.pos);
        setWantsReset(false);
      }
    } else {
      setIsFocused(false);
      setWantsReset(true);
    }
  }, [focusCityId, markers]);

  useFrame((state, delta) => {
    if (wantsReset) {
      camera.position.lerp(new THREE.Vector3(0, 0, 5.5), 0.05);
      if (camera.position.distanceTo(new THREE.Vector3(0, 0, 5.5)) < 0.05) {
        setWantsReset(false);
      }
    }

    if (groupRef.current && !isFocused) {
      // Use rendering delta clock to ensure smooth, slow rotation independent of screen refresh rates! 
      groupRef.current.rotation.y += 0.025 * delta; 
    }
    
    if (controlsRef.current) {
      if (isFocused && targetWorldPos) {
        // Linearly interpolate camera position moving close dynamically
        const targetCamPos = targetWorldPos.clone().normalize().multiplyScalar(3.2); // Hover bounds 
        camera.position.lerp(targetCamPos, 0.05);
      }
      controlsRef.current.update();
    }
  });

  // Load realistic earth textures
  const [colorMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        enableZoom={true} 
        minDistance={2.5} 
        maxDistance={8} 
        onStart={() => {
          setIsFocused(false);
          if (onInteract) onInteract();
        }}
      />
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1.5} />
      <group ref={groupRef}>
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-5, 0, 5]} intensity={1.0} color="#0088ff" />
        
        {/* Soft volumetric atmospheric halo */}
        <Sphere args={[radius * 1.08, 64, 64]}>
          <shaderMaterial
            vertexShader={`
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec3 vNormal;
              void main() {
                // Calculate rim intensity based on angle to camera
                float intensity = pow(max(0.0, 0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                gl_FragColor = vec4(0.0, 0.7, 1.0, 1.0) * intensity * 1.0;
              }
            `}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Inner surface glow (Optional edge blend over the earth itself) */}
        <Sphere args={[radius * 1.005, 64, 64]}>
          <shaderMaterial
            vertexShader={`
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec3 vNormal;
              void main() {
                float intensity = pow(max(0.0, 0.85 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.0);
                gl_FragColor = vec4(0.1, 0.6, 1.0, 1.0) * intensity * 0.7;
              }
            `}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>

        {/* Realistic Standard Physical Earth */}
        <Sphere args={[radius, 64, 64]}>
          <meshPhongMaterial 
            map={colorMap}
            specularMap={specularMap}
            specular={new THREE.Color('#333333')}
            shininess={15}
          />
        </Sphere>

        {/* Markers */}
        {markers.map((city, idx) => (
          <Marker 
            key={idx} 
            position={city.pos.toArray()} 
            city={city} 
            isTarget={focusCityId === city.id}
            onClick={(pos) => triggerFocus(new THREE.Vector3(...pos))} 
            onOpenModal={onOpenModal}
          />
        ))}
      </group>
    </>
  );
};

export default Globe;
