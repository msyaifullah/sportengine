import { useEffect, useRef, useState } from "react"
import { a, useSpring } from "@react-spring/three"
import { MeshWobbleMaterial, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Level() {
  const { nodes } = useGLTF("/level-react-draco.glb")
  return (
    <mesh
      geometry={
        // @ts-ignore
        nodes.Level.geometry
      }
      material={
        // @ts-ignore
        nodes.Level.material
      }
      position={[-0.38, 0.69, 0.62]}
      rotation={[Math.PI / 2, -Math.PI / 9, 0]}
    />
  )
}

export function Sudo() {
  const { nodes } = useGLTF("/level-react-draco.glb")
  const [spring, api] = useSpring(() => ({ rotation: [Math.PI / 2, 0, 0.29], config: { friction: 40 } }), [])
  useEffect(() => {
    let timeout
    const wander = () => {
      api.start({
        rotation: [Math.PI / 2 + THREE.MathUtils.randFloatSpread(2) * 0.3, 0, 0.29 + THREE.MathUtils.randFloatSpread(2) * 0.2],
      })
      timeout = setTimeout(wander, (1 + Math.random() * 2) * 800)
    }
    wander()
    return () => clearTimeout(timeout)
  }, [api])

  return (
    <>
      <mesh
        geometry={
          // @ts-ignore
          nodes.Sudo.geometry
        }
        material={
          // @ts-ignore
          nodes.Sudo.material
        }
        position={[0.68, 0.33, -0.67]}
        rotation={[Math.PI / 2, 0, 0.29]}
      />
      {/* @ts-ignore */}
      <a.mesh
        geometry={
          // @ts-ignore
          nodes.SudoHead.geometry
        }
        material={
          // @ts-ignore
          nodes.SudoHead.material
        }
        position={[0.68, 0.33, -0.67]}
        {...spring}
      />
    </>
  )
}

export function Camera() {
  const { nodes, materials } = useGLTF("/level-react-draco.glb")
  const [spring, api] = useSpring(() => ({ "rotation-z": 0, config: { friction: 40 } }), [])
  useEffect(() => {
    let timeout
    const wander = () => {
      api.start({ "rotation-z": Math.random() })
      timeout = setTimeout(wander, (1 + Math.random() * 2) * 800)
    }
    wander()
    return () => clearTimeout(timeout)
  }, [api])
  return (
    <a.group position={[-0.58, 0.83, -0.03]} rotation={[Math.PI / 2, 0, 0.47]} {...spring}>
      <mesh
        // @ts-ignore
        geometry={nodes.Camera.geometry}
        // @ts-ignore
        material={nodes.Camera.material}
      />
      <mesh
        geometry={
          // @ts-ignore
          nodes.Camera_1.geometry
        }
        material={materials.Lens}
      />
    </a.group>
  )
}

export function Cactus() {
  const { nodes, materials } = useGLTF("/level-react-draco.glb")
  return (
    <mesh
      geometry={
        // @ts-ignore
        nodes.Cactus.geometry
      }
      position={[-0.42, 0.51, -0.62]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {/* @ts-ignore */}
      <MeshWobbleMaterial factor={0.4} map={materials.Cactus.map} />
    </mesh>
  )
}

export function Box({ scale = 1, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // @ts-ignore
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))
  return (
    <mesh
      {...props}
      // @ts-ignore
      ref={ref}
      scale={(clicked ? 1.5 : 1) * scale}
      onClick={() => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  )
}
